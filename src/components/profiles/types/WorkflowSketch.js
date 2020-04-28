export default {
    inputs: [
        {
            property: "'@type",
            value: '["File", "ImageObject", "WorkflowSketch"]',
            required: true,
        },
        { property: "name", "@type": "Text", required: true },
        { property: "encodingFormat", "@type": "Text" },
        { property: "about", "@type": ["Workflow"] },
    ],
};
