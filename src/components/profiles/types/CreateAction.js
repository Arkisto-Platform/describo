export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        {
            property: "description",
            "@type": "TextArea",
            required: true,
            multiple: false,
        },
        {
            property: "agent",
            "@type": "Person",
            required: true,
            multiple: false,
        },
        {
            property: "instrument",
            "@type": "IndividualProduct",
            required: true,
            multiple: true,
        },
        { property: "endTime", "@type": "Date" },
        { property: "object", "@type": "Place" },
        { property: "result", "@type": ["File", "Dataset"] },
    ],
};
