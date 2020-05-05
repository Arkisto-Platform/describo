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
        { property: "description", "@type": "TextArea", multiple: false },
        { property: "uri", "@type": "Text", multiple: false },
        { property: "identifier", "@type": "Text", multiple: false },
        { property: "geo", "@type": "GeoCoordinates", group: "important" },
    ],
};
