import { useEffect, useRef, useState } from "react";

import { sendChatMessage } from "../api/chatApi";
import useGameStore from "../state/gameStore";

import "./ChatBox.css";

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatMessageRow({ message, isMine }) {
  if (message.type === "system") {
    return (
      <div className="chat-message chat-message--system">
        {message.text}
      </div>
    );
  }

  return (
    <div
      className={
        isMine
          ? "chat-message chat-message--mine"
          : "chat-message"
      }
    >
      <div className="chat-message__body">
        <span className="chat-message__author">
          {message.senderName}:
        </span>
        <span className="chat-message__text">{message.text}</span>
        {message.timestamp != null && (
          <time
            className="chat-message__time"
            dateTime={new Date(message.timestamp).toISOString()}
          >
            {formatTime(message.timestamp)}
          </time>
        )}
      </div>
    </div>
  );
}

function ChatBox() {
  const chatMessages = useGameStore((state) => state.chatMessages);
  const chatError = useGameStore((state) => state.chatError);
  const socketConnected = useGameStore((state) => state.socketConnected);
  const seatIndex = useGameStore((state) => state.seatIndex);

  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  function handleSubmit(event) {
    event.preventDefault();
    if (sendChatMessage(draft)) {
      setDraft("");
    }
  }

  return (
    <section className="chat-box" aria-label="Chat">
      <h2 className="chat-header">Chat</h2>

      <div className="chat-messages" role="log" aria-live="polite">
        {chatMessages.length === 0 ? (
          <p className="chat-messages-empty">No messages yet</p>
        ) : (
          chatMessages.map((message) => (
            <ChatMessageRow
              key={message.id}
              message={message}
              isMine={message.senderSeatIndex === seatIndex}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {chatError && (
        <p className="chat-error" role="alert">
          {chatError}
        </p>
      )}

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            socketConnected ? "Type a message…" : "Disconnected"
          }
          disabled={!socketConnected}
          maxLength={300}
          aria-label="Chat message"
        />
        <button type="submit" disabled={!socketConnected}>
          Send
        </button>
      </form>
    </section>
  );
}

export default ChatBox;
