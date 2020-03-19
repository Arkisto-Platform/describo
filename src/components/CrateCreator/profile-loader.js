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
        const rootDatasets = Object.keys(this.profile.RootDatasets);
        for (let type of rootDatasets) {
            const inputs = this.profile.RootDatasets[type].inputs.map(input => {
                if (input.multiple) {
                    input.items = [];
                    input.addItems = true;
                }
                return input;
            });
            this.profile.RootDatasets[type].inputs = [...inputs];
        }
        return { profile: this.profile };
    }
}
