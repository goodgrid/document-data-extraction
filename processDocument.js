

import axios from "axios";
import fs from 'fs'
import FormData from 'form-data'
import config from './config.js'

const azure = axios.create({
    baseURL: config.azureBaseUrl,
    headers: {
        "Ocp-Apim-Subscription-Key": config.azureToken
    }
})


export const processDocument = async (path) => {
    const formData = new FormData()

    formData.append("file", fs.createReadStream(path))

    const options = {
        headers: {
            ...formData.getHeaders()
        }
    }

    try {
        const qResponse = await azure.post(`formrecognizer/documentModels/prebuilt-idDocument:analyze?api-version=2023-07-31`, formData, options)

        const resultUrl = qResponse.headers["operation-location"]

        const result = processResult(await getResult(resultUrl))
        delete result.MachineReadableZone

        return result
    } catch(error) {
        console.error(error)
    }
}

const getResult = async (resultUrl) => {
    console.log("Polling result")

    const rResponse = await azure.get(resultUrl)

    if (rResponse.data.status === "running") {
        await wait(1)
        return await getResult(resultUrl)
    } else if (rResponse.data.status === "succeeded") {
        return rResponse.data.analyzeResult.documents[0].fields
    } else {
        console.log("Unknown status", rResponse.data.status)
    }
}

const wait = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const processResult = (obj) => {
    return Object.keys(obj).reduce((acc, prop) => {
        acc[prop] = obj[prop][`value${capitalize(obj[prop].type)}`];
        return acc;
    }, {});
};

const capitalize = s => s && String(s[0]).toUpperCase() + String(s).slice(1)

