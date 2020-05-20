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
            property: "latitude",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "longitude",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
    ],
};
