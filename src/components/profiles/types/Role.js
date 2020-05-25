export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "name",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "http://purl.org/spar/pro/relatesToPerson",
            "@type": ["Person"],
            multiple: false,
            group: "important",
        },
        {
            property: "http://purl.org/spar/pro/relatesToOrganization",
            "@type": ["Organization"],
            multiple: false,
            group: "important",
        },
    ],
};
