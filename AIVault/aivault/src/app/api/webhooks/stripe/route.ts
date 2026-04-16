import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Required: raw body for Stripe signature verification
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {
      // ── One-time purchase completed ─────────────────────────────────────────
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const { purchase_id } = pi.metadata

        if (purchase_id) {
          await admin
            .from('purchases')
            .update({ status: 'completed', stripe_charge_id: pi.latest_charge as string })
            .eq('id', purchase_id)

          // Send notification to creator
          const { data: purchase } = await admin
            .from('purchases')
            .select('track_id, buyer_id, tracks(creator_id)')
            .eq('id', purchase_id)
            .single()

          if (purchase?.tracks) {
            const track = purchase.tracks as { creator_id: string }
            await admin.from('notifications').insert({
              user_id: track.creator_id,
              type: 'new_subscriber',
              actor_id: purchase.buyer_id,
              track_id: purchase.track_id,
            })
          }
        }
        break
      }

      // ── Subscription created ────────────────────────────────────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const { subscriber_id, creator_id } = sub.metadata

        if (subscriber_id && creator_id) {
          await admin
            .from('creator_subscriptions')
            .upsert({
              subscriber_id,
              creator_id,
              stripe_subscription_id: sub.id,
              stripe_price_id: sub.items.data[0]?.price.id,
              status: sub.status as any,
              price_cents: sub.items.data[0]?.price.unit_amount ?? 0,
              current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            }, { onConflict: 'subscriber_id,creator_id' })

          if (event.type === 'customer.subscription.created') {
            await admin.from('notifications').insert({
              user_id: creator_id,
              type: 'new_subscriber',
              actor_id: subscriber_id,
            })
          }
        }
        break
      }

      // ── Subscription cancelled ──────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await admin
          .from('creator_subscriptions')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      // ── Stripe Connect account updated ──────────────────────────────────────
      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        const isEnabled = account.charges_enabled && account.payouts_enabled
        await admin
          .from('profiles')
          .update({ stripe_account_enabled: isEnabled })
          .eq('stripe_account_id', account.id)
        break
      }

      default:
        // Ignore unhandled event types
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
