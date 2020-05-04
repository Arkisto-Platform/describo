export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        { property: "name", "@type": "Text", required: true, multiple: false },
        { property: "familyName", "@type": "Text", multiple: false },
        { property: "givenName", "@type": "Text", multiple: false },
        {
            property: "contactPoint",
            "@type": "Text",
            multiple: false,
        },
        { property: "email", "@type": "Text", multiple: false },
        { property: "affiliation", "@type": "Organization", multiple: false },
    ],
};
