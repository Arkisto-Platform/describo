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
            property: "contactType",
            "@type": "Value",
            value: "customer service",
        },
        {
            property: "email",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        { property: "identifier", "@type": "Text", multiple: false },
        { property: "url", "@type": "Text", multiple: false },
    ],
};
