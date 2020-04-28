export default {
    inputs: [
        { property: "name", "@type": "Text", required: true },
        { property: "description", "@type": "Text" },
        { property: "URL", "@type": "Text" },
        { property: "manufacturer", "@type": "Type", required: true },
        { property: "model", "@type": "Text", required: true },
        { property: "serialNumber", "@type": "Text", required: true },
    ],
};
