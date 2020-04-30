export default {
    inputs: [
        { property: "name", "@type": "Text", required: true },
        { property: "journal", "@type": "Text", required: true },
        { property: "issn", "@type": "Text", required: true },
        { property: "identifier", "@type": "Text", required: true },
        { property: "datePublished", "@type": "Date", required: true },
        { property: "author", "@type": "Person" },
    ],
};
