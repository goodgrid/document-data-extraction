import { processDocument } from "./processDocument.js";

const path = process.argv[2]


const data = await processDocument(path) 
console.log(`${data.FirstName} ${data.LastName} was born on ${data.DateOfBirth} in ${data.PlaceOfBirth}, according to the ${data.IssuingAuthority}`)
