const express=require("express");
const app=express();

const PORT=process.env.PORT || 5000;



// middleware
app.use(express.json());

//Routes
app.use(require('./routes/index'));

app.listen(PORT, (error) =>{
        if(!error){
            console.log("Server is Successfully Running, App is listening on port "+ PORT);    
        } else{
            console.log("Error occurred, server can't start", error);
        }
    }
);
