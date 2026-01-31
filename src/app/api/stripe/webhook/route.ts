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
    console.error('Stripe error stripe/webhook/route.ts', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const appointmentId = session.metadata?.appointmentId;
      console.log('Pago OK;', appointmentId);

      // TODO: guardar en DB
      // await confirmAppointment(appointmentId);
      break;

    case 'checkout.session.expired':
      console.log('Pago expirado');
      break;

    case 'payment_intent.payment_failed':
      console.log('Pago fallido');
      break;
    default:
      console.log(`Evento ignorado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
