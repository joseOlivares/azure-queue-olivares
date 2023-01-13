const { Router } = require('express');
const router = Router();
const utils=require('../utils/index');

//Azure services 
const azService=require('../configuration/azure_queueService');
const { queueClientOUT } = require('../configuration/azure_queueService');
const queueServiceClient=azService.queueServiceClient;
const queueClientIN=azService.queueClientIN;

/*
* Ruta Raiz
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
* Apunta la cola de entrada queueIN
*/
router.get('/dequeue-in', async (req,res)=>{

    try {
        const dequeueResponse = await queueClientIN.receiveMessages();

        console.log('/dequeue-in');
        console.log(`dequeueResponse.receivedMessageItems.length= ${dequeueResponse.receivedMessageItems.length}`);

        if(dequeueResponse.receivedMessageItems.length == 1) {
          const dequeueMessageItem = dequeueResponse.receivedMessageItems[0];
            
          const msgDecoded=await utils.decodeMessage(dequeueMessageItem.messageText);//decoding message
          console.log(`Processing & deleting message with content: ${msgDecoded}`);
          

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


/*
 * Clear Queue
 */

router.get('/clear-queue', async (req,res)=>{

    try {
        console.log('Borrando cola queueOUT');
        const queue=await queueClientOUT.clearMessages();
        res.status(200).json({"data":queue,"status":1});
    } catch (error) {
        res.status(400).json({"error":error,"status":0});
        console.log(error);  
    }
});
 
module.exports = router;