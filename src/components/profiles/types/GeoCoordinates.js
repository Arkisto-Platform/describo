export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        {
            property: "latitude",
            "@type": "Text",
            required: true,
            multiple: false,
        },
        {
            property: "longitude",
            "@type": "Text",
            required: true,
            multiple: false,
        },
    ],
};
