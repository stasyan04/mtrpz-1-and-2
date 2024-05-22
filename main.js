import { Command } from "commander"
import { readFile, writeFile } from "fs/promises"
import replacer from "./replacer.js"

const program = new Command()

program
    .version("1.0.0")
    .description("Replaces markdown tags with html tags or escape codes")
    .usage("<path> [options]")

program
    .argument("<path>", "Path to file to read")
    .option("-o, --output <path>", "Path to file to write")
    .option("-f, --format [format]", "Format to use", "html")
    .parse(process.argv)


const path = program.args[0]
const output = program.opts().output
const format = program.opts().format

const text = await readFile(path, "utf-8")
const newText = replacer(text, format)

if (output) {
    await writeFile(output, newText)
} else {
    console.log(newText)
}
