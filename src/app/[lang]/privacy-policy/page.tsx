import getPrivacyPolicy, {
  PrivacyPolicyBackendType,
} from "@/_lib/backend/privacyPolicy/action";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { createMetadata } from "@/components/SEO/metadata";

export async function generateMetadata() {
  const privacyPolicy = await getPrivacyPolicy();

  return createMetadata({
    MetaTitle: "Privacy Policy | Methys",
    MetaDescription:
      "Learn how Methys collects, uses, and protects your personal data.",
    OpenGraphImageUrl:
      "/storage/v1/object/public/OpenGraphImages/privacy-policy.jpg",
    canonical: "/privacy-policy",
    dateModified: privacyPolicy?.updated_at,
    datePublished: privacyPolicy?.created_at,

    other: {
      "twitter:card": "summary_large_image",
      "twitter:title": "Privacy Policy | Methys",
      "twitter:description":
        "Learn how Methys handles your personal data, cookies, and your rights.",
    },
  });
}

export default async function PrivacyPolicy() {

  const privacyPolicy: PrivacyPolicyBackendType | null = await getPrivacyPolicy();

  if (!privacyPolicy) return <p>Page not found</p>;

  return (
    <HeaderProvider forceOpaque={true}>
      <section
        aria-label="Privacy & Policy"
        className="mt-16 font-serif custom-container-4xl padding-x padding-y"
      >
        <div className=" whitespace-pre-line flex flex-col items-center ">
          <h1 className="text-vintage-green text-lg  flex mb-10">
            {privacyPolicy.title}
          </h1>
          <div
            className="max-w-4xl leading-snug text-vintage-green"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
          />
          <p className="text-sm opacity-70 pt-10">
            Last updated:{" "}
            <time dateTime={privacyPolicy.updated_at}>
              {new Date(privacyPolicy.updated_at).toLocaleDateString()}
            </time>
          </p>
        </div>
      </section>
      <Footer />
    </HeaderProvider>
  );
}
