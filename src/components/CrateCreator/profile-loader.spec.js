import "core-js/stable";
import "regenerator-runtime/runtime";
import ProfileLoader from "./profile-loader";

test("can load the default profile", async () => {
    const profileLoader = new ProfileLoader({ name: "default" });
    let profile = await profileLoader.load();
    expect(profile).toBeDefined();
});

test("profile verification", async () => {
    const profileLoader = new ProfileLoader({ name: "default" });
    let profile = {
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
    };
    profileLoader.profile = profile;
    let profileValidity = profileLoader.verify();
    expect(profileValidity.valid).toBeTrue;

    profile = {
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
    };

    profileLoader.profile = profile;
    profileValidity = profileLoader.verify();
    expect(profileValidity.valid).toBeFalse;
    expect(profileValidity.errors.length).toBe(2);

    profileLoader.profile = (await profileLoader.load()).profile;
    profileValidity = profileLoader.verify();
    expect(profileValidity.valid).toBeTrue;
});
