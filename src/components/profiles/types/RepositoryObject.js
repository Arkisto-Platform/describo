export default {
    inputs: [
        { property: "title", "@type": "Text", required: true, multiple: true },
        { property: "description", "@type": "TextArea", multiple: true },
        { property: "rights", "@type": "Text" },
        { property: "rightsHolder", "@type": "Text", multiple: true },
        { property: "originalFormat", "@type": "Text" },
        { property: "identifier", "@type": "Text" },
        { property: "license", "@type": ["CreativeWork"] },
        { property: "publisher", "@type": ["Organization"] },
        { property: "hasFile", "@type": ["Dataset", "File"] },
    ],
};
