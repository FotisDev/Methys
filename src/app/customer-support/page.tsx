import { createMetadata } from "@/components/SEO/metadata";
import { getSupportPageStructuredData } from "@/_lib/schemasGenerators/supportPageStructureData";
import SupportFormPageComponent from "@/components/pages/SupportFormPageComponent";
import Schema from "@/components/schemas/SchemaMarkUp";
import { getSupportCategories } from "@/_lib/backend/SupportCategories/action";
import { HeaderProvider } from "@/components/providers/HeaderProvider";

export const metadata = createMetadata({
  MetaTitle: "Support | Methys",
  MetaDescription:
    "Submit a support ticket for billing, bugs, account issues, or feature requests. Our team will get back to you shortly.",
  canonical: "/customer-support",
});

export default async function SupportPage() {
  const supportCategories = await getSupportCategories();
  const schemaMarkUp = getSupportPageStructuredData();

  return (
    <>
      {schemaMarkUp && <Schema markup={schemaMarkUp} />}
      <HeaderProvider  forceOpaque={false}>
        <main className="relative min-h-screen flex items-center justify-center px-4">
          <img
            src="/yo.jpg"
            alt="Support Background"
            className="fixed inset-0 w-full h-full object-cover -z-10"
          />
          <div className="fixed inset-0 bg-black/30 -z-5"></div>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 relative z-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Support</h1>
            <p className="text-gray-500 mb-6 text-sm">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
            <SupportFormPageComponent categories={supportCategories ?? []} />
            <div className="mt-6 text-center">
              <a
                href={"/"}
                className="text-vintage-green font-bold hover:underline"
              >
                Go to main page
              </a>
            </div>
          </div>
        </main>
      </HeaderProvider>
    </>
  );
}
