class ChatMessage {
    constructor(
        id,
        senderSeatIndex,
        senderName,
        type,
        text,
        timestamp
    ) {
        this.id = id; //id of the message
        this.senderSeatIndex = senderSeatIndex; //
        this.senderName = senderName; //Author
        this.type = type; //Chat vs Lobby message vs Game State
        this.text = text; //actual message
        this.timestamp = timestamp; //time sent
    }
    
    toPayload(){
        return {
            id: this.id,
            senderSeatIndex: this.senderSeatIndex,
            senderName: this.senderName,
            type: this.type,
            text: this.text,
            timestamp: this.timestamp
        }
    }


}

module.exports = ChatMessage