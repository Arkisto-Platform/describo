export default {
    inputs: [
        { property: "name", "@type": "Text", required: true },
        {
            property: "contactType",
            "@type": "Value",
            value: "customer service",
        },
        { property: "email", "@type": "Text", required: true },
    ],
};
