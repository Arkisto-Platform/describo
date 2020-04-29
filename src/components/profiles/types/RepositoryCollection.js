export default {
    inputs: [
        { property: "title", "@type": "Text", required: true },
        { property: "description", "@type": "TextArea" },
        { property: "rights", "@type": "Text" },
        { property: "publisher", "@type": ["Organization"] },
        { property: "hasMember", "@type": ["RepositoryObject"] },
    ],
};
