import { CircleQuestionMark } from "lucide-react"

export default function PlansPage() {

  const features = [
    "Unlimited Saved CodeSync",
    "Unlimited Collaborators",
    "View Only Mode",
    "No Ads including collaborators",
    "Default CodeSync Settings",
  ];

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">
        <h1 className="text-5xl mb-12 text-center">Upgrade to CodeSync Pro</h1>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-8 flex flex-col items-center">
            <div className="text-3xl text-blue-600 font-semibold mb-1">Free</div>
            <div className="text-sm text-blue-600 mb-6">$0/month</div>

            <p className="mb-4">20 Saved CodeSync</p>
            <p className="mb-4">Unlimited Collaborators</p>
          </div>

          <div className="border rounded-lg p-8 flex flex-col items-center">
            <div className="text-3xl text-blue-600 font-semibold mb-1">Pro</div>
            <div className="text-sm text-blue-600 mb-6">$49/month</div>
            <div className="flex flex-col items-center justify-center gap-4">
              {
              features.map((feature) => (
                <div className="flex items-center justify-center gap-2">
                  <p key={feature} className="">{feature}</p>
                  <CircleQuestionMark size={23} color={"#fff"} fill={"#8a8a8ab3"} cursor={"pointer"} />
                </div>
              ))
            }
            </div>
            <button className="mt-4 cursor-pointer w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600">
              Upgrade Now
            </button>
          </div>
        </div>

        <p className="mt-10 text-sm text-center">
          Payments processed securely with Stripe.
        </p>

        <p className="mt-4 text-center text-sm">
          Need something more custom or robust for your company?
          <a className="text-blue-600"> Contact us for custom plans.</a>
        </p>
      </div>
    </>
  );
}