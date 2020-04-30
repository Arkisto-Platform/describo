const nodePath = require("path");
const { platform } = require("os");
const { spawn } = require("child_process");
const { mapKeys, camelCase, compact } = require("lodash");

const filesToExclude = [
    ".DS_Store",
    "ro-crate-metadata.json",
    "ro-crate-metadata.jsonld",
    "ro-crate-preview.html",
];

export default class FileTreeLoader {
    constructor({ target }) {
        this.target = target;
    }

    async load({ root, path, filterFiles }) {
        const rclone = this.rclone();
        // console.log("PATH", path);
        // console.log("RCLONE BINARY", rclone, await fs.pathExists(rclone));

        let content = await new Promise((resolve) => {
            let content = "";
            const s = spawn(rclone, ["lsjson", path]);

            s.stdout.on("data", function(msg) {
                content += msg.toString();
            });
            s.on("close", (code) => {
                if (!code) resolve(JSON.parse(content));
                resolve();
            });
        });
        // await new Promise(resolve => setTimeout(resolve, 300));

        if (!content) return {};
        return {
            path,
            children: compact(
                content.map((child) => {
                    if (filterFiles && filesToExclude.includes(child.Path))
                        return undefined;
                    child = mapKeys(child, (val, key) => camelCase(key));
                    child.parent = path === root ? "/" : path.replace(root, "");
                    child.isLeaf = !child.isDir;
                    child.uuid = nodePath.relative(
                        nodePath.join(child.parent, child.name)[0],
                        nodePath.join(child.parent, child.name)
                    );
                    if (platform() === "win32") {
                        child.uuid = child.uuid.replace(/\\/g, "/");
                    }
                    child.uuid = child.isDir ? `${child.uuid}/` : child.uuid;
                    return child;
                })
            ),
        };
    }

    rclone() {
        let rclone;
        if (process.env.NODE_ENV === "production") {
            return nodePath.join(__dirname, "..", "..", "bin", "rclone");
        } else {
            const backPath = [__dirname, "..", "..", "..", "rclone-binaries"];
            switch (platform()) {
                case "darwin":
                    rclone = nodePath.join(...backPath, "mac", "rclone");
                    break;
                case "linux":
                    rclone = nodePath.join(...backPath, "linux", "rclone");
                    break;
                case "win32":
                    rclone = nodePath.join(...backPath, "win", "rclone.exe");
                    break;
            }
            return rclone;
        }
    }
}
