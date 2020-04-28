export default {
    inputs: [
        {
            property: "'@type",
            value: '["File", "SoftwareSourceCode", "Workflow"]',
            required: true,
        },
        { property: "name", "@type": "Text", required: true },
        { property: "description", "@type": "Text" },
        { property: "license", "@type": "CreativeWork" },
        { property: "author", "@type": ["Person", "Organization"] },
    ],
};
