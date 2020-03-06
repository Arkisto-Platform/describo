import "core-js/stable";
import "regenerator-runtime/runtime";
import FileTreeLoader from "./file-tree-loader";
import { platform } from "os";

test("it should be able to get the path to an rclone binary", async () => {
    const ftl = new FileTreeLoader({ target: "local" });
    const rclone = ftl.rclone();
    expect(rclone).toMatch(/rclone-binaries/);
    expect(rclone).toBeDefined();
    switch (platform()) {
        case "darwin":
            expect(rclone).toMatch("mac");
            break;
        case "linux":
            expect(rclone).toMatch("linux");
            break;
        case "win32":
            expect(rclone).toMatch("win");
            break;
    }
});
test("it should be to get a directory listing", async () => {
    const ftl = new FileTreeLoader({ target: "local" });
    const content = await ftl.load(__dirname);
    expect(content.path).toBe(__dirname);
    expect(content.children.length).toBe(8);
});
