import { createMetadata } from "@/components/SEO/metadata";
import { getSupportPageStructuredData } from "@/_lib/schemasGenerators/supportPageStructureData";
import SupportFormPageComponent from "@/components/pages/SupportFormPageComponent";
import Schema from "@/components/schemas/SchemaMarkUp";
import { getSupportCategories } from "@/_lib/backend/SupportCategories/action";

export const metadata = createMetadata({
  MetaTitle: "Support | YourAppName",
  MetaDescription:
    "Submit a support ticket for billing, bugs, account issues, or feature requests. Our team will get back to you shortly.",
  canonical: "/support",
});

export default async function SupportPage() { 
  const supportCategories = await getSupportCategories();
  const schemaMarkUp = getSupportPageStructuredData();

  return (
    <>
      {schemaMarkUp && <Schema markup={schemaMarkUp} />}

      <main className="min-h-screen bg-gray-50 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Support</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
          <SupportFormPageComponent categories={supportCategories ?? []} />
        </div>
      </main>
    </>
  );
}