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
        { property: "about", "@type": ["Workflow"], group: "important" },
        { property: "encodingFormat", "@type": "Text", multiple: false },
    ],
};
