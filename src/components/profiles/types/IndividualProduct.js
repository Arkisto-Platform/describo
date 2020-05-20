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
        { property: "description", "@type": "TextArea", multiple: false },
        { property: "URL", "@type": "Text", multiple: false },
        {
            property: "manufacturer",
            "@type": "Type",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "model",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "serialNumber",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
    ],
};
