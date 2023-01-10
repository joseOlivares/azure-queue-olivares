const { Router } = require('express');
const router = Router();

//Azure services 
const azService=require('../configuration/azure_queueService');
const queueServiceClient=azService.queueServiceClient;
const queueClientIN=azService.queueClientIN;

/*
* Raiz
*/
router.get('/', (req, res) => {
    res.status(200).json({"Ok": "Node Server - Azure queue working!"}
    );
});

/*
* Obteber Lista de colas disponibles en el storageAccount
*/
router.get('/queue-list', async (req,res)=>{
    let queueList=[];
    console.log("Queues:");
    try {
        for await (const item of queueServiceClient.listQueues()) {
            queueList.push(item.name);
            console.log(`- ${item.name}`);
        }  
        res.status(200).json({"data":queueList,"status":1});
    } catch (error) {
        res.status(400).json({"error":error,"status":0});
        console.log(error);
    }
});

/*
* Quitar de la cola un mensaje
*/
router.get('/dequeue', async (req,res)=>{

    try {
        const dequeueResponse = await queueClientIN.receiveMessages();

        console.log('/dequeue');
        console.log(`dequeueResponse.receivedMessageItems.length= ${dequeueResponse.receivedMessageItems.length}`);

        if (dequeueResponse.receivedMessageItems.length == 1) {
          const dequeueMessageItem = dequeueResponse.receivedMessageItems[0];
          console.log(`Processing & deleting message with content: ${dequeueMessageItem.messageText}`);
          const deleteMessageResponse = await queueClientIN.deleteMessage(
            dequeueMessageItem.messageId,
            dequeueMessageItem.popReceipt
          );
          console.log(
            `Deleted message successfully, service assigned request ID: ${deleteMessageResponse.requestId}`
          );
          res.status(200).json({"data":deleteMessageResponse.requestId,"status":1});
        }else{
            console.log("QueueIN Empty");
            res.status(200).json({"data":"QueueIN empty","status":1}); 
        }     
    } catch (error) {
        res.status(400).json({"error":error,"status":0});
        console.log(error);    
    }
});

 
module.exports = router;