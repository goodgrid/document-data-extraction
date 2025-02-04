# Document Data Extraction

## Introduction
This project is a super small proof of concept to proove that the use case to read data from identity documents is easy to implement using Azure. 

The project builds on Microsoft Azure AI Document Intelligence. This service deploys as a resource in an Azure subscription. According to Microsoft promises, this is completely (logially) isolated, encrypted and any data is deleted after at most 24 hours. Data is deleted immediately if that request is made by the caller after having retrieved the results.

Sources:
- Documentation index: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0#identity-id
- Pricing: https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/
- Security: 
  - https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/faq?view=doc-intel-4.0.0#does-document-intelligence-store-my-data-
  - https://learn.microsoft.com/en-us/legal/cognitive-services/document-intelligence/data-privacy-security?toc=%2Fazure%2Fai-services%2Fdocument-intelligence%2Ftoc.json&bc=%2Fazure%2Fai-services%2Fdocument-intelligence%2Fbreadcrumb%2Ftoc.json


## Deployment

## Script

- Clone this project using `git clone https://github.com/goodgrid/document-data-extraction.git`

### Azure Document Intelligence

- Log into the Azure Portal at azure.microsoft.com
- Choose "All resources", and click "Create"
- Search for 'Document Intelligence' and click the 'Create' button for 'Document Intelligence (form recognizer)'
- Choose the subscription and create a new Resource Group
- Choose a region as close as possible but et least EU (for what it's worth...)
- Choose a pricing tier ('Free F0' for testing)

After the service has been deployed within the subscription, do the following:

- Create a file `config.js` within the cloned projects directory with the following structure:
  ```
    const config = {
        azureBaseUrl: "",
        azureToken: ""
    }
    export default config
  ```
- Open its properties and copy the endpoint url (https://[chosen name].cognitiveservices.azure.com/)
- Paste the value between the quotes after `azureBaseUrl` and make sure it ends on a slash
- Copy the first one of the two available API keys 
- Paste is between the quotes after `azureToken`

## Usage

Test the service using the following command:
```
kbonnet@MacBook-Pro-2 document-data-extraction % node test.js "/Users/kbonnet/Downloads/Kopie paspoort koen2.pdf"
```

The expected result is

```
{
  CountryRegion: 'NLD',
  DateOfBirth: 'xxx',
  DateOfExpiration: 'xxx',
  DateOfIssue: 'xxx',
  DocumentNumber: 'xxx',
  DocumentType: 'P',
  FirstName: 'Koen',
  IssuingAuthority: 'xxx',
  LastName: 'xxx',
  Nationality: 'NLD',
  PlaceOfBirth: 'xxx',
  Sex: 'M'
}
```

