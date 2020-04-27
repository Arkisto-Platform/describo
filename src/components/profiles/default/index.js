export default {
    // You can define as many root datasets as you like. If there's more
    //  than one a selector will be shown.
    Dataset: {
        metadata: {
            about:
                "Some pithy text about what this is and why the user should select it",
            version: 1,
        },
        inputs: [
            {
                // the schema element to write this data against
                property: "name",

                // the label to display - otherwise the last element of property is shown
                label: "Name",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Text",

                // whether this element is required - used by strict
                required: true,
                help: "A name for this crate.",
            },
            {
                property: "description",
                label: "Description",
                "@type": "TextArea",
                help: "A description of the content of this crate.",
            },
            {
                property: "keywords",
                "@type": "Text",
                help: "A description of the content of this crate.",
                multiple: true,
            },
            {
                property: "datePublished",
                label: "Date Published",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Date",
                help: "The date of publication crate.",
            },
            {
                property: "audience",
                label: "Audience",
                "@type": "Select",
                options: [
                    "Researchers",
                    "Archivists",
                    "Librarians",
                    "Management",
                ],
            },
            {
                property: "author",
                label: "Author",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": ["Person", "Organization"],

                // can there be multiple authors?
                multiple: true,
                required: true,
            },
            {
                property: "publisher",
                label: "Publisher",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Organization",

                required: true,
                multiple: true,
            },
            {
                property: "contactPoint",
                label: "Contact Point",
                "@type": "ContactPoint",
                required: true,
                multiple: true,
            },
            {
                property: "citation",
                label: "Citation",
                "@type": "ScholarlyArticle",
                multiple: true,
            },
            {
                property: "funder",
                label: "Funder",
                "@type": "Organisation",
                multiple: true,
            },
        ],
    },
};
