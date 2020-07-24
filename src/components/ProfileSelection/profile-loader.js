import { cloneDeep, has, isArray } from "lodash";

export default class ProfileLoader {
    constructor() {}

    async loadDataPacks({ database, $message, dataPacks }) {
        for (let pack of dataPacks) {
            try {
                await database.load({ url: pack });
            } catch (error) {
                $message({
                    type: "error",
                    duration: 10000,
                    message: `There was an error loading the ${pack} data pack.`,
                });
            }
        }
    }

    verify({ profile }) {
        // TODO: Cut this over to JSON schema validation using ajv!
        let errors = [];
        const validInputProperties = [
            "property",
            "label",
            "@type",
            "value",
            "required",
            "help",
            "options",
            "multiple",
            "group",
        ];
        const validTypes = [
            "Value",
            "Text",
            "TextArea",
            "Select",
            "Date",
            "Person",
            "Organisation",
            "ContactPoint",
        ];

        profile = cloneDeep(profile);

        // verify metadata and item props exists
        if (!has(profile, "metadata")) {
            errors.push(`Profile does not have a section 'metadata'.`);
        }
        if (!has(profile, "items")) {
            errors.push(`Profile does not have a section 'items'.`);
        }

        // verify top level keys
        validateKeys({
            element: profile,
            validKeys: [
                "metadata",
                "items",
                "mappings",
                "typeDefinitions",
                "enabledCoreTypes",
                "dataPacks",
            ],
        });

        // verify item configuration at a high level
        for (let item of Object.keys(profile.items)) {
            validateKeys({
                element: profile.items[item],
                validKeys: ["metadata", "inputs"],
            });
        }

        // verify enabled core types
        if (profile.enabledCoreTypes) {
            if (!isArray(profile.enabledCoreTypes))
                errors.push(`enabledCoreTypes must be an array`);
        }
        if (profile.dataPacks) {
            if (!isArray(profile.dataPacks))
                errors.push(`dataPacks must be an array`);
        }
        if (errors.length) {
            console.error(`The profile is invalid and can't be loaded`);
            errors.forEach((e) => console.error(e));
        }
        return { valid: errors.length ? false : true, errors };

        function validateKeys({ element, validKeys }) {
            Object.keys(element).forEach((key) => {
                if (!validKeys.includes(key)) {
                    errors.push(
                        `Invalid Property: '${key}'. Valid keys are: '${validKeys}'.`
                    );
                }
            });
        }
    }
}
