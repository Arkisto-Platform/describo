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
            property: "version",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        { property: "url", "@type": "Text", required: true, multiple: false },
    ],
};
