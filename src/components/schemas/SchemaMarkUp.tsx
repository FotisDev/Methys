export default function Schema({ markup }: { markup?: object }) {
  if (!markup) return;

  return (
    <script
      type="application/ld+json"
      // Escaping "<" stops text from the database closing the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(markup).replace(/</g, "\\u003c"),
      }}
    />
  );
}
