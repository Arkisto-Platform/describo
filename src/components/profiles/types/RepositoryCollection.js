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
            property: "title",
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
        { property: "rights", "@type": "Text" },
        { property: "publisher", "@type": ["Organization"] },
        { property: "hasMember", "@type": ["RepositoryObject"] },
    ],
};
