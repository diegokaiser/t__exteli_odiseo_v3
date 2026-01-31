import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { appointmentId, serviceName, price, customerEmail } = body;

    if (!appointmentId || !price) {
      return NextResponse.json(
        { error: 'Datos incompletos (appointmentId o price)' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        appointmentId: String(appointmentId),
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/calendar/reserva/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/calendar/reserva/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return NextResponse.json({ error: 'Error al crear la sesión de pago' }, { status: 500 });
  }
}
