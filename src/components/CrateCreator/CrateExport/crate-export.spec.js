import "regenerator-runtime/runtime";
import CrateExporter from "./crate-export";
import path from "path";
import fs from "fs-extra";

const crate = {
    "@context": "https://w3id.org/ro/crate/1.0/context",
    "@graph": [
        {
            "@id": "/ro-crate-metadata.jsonld",
            "@type": "CreativeWork",
            about: {
                "@id": "./",
            },
            identifier: "ro-crate-metadata.jsonld",
            conformsTo: {
                "@id": "https://w3id.org/ro/crate/1.0",
            },
            license: {
                "@id": "https://creativecommons.org/licenses/by-sa/3.0",
            },
        },
        {
            "@type": "Dataset",
            name: "my crate",
            "@id": "./",
        },
    ],
};

test("it should be able to create a zip export", async () => {
    const source = __dirname;
    const target = path.join(__dirname, "..");
    const zipFileName = "example.zip";
    await fs.writeJSON(path.join(source, "ro-crate-metadata.jsonld"), crate);

    const exporter = new CrateExporter({ source, target });
    await exporter.export({ zipFileName });
    let stat = await fs.stat(path.join(target, zipFileName));
    expect(stat.isFile()).toBeTrue;
    stat = await fs.stat(path.join(source, "ro-crate-preview.html"));
    expect(stat.isFile()).toBeTrue;
    stat = await fs.stat(path.join(source, "ro-crate-metadata.jsonld"));
    expect(stat.isFile()).toBeTrue;
    await fs.remove(path.join(target, zipFileName));
    await fs.remove(path.join(source, "ro-crate-metadata.jsonld"));
    await fs.remove(path.join(source, "ro-crate-preview.html"));
});

test("it should not be able to create a zip export as a child of the zipped folder", async () => {
    const source = __dirname;
    const target = path.join(__dirname);
    const zipFileName = "example.zip";

    const exporter = new CrateExporter({ source, target });
    try {
        await exporter.export({ zipFileName });
    } catch (error) {
        expect(error.message).toBe(
            `You can't export the archive to the path that you're archiving.`
        );
    }
});

test("it should be able to create a bagged export", async () => {
    const source = __dirname;
    const target = path.join(__dirname, "..");
    const zipFileName = "example.zip";
    await fs.writeJSON(path.join(source, "ro-crate-metadata.json"), crate);

    const exporter = new CrateExporter({ source, target });
    await exporter.export({ zipFileName, bagIt: true });
    await fs.remove(path.join(target, zipFileName));
    await fs.remove(path.join(source, "ro-crate-metadata.json"));
    await fs.remove(path.join(source, "ro-crate-preview.html"));
});
