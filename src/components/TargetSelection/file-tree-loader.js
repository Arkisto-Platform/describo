import { platform } from "os";
import path from "path";
import fs from "fs-extra";
import { spawn } from "child_process";
import { mapKeys, camelCase } from "lodash";

export class FileTreeLoader {
    constructor({ target }) {
        this.target = target;
    }

    async load(path) {
        const rclone = this.rclone();
        console.log("PATH", path);
        console.log("RCLONE BINARY", rclone, await fs.pathExists(rclone));

        let content = await new Promise(resolve => {
            let content = "";
            const s = spawn(rclone, ["lsjson", path]);

            s.stdout.on("data", function(msg) {
                content += msg.toString();
            });
            s.on("close", code => {
                resolve(JSON.parse(content));
            });
        });
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            path,
            children: content.map(child => {
                child = mapKeys(child, (val, key) => camelCase(key));
                child.parent = path;
                // if (child.isDir) child.children = [];
                child.isLeaf = !child.isDir;
                return child;
            })
        };
    }

    rclone() {
        let rclone;
        if (process.env.NODE_ENV === "production") {
            return path.join(__dirname, "..", "bin", "rclone");
        } else {
            const backPath = [__dirname, "..", "..", "..", "rclone-binaries"];
            switch (platform()) {
                case "darwin":
                    rclone = path.join(...backPath, "mac", "rclone");
                    break;
                case "linux":
                    rclone = path.join(...backPath, "linux", "rclone");
                    break;
                case "win32":
                    rclone = path.join(...backPath, "win", "rclone.exe");
                    break;
            }
            return rclone;
        }
    }
}
