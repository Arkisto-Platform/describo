export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "value", "@type": "Text", required: true, multiple: false },
    ],
};
