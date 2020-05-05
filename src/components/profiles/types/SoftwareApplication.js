export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
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
