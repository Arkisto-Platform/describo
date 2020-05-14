export default {
    metadata: {
        name: "Describo Default Profile",
        version: 1.0,
    },
    // You can define as many root datasets as you like. If there's more
    //  than one a selector will be shown.
    items: {
        Dataset: {
            metadata: {
                about:
                    "Some pithy text about what this is and why the user should select it",
                version: 1,
                allowAdditionalProperties: true,
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
                    multiple: false,
                    help: "A name for this crate.",
                    group: "important",
                },
                {
                    property: "description",
                    label: "Description",
                    "@type": "TextArea",
                    help: "A description of the content of this crate.",
                    multiple: false,
                    group: "important",
                },
                {
                    property: "license",
                    label: "License",
                    "@type": "CreativeWork",
                    help: "A license for this crate",
                    multiple: false,
                    group: "important",
                },
                {
                    property: "keywords",
                    "@type": "Text",
                    help: "A description of the content of this crate.",
                    multiple: false,
                },
                {
                    property: "datePublished",
                    label: "Date Published",
                    multiple: false,
                    // the type of element: one of the core types in components/CrateCreator/components
                    "@type": "Date",
                    help: "The date of publication crate.",
                    group: "important",
                },
                {
                    property: "author",
                    label: "Author",

                    // the type of element: one of the core types in components/CrateCreator/components
                    "@type": ["Person", "Organization"],

                    // can there be multiple authors?
                    required: true,
                    group: "important",
                },
                {
                    property: "publisher",
                    label: "Publisher",

                    // the type of element: one of the core types in components/CrateCreator/components
                    "@type": ["Organization", "Person"],

                    required: true,
                    group: "important",
                },
                {
                    property: "contactPoint",
                    label: "Contact Point",
                    "@type": "ContactPoint",
                    required: true,
                    multiple: false,
                    group: "important",
                },
                {
                    property: "citation",
                    label: "Citation",
                    "@type": "ScholarlyArticle",
                },
                {
                    property: "funder",
                    label: "Funder",
                    "@type": ["Organization", "Person "],
                },
                {
                    property: "contentLocation",
                    label: "Content Location",
                    "@type": "Place",
                },
                {
                    property: "hasPart",
                    "@type": [
                        "File",
                        "Dataset",
                        "Workflow",
                        "RepositoryCollection",
                        "RepositoryObject",
                    ],
                    group: "important",
                },
            ],
        },
    },
    dataPacks: [],
};
