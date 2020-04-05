export default {
    // You can define as many root datasets as you like. If there's more
    //  than one a selector will be shown.
    Dataset: {
        metadata: {
            about:
                "Some pithy text about what this is and why the user should select it",
            version: 1
        },
        inputs: [
            {
                // If you want to add a property with a specific value
                //  set @type = "Value"
                //  and specify the value
                property: "additionalType",
                label: "Additional Type",
                "@type": "Value",
                value: "item"
            },
            {
                // the schema element to write this data against
                property: "name",

                // the label to display - otherwise the last element of property is shown
                label: "Name",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Text",

                // whether this element is required - used by strict
                required: true,
                help:
                    "Some meaningful help text because this property really needs the explainer."
            },
            {
                property: "description",
                label: "Description",
                "@type": "TextArea"
            },
            {
                // If you want to add properties with values from a controlled vocab
                // set @type = "Select"
                // and specify the options
                property: "languages",
                label: "Languages",
                "@type": "Select",
                options: ["English", "French", "Spanish", "Other"],
                multiple: true
            },
            {
                property: "colours",
                label: "Colours",
                "@type": "Select",
                options: ["Red", "Green", "Blue", "Other"]
            },
            {
                property: "datePublished",
                label: "Date Published (your local date)",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Date"
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
            },
            {
                property: "publisher",
                label: "Publisher",

                // the type of element: one of the core types in components/CrateCreator/components
                "@type": "Organisation",

                required: true
            },
            {
                property: "contactPoint",
                label: "Contact Point",
                "@type": "ContactPoint",
                required: true,
                multiple: true
            }
        ]
    },
    Collection: {
        metadata: {
            about:
                "Some pithy text about what this is and why the LINGUIST user should select it",
            version: 1
        },
        inputs: [
            {
                property: "additionalType",
                label: "Additional Type",
                "@type": "Value",
                value: "item"
            },
            {
                property: "name",
                label: "Name",
                "@type": "Text",
                required: true
            }
        ]
    }
};
