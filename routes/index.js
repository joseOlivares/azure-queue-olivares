const { Router } = require('express');
const router = Router();

//Azure services 
const queueServiceClient=require('../configuration/azure_queueServiceClient');
 
//Raiz
router.get('/', (req, res) => {
    res.status(200).json({"Ok": "Node Server - Azure queue working!"}
    );
});

//Lista de colas disponibles en el storageAccount
router.get('/queue-list', async (req,res)=>{
    let queueList=[];
    console.log("Queues:");
    try {
        for await (const item of queueServiceClient.listQueues()) {
            queueList.push(item.name);
            console.log(`- ${item.name}`);
        }  
        res.status(200).json({"data":queueList});
    } catch (error) {
        res.status(400).json({"error":error});
        console.log(error)
    }
});


/*
async function getQueueList(){
    console.log("Queues:");
    for await (const item of queueServiceClient.listQueues()) {
        console.log(`- ${item.name}`);
    }

}*/
 
module.exports = router;