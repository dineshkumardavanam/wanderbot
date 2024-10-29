import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import the CSS file

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMessages = [...messages, { user: 'You', text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: input }],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            const botMessage = {
                user: 'WanderBot',
                text: response.data.choices[0].message.content,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching response:', error);
        }
    };

    return (
        <div className="chatbot-container">
            <h2 className="chatbot-title">WanderBot</h2>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.user === 'You' ? 'user-message' : 'bot-message'}`}>
                        <strong>{msg.user}: </strong>{msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chatbot-form">
                <input 
                    type="text" 
                    value={input} 
                    onChange={handleInputChange} 
                    placeholder="Ask me about your travel plans..." 
                    className="chatbot-input"
                />
                <button type="submit" className="chatbot-button">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
