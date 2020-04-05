import fs from "fs-extra";

import defaultProfile from "components/profiles/default";
import { cloneDeep, isString } from "lodash";

const profiles = {
    default: defaultProfile
};

export default class ProfileLoader {
    constructor({ name }) {
        this.name = name;
        this.profile = undefined;
    }

    async load() {
        if (!profiles[this.name]) {
            throw new Error(
                "The application can only load the default profile at this stage."
            );
        }
        this.profile = profiles[this.name];
        return { profile: cloneDeep(this.profile) };
    }

    verify() {
        let valid = true;
        let errors = [];
        const validInputProperties = [
            "property",
            "label",
            "@type",
            "value",
            "required",
            "help",
            "options",
            "multiple"
        ];
        const validTypes = [
            "Value",
            "Text",
            "TextArea",
            "Select",
            "Date",
            "Person",
            "Organisation",
            "ContactPoint"
        ];

        // for each definition
        for (let type of Object.keys(this.profile)) {
            const profile = this.profile[type];

            // ensure only two top level keys - ['metadata', 'inputs']
            let response = validateKeys({
                element: profile,
                validKeys: ["inputs", "metadata"]
            });
            if (response.errors.length) {
                valid = response.valid;
                errors.push(...response.errors);
            }

            // if metadata key ensure only - ['about', 'version']
            response = validateKeys({
                element: profile.metadata,
                validKeys: ["about", "version"]
            });
            if (response.errors.length) {
                valid = response.valid;
                errors.push(...response.errors);
            }

            // check input prop's
            for (let element of profile.inputs) {
                response = validateKeys({
                    element,
                    validKeys: validInputProperties
                });
                if (response.errors.length) {
                    valid = response.valid;
                    errors.push(...response.errors);
                }

                let types = element["@type"];
                if (isString(types)) types = [types];
                for (let type of types) {
                    if (!validTypes.includes(type)) {
                        errors.push(
                            `Input type '${type}' is invalid. Valid types are: ${validTypes}`
                        );
                        valid = false;
                    }
                }
            }
        }
        if (errors.length) {
            console.error(`The profile is invalid and can't be loaded`);
            errors.forEach(e => console.error(e));
        }
        return { valid, errors };

        function validateKeys({ element, validKeys }) {
            let errors = [];
            let valid = true;
            Object.keys(element).forEach(key => {
                if (!validKeys.includes(key)) {
                    errors.push(
                        `Definition ${JSON.stringify(
                            element
                        )} has an invalid property: '${key}'. Valid keys are: '${validKeys}'.`
                    );
                    valid = false;
                }
            });

            return { valid, errors };
        }
    }
}
