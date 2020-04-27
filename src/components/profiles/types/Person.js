export default {
    inputs: [
        { property: "name", "@type": "Text", required: true },
        { property: "familyName", "@type": "Text" },
        { property: "givenName", "@type": "Text" },
        {
            property: "contactPoint",
            "@type": "Text",
        },
        { property: "email", "@type": "Text" },
    ],
};
