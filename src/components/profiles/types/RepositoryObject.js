export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "title", "@type": "Text", required: true },
        { property: "description", "@type": "TextArea" },
        { property: "rights", "@type": "Text" },
        { property: "rightsHolder", "@type": "Text" },
        { property: "originalFormat", "@type": "Text" },
        { property: "identifier", "@type": "Text" },
        { property: "license", "@type": ["CreativeWork"] },
        { property: "publisher", "@type": ["Organization"] },
        { property: "hasFile", "@type": ["Dataset", "File"] },
    ],
};
