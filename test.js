import { processDocument } from "./processDocument.js";

const path = process.argv[2]

console.log(await processDocument(path))
