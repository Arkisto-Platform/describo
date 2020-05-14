import path from "path";
import electron from "electron";
import defaultProfile from "components/profiles/default";
import typeDefinitions from "components/profiles/types";
import { Database } from "describo-data-service";
import { cloneDeep, isString, has, isArray, isPlainObject } from "lodash";

export default class ProfileLoader {
    constructor() {}

    async loadDataPacks({ $message, dataPacks }) {
        const configDir = (electron.app || electron.remote.app).getPath(
            "userData"
        );
        const databaseFile = path.join(configDir, "describo-database.sqlite");
        const database = new Database({ databaseFile });
        await database.connect();
        for (let pack of dataPacks) {
            await database.load({ url: pack });
        }
        return database;
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
