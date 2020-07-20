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
            multiple: false,
            group: "important",
        },
        {
            property: "hasPart",
            "@type": ["WorkflowSketch"],
            group: "important",
        },
        { property: "license", "@type": "CreativeWork" },
        { property: "author", "@type": ["Person", "Organization"] },
    ],
};
