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
            property: "value",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
    ],
};
