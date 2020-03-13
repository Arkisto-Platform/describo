import fs from "fs-extra";

import defaultProfile from "components/profiles/default";
import { compact } from "jsonld";
import { uuidv4 } from "./tools";

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
        const dataTypes = Object.keys(this.profile.DataTypes);
        for (let type of dataTypes) {
            this.profile.DataTypes[type] = this.profile.DataTypes[type].map(
                input => {
                    if (input.multiple) {
                        input.items = [];
                        input.addItems = true;
                    }
                    return input;
                }
            );
        }
        return { profile: this.profile };
    }
}
