export default {
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "url", "@type": "Text", required: true, multiple: false },
        {
            property: "version",
            "@type": "Text",
            required: true,
            multiple: false,
        },
    ],
};
