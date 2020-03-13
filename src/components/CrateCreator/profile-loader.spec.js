import "core-js/stable";
import "regenerator-runtime/runtime";
import ProfileLoader from "./profile-loader";

test("can load the default profile", async () => {
    const profileLoader = new ProfileLoader({ name: "default" });
    let profile = await profileLoader.load();
    expect(profile).toBeDefined();
});
