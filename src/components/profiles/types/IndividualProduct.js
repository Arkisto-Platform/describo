export default {
    inputs: [
        { property: "name", "@type": "Text", required: true },
        { property: "description", "@type": "Text" },
        { property: "URL", "@type": "Text" },
        {
            property: "manufacturer",
            "@type": "Select",
            options: ["Olympus", "Panasonic"],
        },
        { property: "model", "@type": "Text" },
        { property: "serialNumber", "@type": "Text" },
    ],
};
