import "regenerator-runtime/runtime";
import CrateExporter from "./crate-export";
import path from "path";
import fs from "fs-extra";

test("it should be able to create a zip export", async () => {
    const source = __dirname;
    const target = path.join(__dirname, "..");
    const zipFileName = "example.zip";

    const exporter = new CrateExporter({ source, target });
    await exporter.exportZip({ zipFileName });
    let stat = await fs.stat(path.join(target, zipFileName));
    expect(stat.isFile()).toBeTrue;
    await fs.remove(path.join(target, zipFileName));
});

test("it should not be able to create a zip export as a child of the zipped folder", async () => {
    const source = __dirname;
    const target = path.join(__dirname);
    const zipFileName = "example.zip";

    const exporter = new CrateExporter({ source, target });
    try {
        await exporter.exportZip({ zipFileName });
    } catch (error) {
        expect(error.message).toBe(
            `You can't export the archive to the path that you're archiving.`
        );
    }
});
