// Load the .env file if it exists
require("dotenv").config();

/*
* Cliente Azure
*/
const { QueueClient, QueueServiceClient, StorageSharedKeyCredential } = require("@azure/storage-queue");


//reading config vars
const account = process.env.ACCOUNT_NAME || "";
const accountKey = process.env.ACCOUNT_KEY || "";
const queueIN=process.env.QUEUE_IN || "";
const queueOUT=process.env.QUEUE_OUT || "";

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);


const queueServiceClient = new QueueServiceClient(
        `https://${account}.queue.core.windows.net`,
        sharedKeyCredential
);

const queueClientIN=queueServiceClient.getQueueClient(queueIN); 
const queueClientOUT=queueServiceClient.getQueueClient(queueOUT); 

const azService={
        'queueServiceClient':queueServiceClient,
        'queueClientIN':queueClientIN,
        'queueClientOUT':queueClientOUT
}

module.exports=azService;