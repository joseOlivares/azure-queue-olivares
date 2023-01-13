
/*
 * Función para decodificar mensajes de colas base64 
 */
async function decodeMessage(textMessage){
    let plainText= 'no message received';
    if(textMessage){
        plainText= Buffer.from(textMessage,'base64').toString('utf8');
    }
    
    return plainText;
}


module.exports={decodeMessage};
