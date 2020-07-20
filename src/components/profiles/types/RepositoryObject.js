export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "title",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        { property: "description", "@type": "TextArea", group: "important" },
        { property: "rights", "@type": "Text" },
        { property: "rightsHolder", "@type": "Text" },
        { property: "originalFormat", "@type": "Text" },
        { property: "identifier", "@type": "Text" },
        { property: "license", "@type": ["CreativeWork"], group: "important" },
        { property: "publisher", "@type": ["Organization"] },
        { property: "hasFile", "@type": ["Dataset", "File"] },
    ],
};
