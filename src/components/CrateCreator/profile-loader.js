import fs from "fs-extra";

import defaultProfile from "components/profiles/default";
import typeDefinitions from "components/profiles/types";
import { cloneDeep, isString } from "lodash";
import Store from "electron-store";
const store = new Store();

export default class ProfileLoader {
    constructor({ name }) {
        this.name = name;
        this.profile = undefined;
    }

    async load() {
        if (this.name === "default") {
            this.profile = defaultProfile;
            return {
                profile: cloneDeep(this.profile),
                metadata: {},
                typeDefinitions: {},
            };
        } else {
            const profiles = store.get("profiles");
            this.profile = cloneDeep(
                profiles.filter((p) => p.name === this.name)[0].profile
            );
            const profile = cloneDeep(this.profile);
            delete profile.metadata, delete profile.TypeDefinitions;

            return {
                profile: profile,
                metadata: this.profile.metadata,
                typeDefinitions: this.profile.TypeDefinitions,
            };
        }
    }

    verify({ profile }) {
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

        // for each definition
        const fullProfile = cloneDeep(profile);
        for (let type of Object.keys(fullProfile)) {
            profile = fullProfile[type];

            // ensure only two top level keys - ['metadata', 'inputs']
            let response = validateKeys({
                element: profile,
                validKeys: ["inputs", "metadata"],
            });
            if (response.errors.length) {
                valid = response.valid;
                errors.push(...response.errors);
            }

            // if metadata key ensure only - ['about', 'version']
            response = validateKeys({
                element: profile.metadata,
                validKeys: ["about", "version", "allowAdditionalProperties"],
            });
            if (response.errors.length) {
                valid = response.valid;
                errors.push(...response.errors);
            }

            // check input prop's
            for (let element of profile.inputs) {
                response = validateKeys({
                    element,
                    validKeys: validInputProperties,
                });
                if (response.errors.length) {
                    valid = response.valid;
                    errors.push(...response.errors);
                }

                let types = element["@type"];
                if (isString(types)) types = [types];
                // TODO skip type validation for now
                // for (let type of types) {
                //     if (!validTypes.includes(type)) {
                //         errors.push(
                //             `Input type '${type}' is invalid. Valid types are: ${validTypes}`
                //         );
                //         valid = false;
                //     }
                // }
            }
        }
        if (errors.length) {
            console.error(`The profile is invalid and can't be loaded`);
            errors.forEach((e) => console.error(e));
        }
        return { valid, errors };

        function validateKeys({ element, validKeys }) {
            let errors = [];
            let valid = true;
            Object.keys(element).forEach((key) => {
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
