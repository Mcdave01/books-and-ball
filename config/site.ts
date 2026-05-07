// Central site content used by shared layout components and repeated page sections.
export const siteConfig = {
  name: 'Books & Ball',
  fullName: 'Books & Ball Basketball Academy',
  description: 'Developing champions on and off the court.',
  logo: '/bnbLogo.jpeg',
  contact: {
    phone: '15551234567',
    message: "Hi! I'd like to learn more about Books & Ball Basketball Academy.",
    address: '123 Basketball Court, Sports City, SC 12345',
    email: 'info@booksandball.com',
    displayPhone: '(555) 123-4567',
  },
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Players', href: '/players' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ],
  programs: [
    'Summer Elite Camp',
    'Tournament Teams',
    'Skills Workshops',
    'Private Coaching',
    'College Prep',
  ],
  socials: [
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'Twitter', href: 'https://twitter.com' },
  ],
}
