class ChatManager{
    constructor(){
        this.messages = [];
        this.maxMessages = 1000;
    }
    
    addMessage(message){
        this.messages.push(message);
        if(this.messages.length > this.maxMessages){
            this.messages.shift();
        }
    }

    getMessages(){
        return this.messages;
    }
}
module.exports = ChatManager;