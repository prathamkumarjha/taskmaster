import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, orgId } = auth();
  const user = await currentUser();

  // Check if the user is authenticated
  if (!userId || !orgId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settingsUrl = absoluteUrl(`/dashboard/${orgId}`);
  let url = "";

  try {
    // Check if the organization has a Stripe subscription
    const orgSubscription = await prismadb.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    // If the organization already has a Stripe customer, open the billing portal
    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      // If no customer exists, create a checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Taskmaster Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 2000, 
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    // Return error response if something goes wrong
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }

  // Return the Stripe session URL in the response
  return NextResponse.json({ data: url });
}
