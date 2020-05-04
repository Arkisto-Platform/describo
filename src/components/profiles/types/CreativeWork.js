export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "description", "@type": "TextArea", multiple: false },
        { property: "identifier", "@type": "Text" },
    ],
};
