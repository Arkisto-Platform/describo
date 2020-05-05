export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "name",
            "@type": "Text",
            required: true,
            group: "important",
        },
        {
            property: "journal",
            "@type": "Text",
            required: true,
            group: "important",
        },
        { property: "issn", "@type": "Text", required: true },
        { property: "identifier", "@type": "Text", required: true },
        {
            property: "datePublished",
            "@type": "Date",
            required: true,
            group: "important",
        },
        { property: "author", "@type": "Person", group: "important" },
    ],
};
