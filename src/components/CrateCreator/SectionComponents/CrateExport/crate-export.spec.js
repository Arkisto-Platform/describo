import "regenerator-runtime/runtime";
import CrateExporter from "./crate-export";
import path from "path";
import fs from "fs-extra";

test.only("it should be able to create a zip export", async () => {
    const targetFolder = path.join(__dirname, "..");
    const zipFileName = "example.zip";
    const crate = __dirname;

    const exporter = new CrateExporter({ targetFolder, crate });
    await exporter.exportZip({ zipFileName });
    let stat = await fs.stat(path.join(targetFolder, zipFileName));
    expect(stat.isFile()).toBeTrue;
    await fs.remove(path.join(targetFolder, zipFileName));
});

test("it should not be able to create a zip export as a child of the zipped folder", async () => {
    const targetFolder = path.join(__dirname);
    const zipFileName = "example.zip";
    const crate = __dirname;

    const exporter = new CrateExporter({ targetFolder, crate });
    try {
        await exporter.exportZip({ zipFileName });
    } catch (error) {
        expect(error.message).toBe(
            `You can't save the archive to the same folder that you're archiving.`
        );
    }
});
