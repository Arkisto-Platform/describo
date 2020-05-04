export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "title", "@type": "Text", required: true, multiple: false },
        { property: "description", "@type": "TextArea", multiple: false },
        { property: "rights", "@type": "Text" },
        { property: "publisher", "@type": ["Organization"] },
        { property: "hasMember", "@type": ["RepositoryObject"] },
    ],
};
