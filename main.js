import { Command } from "commander"
import { readFile, writeFile } from "fs/promises"
import replacer from "./replacer.js"

const program = new Command()

program
    .argument("<path>", "Path to file to read")
    .option("-o, --output <path>", "Path to file to write")
    .parse(process.argv)


const path = program.args[0]
const output = program.opts().output

const text = await readFile(path, "utf-8")
const newText = replacer(text)

if (output) {
    await writeFile(output, newText)
} else {
    console.log(newText)
}
