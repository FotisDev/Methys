import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type SearchParams = Promise<{ session_id?: string }>;

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return <div>Invalid Session</div>;
  }
  const session = await stripe.checkout.sessions.retrieve(session_id);

  return (
    <div>
      <h1>Payment successfull!</h1>
      <p>Order confirmed for {session.customer_details?.email}</p>
    </div>
  );
}
