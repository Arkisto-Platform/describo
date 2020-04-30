export default {
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "description", "@type": "TextArea", multiple: false },
        { property: "URL", "@type": "Text", multiple: false },
        {
            property: "manufacturer",
            "@type": "Type",
            required: true,
            multiple: false,
        },
        { property: "model", "@type": "Text", required: true, multiple: false },
        {
            property: "serialNumber",
            "@type": "Text",
            required: true,
            multiple: false,
        },
    ],
};
