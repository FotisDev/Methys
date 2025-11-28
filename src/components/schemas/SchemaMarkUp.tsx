
export default function Schema({ markup }: { markup?: object }) {
    if (!markup) return;

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(markup) }} />;
}







