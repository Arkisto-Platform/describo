export default {
    inputs: [
        { property: "name", "@type": "Text", required: true },
        { property: "description", "@type": "Text" },
        { property: "uri", "@type": "Text" },
        { property: "identifier", "@type": "Text" },
        { property: "geo", "@type": "GeoCoordinates" },
    ],
};
