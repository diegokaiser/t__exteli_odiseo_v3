import apis from '@/apis';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe error stripe/webhook/route.ts, invalid signature', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== 'paid') {
          console.warn('Session not paid');
          break;
        }
        const appointmentId = session.metadata?.appointmentId;
        if (!appointmentId) {
          console.error('No appointmentId in metadata');
          break;
        }
        await apis.calendar.ConfirmEventStripe(appointmentId);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const appointmentId = session.metadata?.appointmentId;
        if (!appointmentId) {
          console.error('No appointmentId in metadata');
          break;
        }
        await apis.calendar.CancelEventStripe(appointmentId);
        break;
      }

      default:
        console.log(`Evento ignorado: ${event.type}`);
    }
  } catch (err) {
    console.error('Stripe error stripe/webhook/route.ts, webhook processing error', err);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
