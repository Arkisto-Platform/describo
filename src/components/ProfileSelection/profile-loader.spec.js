import "core-js/stable";
import "regenerator-runtime/runtime";
import ProfileLoader from "./profile-loader";
import { readdir } from "fs-extra";
import path from "path";

test("profile verification", async () => {
    const profileLoader = new ProfileLoader({ name: "default" });
    let profile = {
        metadata: {},
        items: {
            Dataset: {
                metadata: {
                    about: "about",
                    version: 1,
                },
                inputs: [
                    {
                        property: "name",
                        label: "Name",
                        "@type": "Text",
                    },
                ],
            },
        },
    };
    let { valid, errors } = profileLoader.verify({ profile });
    expect(valid).toBeTrue;

    profile = {
        metadata: {},
        items: {
            Dataset: {
                metadata: {
                    about: "about",
                    version: 1,
                    something: "",
                },
                inputs: [
                    {
                        camels: "camels",
                        label: "Name",
                        "@type": "Camels",
                    },
                ],
            },
        },
    };

    ({ valid, errors } = profileLoader.verify({ profile }));
    expect(valid).toBeFalse;
    expect(errors.length).toBe(0);

    //     profileLoader.profile = (await profileLoader.load()).profile;
    //     profileValidity = profileLoader.verify();
    //     expect(profileValidity.valid).toBeTrue;
});
