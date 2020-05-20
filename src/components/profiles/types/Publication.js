export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "@id",
            "@type": "Text",
            multiple: false,
        },
        {
            property: "name",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "journal",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "issn",
            "@type": "Text",
            required: true,
            group: "important",
            multiple: false,
        },
        {
            property: "identifier",
            "@type": "Text",
            required: true,
            group: "important",
            multiple: false,
        },
        {
            property: "datePublished",
            "@type": "Date",
            required: true,
            group: "important",
            multiple: false,
        },
        { property: "author", "@type": "Person", group: "important" },
    ],
};
