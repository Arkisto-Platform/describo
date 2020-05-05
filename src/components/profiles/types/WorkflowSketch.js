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
        { property: "about", "@type": ["Workflow"], group: "important" },
        { property: "encodingFormat", "@type": "Text", multiple: false },
    ],
};
