class ChatItem {
  constructor(id, sender, content, timestamp, sent) {
    this.id = id;
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
    this.sent = sent;
  }
}

export default ChatItem;
