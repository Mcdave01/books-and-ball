// Registration page: collects academy signup details from prospective players.
import { Goal } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useState } from 'react'

export default function RegistrationForm() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white print:p-4">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-orange-500 pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-4">
            <Goal className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Books & Ball</h1>
            <h2 className="text-xl text-orange-600 font-semibold">Basketball Academy</h2>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Player Registration Form</h3>
        <p className="text-gray-600">Please fill out this form completely and return it to the academy</p>
      </div>

      <form className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input type="date" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade *</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400">
                <option value="">Select Grade</option>
                <option value="6">6th Grade</option>
                <option value="7">7th Grade</option>
                <option value="8">8th Grade</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Position</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400">
                <option value="">Select Position</option>
                <option value="pg">Point Guard</option>
                <option value="sg">Shooting Guard</option>
                <option value="sf">Small Forward</option>
                <option value="pf">Power Forward</option>
                <option value="c">Center</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Physical Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <input type="text" placeholder="e.g., 5'8&quot;" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input type="text" placeholder="e.g., 145 lbs" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jersey Size</label>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400">
                <option value="">Select Size</option>
                <option value="s">Small</option>
                <option value="m">Medium</option>
                <option value="l">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Player Documentary
              </label>
              <input
              type="text" 
              placeholder='https://youtube.com/watch?v=xxxx'
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className='w-full border rounded-lg p-2'
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Contact Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School *</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
              <input type="tel" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Emergency Contact Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
              <input type="text" placeholder="e.g., Parent, Guardian" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone *</label>
              <input type="tel" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Emergency Phone</label>
              <input type="tel" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Medical Information
          </h4>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions, Allergies, or Special Needs
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400"
                placeholder="Please list any medical conditions, allergies, medications, or special needs..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Information
              </label>
              <input
                type="text"
                placeholder="Insurance provider and policy number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Basketball Experience */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Basketball Experience
          </h4>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Basketball Experience
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400"
                placeholder="Please describe your previous basketball experience, teams played for, achievements, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goals and Expectations
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400"
                placeholder="What are your basketball goals? What do you hope to achieve at Books & Ball Academy?"
              />
            </div>
          </div>
        </div>

        {/* Parent/Guardian Agreement */}
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-red-800 mb-4">
            Parent/Guardian Agreement
          </h4>

          <div className="space-y-4 text-sm text-gray-700">
            <p>
              I give permission for my child to participate in all Books & Ball Basketball Academy activities,
              including practices, games, and travel. I understand that participation involves risks and I
              assume all such risks.
            </p>

            <p>
              I agree to pay all fees and charges associated with my child's participation. I understand
              that fees are non-refundable except as specified in the academy's policies.
            </p>

            <p>
              I certify that the information provided above is true and complete. I understand that providing
              false information may result in termination of participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Signature</label>
              <div className="border-b-2 border-gray-400 pb-2">
                <input type="text" placeholder="Print name" className="w-full bg-transparent border-none focus:outline-none print:border-b print:border-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Print name clearly</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 print:border print:border-gray-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-300">
          <p className="text-gray-600 text-sm">
            {siteConfig.fullName} | {siteConfig.contact.address}<br />
            Phone: {siteConfig.contact.displayPhone} | Email: {siteConfig.contact.email}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This form was completed on {new Date().toLocaleDateString()}
          </p>
        </div>
      </form>
    </div>
  )
}

