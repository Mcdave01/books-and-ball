'use client'

// Dashboard home: live stat cards that update in real-time via Supabase channels.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Eye, Newspaper, Trophy, Users,
  RefreshCw, CheckCircle, AlertTriangle, UserPlus,
  TrendingUp, Clock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ─────────────────────────────────────────────────────────────────

interface StatResult {
  totalPlayers: number
  activePlayers: number
  inactivePlayers: number
  graduatedPlayers: number
  upcomingEvents: number
  totalEvents: number
  recentNews: number
  totalNews: number
  potwPlayerName: string | null
  potwActive: boolean
  lastFetched: Date
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'partial' | 'error'
interface TableError { table: string; message: string }

// ─── Skeleton card ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-100 rounded w-2/3" />
          <div className="h-7 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

// ─── Animated counter ───────────────────────────────────────────────────────

function AnimatedCount({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const start = prev.current
    const end = value
    if (start === end) return
    const steps = 20
    const diff = end - start
    let step = 0
    const timer = setInterval(() => {
      step++
      setDisplayed(Math.round(start + (diff * step) / steps))
      if (step >= steps) { setDisplayed(end); prev.current = end; clearInterval(timer) }
    }, 18)
    return () => clearInterval(timer)
  }, [value])

  return <>{displayed}</>
}

