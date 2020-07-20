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
            property: "description",
            "@type": "TextArea",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "agent",
            "@type": "Person",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "instrument",
            "@type": "IndividualProduct",
            required: true,
            multiple: true,
            group: "important",
        },
        { property: "endTime", "@type": "Date" },
        { property: "object", "@type": "Place" },
        {
            property: "result",
            "@type": ["File", "Dataset"],
            group: "important",
        },
    ],
};
