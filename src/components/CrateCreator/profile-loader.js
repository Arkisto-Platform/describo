import fs from "fs-extra";

import defaultProfile from "components/profiles/default";
import { cloneDeep } from "lodash";

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
        const rootDatasets = Object.keys(this.profile);
        for (let type of rootDatasets) {
            const inputs = this.profile[type].inputs.map(input => {
                if (input.multiple) {
                    input.items = [];
                    input.addItems = true;
                }
                return input;
            });
            this.profile[type].inputs = cloneDeep(inputs);
        }
        return { profile: this.profile };
    }
}
