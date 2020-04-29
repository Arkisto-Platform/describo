export default {
    inputs: [
        {
            property: "'@type",
            value: '["File", "SoftwareSourceCode", "Script"]',
            required: true,
        },
        { property: "name", "@type": "Text", required: true },
        { property: "description", "@type": "TextArea" },
        { property: "license", "@type": "CreativeWork" },
        { property: "author", "@type": ["Person", "Organization"] },
    ],
};
