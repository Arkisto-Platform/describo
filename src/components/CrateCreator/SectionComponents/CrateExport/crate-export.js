// require modules
import { createWriteStream, readJSON, writeFile } from "fs-extra";
import archiver from "archiver";
import path from "path";
import EventBus from "./eventbus";
import { Preview, HtmlFile, Defaults } from "ro-crate-html-js";
import { ROCrate } from "ro-crate";
import fs from "fs-extra";

export default class CrateExporter {
    constructor({ source, target }) {
        this.source = source;
        this.target = target;
    }

    async exportZip({ zipFileName }) {
        if (
            !isAcceptableTarget({
                source: this.source,
                target: this.target,
            })
        ) {
            throw new Error(
                `You can't export the archive to the path that you're archiving.`
            );
        }

        await this.renderCrateHTML();

        // create a file to stream archive data to.
        const output = await createWriteStream(
            path.join(this.target, zipFileName)
        );
        const archive = archiver("zip", {
            zlib: { level: 9 }, // Sets the compression level.
        });
        EventBus.$on("abort", () => {
            archive.abort();
        });

        let result = await new Promise((resolve, reject) => {
            // listen for all archive data to be written
            // 'close' event is fired only when a file descriptor is involved
            output.on("close", function() {
                return resolve();
            });

            // This event is fired when the data source is drained no matter what was the data source.
            // It is not part of this library but rather from the NodeJS Stream API.
            // @see: https://nodejs.org/api/stream.html#stream_event_end
            output.on("end", function() {
                return resolve();
            });

            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            archive.on("warning", function(error) {
                return reject(error);
            });

            // good practice to catch this error explicitly
            archive.on("error", function(error) {
                return reject(error);
            });

            archive.on("progress", function(progress) {
                EventBus.$emit("progress", progress);
            });

            // pipe archive data to the file
            archive.pipe(output);

            // append files from a sub-directory, putting its contents at the root of archive
            archive.directory(this.source, false);

            // finalize the archive (ie we are done appending files but streams have to finish yet)
            // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
            archive.finalize();
        });
    }

    async renderCrateHTML() {
        const metadataFile = path.join(this.source, Defaults.roCrateMetadataID);
        const crateScript =
            "https://data.research.uts.edu.au/examples/ro-crate/examples/src/crate.js";

        const json = await readJSON(metadataFile);
        const crate = new ROCrate(json);
        const preview = new Preview(crate);
        const f = new HtmlFile(preview);
        const htmlOutputFile = path.join(
            path.dirname(metadataFile),
            Defaults.roCratePreviewFileName
        );
        await writeFile(htmlOutputFile, await f.render());
    }
}

export function isAcceptableTarget({ source, target }) {
    const relative = path.relative(source, target);
    if (
        source === target ||
        (relative && !relative.startsWith("..") && !path.isAbsolute(relative))
    ) {
        return false;
    } else {
        return true;
    }
}
