const express=require("express");
const app=express();

const PORT=process.env.PORT || 5000;



// middleware
app.use(express.json());

//Routes
app.use(require('./routes/index'));

app.listen(PORT, (error) =>{
    if(!error){
        console.log("Server is Successfully Running,and App is listening on port "+ PORT);

        //getQueueList();

        /*let ciclo= setInterval(()=>{
            getQueueLength();
        },22000);*/
        
    } else{
        console.log("Error occurred, server can't start", error);
    }
        
    }
);




async function getQueueLength(){


    // Get a QueueClient which will be used
    // to create and manipulate a queue
    const queueClient = queueServiceClient.getQueueClient(queueName); 

    const properties = await queueClient.getProperties();

    console.log("Longitud aproximada de la cola: ", properties.approximateMessagesCount);

    if(properties.approximateMessagesCount>0){
       
       
        /* Desencolando los primeros 5 mensajes */
        // Get the first message in the queue
       /* let receivedMessages = await queueClient.receiveMessages();
        const firstMessage = receivedMessages.receivedMessageItems[0];

        // Update the received message
        await queueClient.updateMessage(firstMessage.messageId,firstMessage.popReceipt)
        */
    }




}