// ─── Stat card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string; value: number | string; sub?: string
  gradient: string; border: string; textColor: string
  icon: React.ReactNode; href: string; index: number
}
function StatCard({ label, value, sub, gradient, border, textColor, icon, href, index }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.07 }}>
      <Link href={href} className={`block bg-white rounded-2xl shadow-sm border-l-4 ${border} p-6 hover:shadow-lg transition-all duration-300 group`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-0.5 truncate">{label}</p>
            <p className={`text-3xl font-black ${textColor} leading-none mb-1`}>
              {typeof value === 'number' ? <AnimatedCount value={value} /> : value}
            </p>
            {sub && <p className="text-xs text-gray-400 font-semibold truncate">{sub}</p>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const supabase = useMemo(() => createClient(), [])

  const [stats, setStats] = useState<StatResult>({
    totalPlayers: 0, activePlayers: 0, inactivePlayers: 0, graduatedPlayers: 0,
    upcomingEvents: 0, totalEvents: 0, recentNews: 0, totalNews: 0,
    potwPlayerName: null, potwActive: false, lastFetched: new Date(),
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
  setMounted(true)
}, [])


  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')
  const [tableErrors, setTableErrors] = useState<TableError[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // Each table is fetched independently via Promise.allSettled.
  // One failed table (e.g. events table not yet created) will NOT zero out
  // the other counts — only that table's card shows the stale/zero value.
  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setFetchStatus('loading')
    else setRefreshing(true)

    const errors: TableError[] = []

    const [playersRes, eventsRes, newsRes, potwRes] = await Promise.allSettled([
      supabase.from('players').select('id, status'),
      supabase.from('events').select('id, date'),
      supabase.from('news').select('id, published_at'),
      supabase
        .from('player_of_the_week')
        .select('id, is_active, player:players(first_name, last_name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1),
    ])

    // Players
    let totalPlayers = 0, activePlayers = 0, inactivePlayers = 0, graduatedPlayers = 0
    if (playersRes.status === 'fulfilled' && !playersRes.value.error) {
      const rows = playersRes.value.data ?? []
      totalPlayers   = rows.length
      activePlayers  = rows.filter(r => r.status === 'active').length
      inactivePlayers = rows.filter(r => r.status === 'inactive').length
      graduatedPlayers = rows.filter(r => r.status === 'graduated').length
    } else {
      errors.push({ table: 'players', message: playersRes.status === 'rejected' ? String(playersRes.reason) : (playersRes.value.error?.message ?? 'unknown') })
    }

    // Events
    let totalEvents = 0, upcomingEvents = 0
    const now = new Date()
    if (eventsRes.status === 'fulfilled' && !eventsRes.value.error) {
      const rows = eventsRes.value.data ?? []
      totalEvents    = rows.length
      upcomingEvents = rows.filter(r => r.date && new Date(r.date) >= now).length
    } else {
      const msg = eventsRes.status === 'rejected' ? String(eventsRes.reason) : (eventsRes.value.error?.message ?? 'unknown')
      if (!msg.includes('does not exist')) errors.push({ table: 'events', message: msg })
    }

    // News
    let totalNews = 0, recentNews = 0
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    if (newsRes.status === 'fulfilled' && !newsRes.value.error) {
      const rows = newsRes.value.data ?? []
      totalNews  = rows.length
      recentNews = rows.filter(r => r.published_at && new Date(r.published_at) >= thirtyDaysAgo).length
    } else {
      const msg = newsRes.status === 'rejected' ? String(newsRes.reason) : (newsRes.value.error?.message ?? 'unknown')
      if (!msg.includes('does not exist')) errors.push({ table: 'news', message: msg })
    }

    // Player of the Week
    let potwActive = false, potwPlayerName: string | null = null
    if (potwRes.status === 'fulfilled' && !potwRes.value.error) {
      const rows = potwRes.value.data ?? []
      if (rows.length > 0) {
        potwActive = true
        const p = rows[0].player ?. [0]
        if (p) {potwPlayerName = `${p.first_name} ${p.last_name}`
      }
    }
    // PGRST116 = no rows — not treated as error

    setStats({ totalPlayers, activePlayers, inactivePlayers, graduatedPlayers, upcomingEvents, totalEvents, recentNews, totalNews, potwActive, potwPlayerName, lastFetched: new Date() })
    setTableErrors(errors)
    setFetchStatus(errors.length === 0 ? 'success' : errors.length < 3 ? 'partial' : 'error')
    setRefreshing(false)
  }, [supabase])

  // Initial load
  useEffect(() => { fetchStats() }, [fetchStats])

  // Real-time Supabase subscriptions — silently re-fetch on any DB change
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => fetchStats(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchStats(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => fetchStats(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_of_the_week' }, () => fetchStats(true))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase, fetchStats])

  const isLoading = fetchStatus === 'idle' || fetchStatus === 'loading'
  const fmtTime = (d: Date) => d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Coach Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Live overview — counts update automatically on any change</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
           {mounted && (
  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
    <Clock className="h-3.5 w-3.5" />
    Synced: {fmtTime(stats.lastFetched)}
  </span>
)}
            <AnimatePresence mode="wait">
              {fetchStatus === 'success' && (
                <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs font-black text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  <CheckCircle className="h-3.5 w-3.5" /> Live
                </motion.span>
              )}
              {fetchStatus === 'partial' && (
                <motion.span key="part" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs font-black text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
                  <AlertTriangle className="h-3.5 w-3.5" /> Partial data
                </motion.span>
              )}
              {fetchStatus === 'error' && (
                <motion.span key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs font-black text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                  <AlertTriangle className="h-3.5 w-3.5" /> DB error
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={() => fetchStats(false)}
              disabled={isLoading || refreshing}
              className="flex items-center gap-1.5 text-xs font-black text-gray-600 bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 px-4 py-1.5 rounded-full shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing || isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Per-table error notices */}
        <AnimatePresence>
          {tableErrors.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-yellow-800 mb-1">Some tables could not be reached. Other counts are still live and accurate.</p>
                  <ul className="text-xs text-yellow-700 space-y-0.5">
                    {tableErrors.map(e => (
                      <li key={e.table}><span className="font-bold capitalize">{e.table}:</span> {e.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard label="Total Players" value={stats.totalPlayers}
              sub={`${stats.activePlayers} active · ${stats.inactivePlayers} inactive · ${stats.graduatedPlayers} graduated`}
              gradient="from-orange-400 to-red-500" border="border-orange-500" textColor="text-orange-600"
              icon={<Users className="h-6 w-6 text-white" />} href="/dashboard/players" index={0} />
            <StatCard label="Active Players" value={stats.activePlayers}
              sub={`${stats.totalPlayers > 0 ? Math.round((stats.activePlayers / stats.totalPlayers) * 100) : 0}% of total roster`}
              gradient="from-green-500 to-teal-500" border="border-green-500" textColor="text-green-600"
              icon={<UserPlus className="h-6 w-6 text-white" />} href="/dashboard/players" index={1} />
            <StatCard label="Upcoming Events" value={stats.upcomingEvents}
              sub={`${stats.totalEvents} total · ${Math.max(0, stats.totalEvents - stats.upcomingEvents)} past`}
              gradient="from-blue-500 to-indigo-600" border="border-blue-500" textColor="text-blue-600"
              icon={<CalendarDays className="h-6 w-6 text-white" />} href="/dashboard/events" index={2} />
            <StatCard label="News (30 days)" value={stats.recentNews}
              sub={`${stats.totalNews} total articles published`}
              gradient="from-purple-500 to-pink-600" border="border-purple-500" textColor="text-purple-600"
              icon={<Newspaper className="h-6 w-6 text-white" />} href="/dashboard/news" index={3} />
          </div>
        )}

        {/* Player of the Week banner */}
        {!isLoading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            className={`mb-8 rounded-2xl border-l-4 p-5 flex items-center justify-between gap-4 shadow-sm ${
              stats.potwActive ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                stats.potwActive ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-gray-200 to-gray-300'
              }`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-0.5">Player of the Week</p>
                <p className={`text-xl font-black ${stats.potwActive ? 'text-yellow-700' : 'text-gray-400'}`}>
                  {stats.potwActive ? (stats.potwPlayerName ?? 'Featured — name unavailable') : 'Not set for this week'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {stats.potwActive ? 'Currently showing on the public homepage' : 'Feature a standout player to display on the homepage'}
                </p>
              </div>
            </div>
            <Link href="/dashboard/player-of-the-week"
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-sm ${
                stats.potwActive ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600' : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}
            >
              {stats.potwActive ? 'Update Selection' : 'Set Player'}
            </Link>
          </motion.div>
        )}

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/dashboard/players', label: 'Add Player',        sub: 'Create new player profile',  gradient: 'from-orange-400 to-red-500',   bg: 'from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100',       border: 'border-orange-100', icon: <UserPlus    className="h-5 w-5 text-white" /> },
                { href: '/dashboard/events',  label: 'Manage Events',     sub: 'Schedule training & games',  gradient: 'from-blue-500 to-indigo-600',  bg: 'from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100',     border: 'border-blue-100',   icon: <CalendarDays className="h-5 w-5 text-white" /> },
                { href: '/dashboard/news',    label: 'Publish News',      sub: 'Share academy updates',      gradient: 'from-green-500 to-teal-600',   bg: 'from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100',       border: 'border-green-100',  icon: <Newspaper   className="h-5 w-5 text-white" /> },
                { href: '/dashboard/player-of-the-week', label: 'Player of Week', sub: 'Feature a standout', gradient: 'from-yellow-400 to-orange-500', bg: 'from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100', border: 'border-yellow-100', icon: <Trophy      className="h-5 w-5 text-white" /> },
                { href: '/players',           label: 'Public Roster',     sub: 'Preview player listing',     gradient: 'from-purple-500 to-pink-600',  bg: 'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100',     border: 'border-purple-100', icon: <Eye         className="h-5 w-5 text-white" /> },
                { href: '/coach',             label: 'Upload Profiles',   sub: 'Coach upload portal',        gradient: 'from-teal-500 to-cyan-600',    bg: 'from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100',         border: 'border-teal-100',   icon: <Users       className="h-5 w-5 text-white" /> },
              ].map((a, i) => (
                <Link key={i} href={a.href}
                  className={`flex items-center gap-3 p-4 bg-gradient-to-r ${a.bg} border ${a.border} rounded-xl transition-all duration-200 group`}>
                  <div className={`w-10 h-10 bg-gradient-to-br ${a.gradient} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                    {a.icon}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">{a.label}</div>
                    <div className="text-xs text-gray-500">{a.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Academy overview progress bars */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">Academy Overview</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-5">
              {[
                { label: 'Active Players',       value: stats.activePlayers,   total: Math.max(stats.totalPlayers, 1), color: 'from-orange-400 to-red-500',   text: 'text-orange-600' },
                { label: 'Upcoming Events',      value: stats.upcomingEvents,  total: Math.max(stats.totalEvents, 1),  color: 'from-blue-500 to-indigo-600', text: 'text-blue-600'   },
                { label: 'Recent Articles (30d)', value: stats.recentNews,     total: Math.max(stats.totalNews, 1),    color: 'from-green-500 to-teal-500',  text: 'text-green-600'  },
                { label: 'Graduated Players',    value: stats.graduatedPlayers, total: Math.max(stats.totalPlayers, 1), color: 'from-purple-500 to-pink-500', text: 'text-purple-600' },
              ].map((row, i) => {
                const pct = isLoading ? 0 : Math.min(100, Math.round((row.value / row.total) * 100))
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-gray-600">{row.label}</span>
                      <span className={`text-sm font-black ${row.text}`}>{isLoading ? '—' : row.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        className={`bg-gradient-to-r ${row.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Roster breakdown pills */}
            {!isLoading && stats.totalPlayers > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Roster Breakdown</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1.5 rounded-full">{stats.activePlayers} Active</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">{stats.inactivePlayers} Inactive</span>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full">{stats.graduatedPlayers} Graduated</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Coach's corner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-7 text-white">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black mb-2 text-orange-300">Coach's Corner</h3>
              <p className="text-blue-100 leading-relaxed italic">
                "Champions aren't made in the gyms. Champions are made from something they have deep inside them — a desire, a dream, a vision."
              </p>
              <p className="text-orange-400 text-sm font-bold mt-2">— Muhammad Ali</p>
            </div>
            <Trophy className="h-16 w-16 opacity-15 flex-shrink-0" aria-hidden="true" />
          </div>
        </motion.div>

      </div>
    </div>
  )
}
