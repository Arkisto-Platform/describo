export default {
    metadata: {
        // can other profiles be joined in to this one?
        extensible: true
    },
    DataTypes: {
        Dataset: [
            {
                // the schema element to write this data against
                property: "name",

                // the label to display - otherwise the last element of property is shown
                label: "Name",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Text",

                // whether this element is required - used by strict
                required: true
            },
            {
                property: "datePublished",
                label: "Date Published",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Text"
            },
            {
                property: "author",
                label: "Author",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": ["Person", "Organisation"],

                // can there be multiple authors?
                multiple: true
            },
            {
                property: "participant",
                label: "Participant",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": ["Person", "Organisation"],

                // can there be multiple authors?
                multiple: true
            }
            // {
            //     property: "hasPart",
            //     label: "Part",
            //     "@type": "Part",
            //     multiple: true
            // }
        ]
    }
};
