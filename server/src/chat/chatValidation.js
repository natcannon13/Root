function validateChat(text){
    if(typeof text !== "string"){
        return false;
    }

    text = text.trim();

    if(text.length === 0){
        return false;
    }
    if(text.length > 300){
        return false;
    }
    return true;
}
module.exports = {
    validateChat
}