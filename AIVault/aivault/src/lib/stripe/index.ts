import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? 10)

/**
 * Calculate fees for a transaction.
 * Returns amount_cents, platform_fee_cents, creator_payout_cents.
 */
export function calculateFees(amountCents: number) {
  const platformFeeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100))
  const creatorPayoutCents = amountCents - platformFeeCents
  return { amountCents, platformFeeCents, creatorPayoutCents }
}

/**
 * Create a Stripe Connect account for a creator.
 * Returns the account ID to store on the profile.
 */
export async function createConnectAccount(email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })
  return account.id
}

/**
 * Generate a Stripe Connect onboarding link.
 */
export async function createConnectOnboardingLink(accountId: string, baseUrl: string) {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${baseUrl}/settings/payouts?refresh=true`,
    return_url: `${baseUrl}/settings/payouts?success=true`,
    type: 'account_onboarding',
  })
  return link.url
}

/**
 * Create a payment intent for a track or prompt pack purchase.
 * Uses Stripe Connect to route funds to the creator.
 */
export async function createPurchaseIntent({
  amountCents,
  creatorStripeAccountId,
  metadata,
}: {
  amountCents: number
  creatorStripeAccountId: string
  metadata: Record<string, string>
}) {
  const { platformFeeCents } = calculateFees(amountCents)

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    application_fee_amount: platformFeeCents,
    transfer_data: { destination: creatorStripeAccountId },
    metadata,
    automatic_payment_methods: { enabled: true },
  })
}

/**
 * Create or retrieve a Stripe customer for a user.
 */
export async function getOrCreateCustomer(userId: string, email: string) {
  const existing = await stripe.customers.search({
    query: `metadata['supabase_user_id']:'${userId}'`,
    limit: 1,
  })
  if (existing.data.length > 0) return existing.data[0]

  return stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })
}
