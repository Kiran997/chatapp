import React, { useState, useEffect } from 'react';
import EmojiPicker from 'react-emoji-picker';
import io from 'socket.io-client';
import './ChatApp.css';

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('message', (data) => {
      const { text, user, likes } = data;
      const newMessage = { text, user, likes };
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const handleInputChange = (text) => {
    setInputText(text);
    if (text.endsWith('@')) {
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionClick = (username) => {
    setInputText(inputText.slice(0, -1) + username + ' ');
    setShowMentions(false);
  };

  const sendMessage = () => {
    if (inputText.trim() !== '') {
      const randomUser = user_list[Math.floor(Math.random() * user_list.length)];
      const newMessage = {
        text: inputText,
        user: randomUser,
        likes: 0
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      const socket = io('http://localhost:5000');
      socket.emit('message', newMessage);
      socket.disconnect();
    }
  };

  const handleLike = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].likes++;
    setMessages(updatedMessages);
  };

  const handleEmojiClick = (emoji) => {
    setInputText(inputText + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <div className="user">{message.user}</div>
            <div className="text">{message.text}</div>
            <button className="like-btn" onClick={() => handleLike(index)}>
              <span role="img" aria-label="Like">👍</span> {message.likes}
            </button>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="message-input"
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        {showMentions && (
          <div className="mentions">
            {user_list.map((user, index) => (
              <div className="mention" key={index} onClick={() => handleMentionClick(user)}>
                {user}
              </div>
            ))}
          </div>
        )}
        <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          disableSearchBar
          disableSkinTonePicker
        />
      )}
    </div>
  );
};

export default ChatApp;


