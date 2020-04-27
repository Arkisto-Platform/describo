import path from "path";
import fs from "fs-extra";
import walk from "walk";
import hasha from "hasha";
import tempy from "tempy";
const DIGEST_ALGORITHM = "sha512";

export default class Bag {
    constructor({ source, crate }) {
        this.source = source;
        this.crate = crate;
    }

    async bagIt() {
        this.crate.index();
        const root = this.crate.getRootDataset();
        const bagInfo = this.generateBagInformation({ root });
        const items = await this.walk();
        let bagFiles = [];

        // assemble and write the bag manifest
        const manifestPath = tempy.file({
            name: `manifest-${DIGEST_ALGORITHM}.txt`,
        });
        bagFiles.push(manifestPath);

        let manifest = "";
        for (let item of items) {
            manifest += `${item.hash} ${item.file}\n`;
        }
        await fs.writeFile(manifestPath, manifest);

        // assemble and write the bagit file
        const bagFilePath = tempy.file({
            name: `bagit.txt`,
        });
        bagFiles.push(bagFilePath);
        await fs.writeFile(
            bagFilePath,
            "BagIt-Version: 1.0\nTag-File-Character-Encoding: UTF-8"
        );

        // assemble and write the bag info file
        const bagInfoPath = tempy.file({
            name: `bag-info.txt`,
        });
        bagFiles.push(bagInfoPath);
        let info = "";
        for (let property of Object.keys(bagInfo)) {
            info += `${property}: ${bagInfo[property]}\n`;
        }
        await fs.writeFile(bagInfoPath, info);

        return bagFiles;
    }

    generateBagInformation({ root }) {
        let bagMetadata = {
            ROCrate_Specification_Identifier: this.crate.defaults
                .ROCrate_Specification_Identifier,
        };

        if (root["contactPoint"] && root["contactPoint"]["@id"]) {
            const contact = this.crate.getItem(root["contactPoint"]["@id"]);
            const map = {
                email: "Contact-Email",
                phone: "Contact-Telephone",
                name: "Contact-Name",
            };

            for (let [k, v] of Object.entries(map)) {
                if (contact[k]) {
                    bagMetadata[v] = String(contact[k]);
                }
            }
        }

        if (root["publisher"] && root["publisher"]["@id"]) {
            const publisher = this.crate.getItem(root["publisher"]["@id"]);

            if (publisher["name"]) {
                bagMetadata["SourceOrganization"] = publisher.name;
            }
        }
        if (root["description"]) {
            bagMetadata["External-Description"] = root["description"];
        }
        bagMetadata["Bagging-Date"] = new Date().toISOString();
        return bagMetadata;
    }

    async walk() {
        let items = [];
        return new Promise((resolve, reject) => {
            const walker = walk.walk(this.source, {});
            const source = this.source;

            walker.on("file", async function(root, fileStats, next) {
                const file = path.join(root, fileStats.name);
                const hash = await hash_file(file);
                items.push({ file: path.relative(source, file), hash });
                next();
            });

            walker.on("errors", function(root, nodeStatsArray, next) {
                next();
            });

            walker.on("end", function() {
                resolve(items);
            });
        });
        async function hash_file(p) {
            const hash = hasha.fromFileSync(p, {
                algorithm: DIGEST_ALGORITHM,
            });
            return hash;
        }
    }
}
