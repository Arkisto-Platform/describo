import fs from "fs-extra";

import defaultProfile from "components/profiles/default";
import { cloneDeep } from "lodash";
import { SimpleTypes } from "components/CrateCreator/SectionComponents/component.mixins.js";

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
}
