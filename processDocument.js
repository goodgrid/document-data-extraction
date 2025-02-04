

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
        const qResponse = await azure.post(`prebuilt-idDocument:analyze?_overload=analyzeDocument&api-version=2024-11-30`, formData, options)

        const requestId = qResponse.headers["apim-request-id"]
        
        const rawResult = await getResult(requestId)
        const finalResult = processResult(rawResult)
        delete finalResult.MachineReadableZone

        return finalResult
    } catch(error) {
        console.error(error.response ? error.response.data : error)
    }
}

const getResult = async (requestId) => {
    console.log("Polling result")

    const rResponse = await azure.get(`prebuilt-idDocument/analyzeResults/${requestId}?api-version=2024-11-30`)

    if (rResponse.data.status === "running") {
        await wait(1)
        return await getResult(requestId)
    } else if (rResponse.data.status === "succeeded") {
        azure.delete(`prebuilt-idDocument/analyzeResults/${requestId}?api-version=2024-11-30`)

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
        acc[prop] = obj[prop][`value${capitalize(obj[prop].type)}`]
        return acc
    }, {})
}

const capitalize = (str) => {
    return str && String(str[0]).toUpperCase() + String(str).slice(1)
}

