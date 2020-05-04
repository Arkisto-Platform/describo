export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "'@type",
            value: '["File", "SoftwareSourceCode", "Script"]',
            required: true,
        },
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "description", "@type": "TextArea", multiple: false },
        { property: "license", "@type": "CreativeWork" },
        { property: "author", "@type": ["Person", "Organization"] },
    ],
};
