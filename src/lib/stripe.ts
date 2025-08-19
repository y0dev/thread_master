import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    jobsPerMonth: 3,
    priority: false,
    formats: ['DST'],
    features: ['3 jobs per month', 'DST format only', 'Basic support']
  },
  BASIC: {
    name: 'Basic',
    price: 9.99,
    jobsPerMonth: 25,
    priority: false,
    formats: ['DST', 'PES', 'JEF'],
    features: ['25 jobs per month', 'Multiple formats', 'Email support']
  },
  PRO: {
    name: 'Pro',
    price: 29.99,
    jobsPerMonth: 100,
    priority: true,
    formats: ['DST', 'PES', 'JEF', 'EXP', 'VP3'],
    features: ['100 jobs per month', 'All formats', 'Priority processing', 'Priority support']
  }
} as const
