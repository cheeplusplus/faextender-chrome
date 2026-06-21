#!/usr/bin/env zx
import "zx/globals";

import JSZip from "jszip";
import { Parcel } from "@parcel/core";
import process from "node:process";

async function mergeManifest(platform, outputPath) {
    const rootDir = process.cwd();
    const manifestsDir = path.join(rootDir, "manifest");
    const sourceManifestPath = path.join(manifestsDir, "manifest.json");
    const subManifestPath = path.join(manifestsDir, `${platform}.json`);

    let sourceManifest = await fs.readFile(sourceManifestPath, "utf-8");
    let subManifest = await fs.readFile(subManifestPath, "utf-8");

    // Replace <ROOT> with the relative path from rootDir to the outputPath
    // just to make things a bit easier since we put it in a weird spot
    const relativePathing = path.relative(path.dirname(outputPath), rootDir).replaceAll("\\", "/");
    sourceManifest = sourceManifest.replaceAll("<ROOT>", relativePathing);
    subManifest = subManifest.replaceAll("<ROOT>", relativePathing);

    // Merge the sub atop the source
    const sourceManifestJson = JSON.parse(sourceManifest);
    const subManifestJson = JSON.parse(subManifest);
    const merged = { ...sourceManifestJson, ...subManifestJson };

    await fs.writeFile(outputPath, JSON.stringify(merged, null, 2));
}

async function zipDirectory(sourceDir, outPath) {
    const zip = new JSZip();
    const files = await glob("**/*", { cwd: sourceDir });

    for (const file of files) {
        const filePath = path.join(sourceDir, file);
        const fileContent = await fs.readFile(filePath);
        zip.file(file, fileContent);
    }

    const content = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    });

    await fs.writeFile(outPath, content);
}

async function buildBundle(manifestPath, distDir) {
    const isDev = process.env.NODE_ENV === "development";

    try {
        const bundler = new Parcel({
            entries: manifestPath,
            defaultConfig: "@parcel/config-webextension",
            mode: isDev ? "development" : "production",
            shouldDisableCache: true,
            defaultTargetOptions: {
                distDir,
                shouldOptimize: !isDev,
                shouldScopeHoist: true,
                sourceMaps: false,
                publicUrl: "/",
            }
        });

        const { type, buildTime, diagnostics } = await bundler.run();
        if (type !== "buildSuccess") {
            echo(chalk.red(`Build failed: ${JSON.stringify(diagnostics)}`));
        } else {
            echo(chalk.green(`Built in ${buildTime}ms`));
        }
    } catch (err) {
        echo(`${chalk.red("Error building:")} ${err.message}`);
        throw new Error("Build failed");
    }
}

async function webAccessibleResourcesFix(outputDir) {
    // Something is weird in Parcel that's causing it to be in a subdir, but its internal paths are still relative like it's in the root
    // So just move it to the root and patch the manifest
    const manifestPath = path.join(outputDir, "manifest.json");
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
    const actions = [];
    manifest.web_accessible_resources = manifest.web_accessible_resources.map(r => {
        if (r.resources) {
            r.resources = r.resources.map(r => {
                const newName = path.basename(r);
                actions.push(fs.move(path.join(outputDir, r), path.join(outputDir, newName)));
                return newName;
            });
        }
        return r;
    })
    await Promise.all(actions);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

async function main(platform = "chrome") {
    echo(`Building FAExtender for ${chalk.green(platform)}`);

    if (!["chrome", "firefox"].includes(platform)) {
        throw new Error(`Unknown platform ${platform}`);
    }

    // Prepare output directory
    const rootDir = process.cwd();
    const workingDir = path.join(rootDir, "build", platform);
    await fs.emptyDir(workingDir);

    const outputDir = path.join(rootDir, "build", `packed-${platform}`);
    await fs.emptyDir(outputDir);

    // Merge manifest
    const outputManifestPath = path.join(workingDir, "manifest.json");
    await mergeManifest(platform, outputManifestPath);

    // Build
    await buildBundle(outputManifestPath, outputDir);

    // Patch Parcel web_accessible_resources weirdness
    await webAccessibleResourcesFix(outputDir);

    // Zip
    const zipOutputFile = path.join(rootDir, "build", `faextender_${platform}.zip`);
    await zipDirectory(outputDir, zipOutputFile);

    echo("Done!");
}

main(process.argv[3]).catch(err => {
    console.error(err);
    process.exit(1);
});
