export default {
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        {
            property: "contactType",
            "@type": "Value",
            value: "customer service",
        },
        { property: "email", "@type": "Text", required: true, multiple: false },
        { property: "identifier", "@type": "Text", multiple: false },
        { property: "url", "@type": "Text", multiple: false },
    ],
};
