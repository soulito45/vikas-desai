import {
  BriefcaseBusiness,
  Building2,
  HandCoins,
  Home,
  Landmark,
  MessageSquareMore,
} from 'lucide-react'

export const services = [
  {
    id: 'residential-properties',
    icon: Home,
    title: 'Residential Properties',
    description: 'Guidance for home buyers and families looking for the right residential property in local areas such as Mira Road East.',
    link: '/properties',
  },
  {
    id: 'resale-assistance',
    icon: HandCoins,
    title: 'Resale Assistance',
    description: 'Support for resale flat buyers and sellers with property evaluation and practical guidance based on the local market.',
    link: '/services',
  },
  {
    id: 'new-under-construction',
    icon: Building2,
    title: 'New & Under-Construction Projects',
    description: 'Consultation for new launches and under-construction options with a focus on budget fit and location suitability.',
    link: '/projects',
  },
  {
    id: 'commercial-properties',
    icon: BriefcaseBusiness,
    title: 'Commercial Properties',
    description: 'Property guidance for office, retail, and commercial needs across the Mira Road and Bhayandar area.',
    link: '/properties',
  },
  {
    id: 'finance-consultancy',
    icon: Landmark,
    title: 'Finance Consultancy',
    description: 'Home-loan and finance support with guidance that helps buyers understand affordability and documentation needs.',
    link: '/contact',
  },
  {
    id: 'property-consultation',
    icon: MessageSquareMore,
    title: 'Property Consultation',
    description: 'Personal consultation for buying, selling, and investment decisions based on local market knowledge and practical advice.',
    link: '/about',
  },
]
