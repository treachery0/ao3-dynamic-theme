import path from "path";
import { promises as fs } from "fs";
import postcss from "postcss";
import postcssConfig from "../postcss.config.js";

await buildStyleSheets('src/inputs', 'dist');

async function buildStyleSheets(inputDir, outputDir) {
    const postCSS = await postcss(postcssConfig.plugins);
    const files = await fs.readdir(inputDir, {withFileTypes: true});

    await fs.mkdir(outputDir, {recursive: true});

    for (const file of files) {
        if(!file.isFile()) {
            continue;
        }

        const filePath = path.join(file.parentPath, file.name);
        const outPath = path.join(outputDir, file.name);

        const css = await buildStyleSheet(postCSS, filePath, outPath);

        await fs.writeFile(outPath, css);
    }
}

async function buildStyleSheet(postCSS, filePath) {
    const contents = await fs.readFile(filePath, 'utf-8');

    const result = await postCSS.process(contents, {
        from: filePath
    });

    return result.css;
}