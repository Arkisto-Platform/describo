export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "'@type",
            value: '["File", "ImageObject", "WorkflowSketch"]',
            required: true,
        },
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "encodingFormat", "@type": "Text", multiple: false },
        { property: "about", "@type": ["Workflow"] },
    ],
};
