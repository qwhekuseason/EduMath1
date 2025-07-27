// hooks/useAiTutor.ts

import { useState } from 'react';

// The URL of your Python Flask backend
const API_ENDPOINT = 'http://127.0.0.1:8000/api/ai-tutor';

export interface ChatMessage {
  role: 'user' | 'bot' | 'system';
  content: string;
}

export const useAiTutor = (initialSystemPrompt: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: initialSystemPrompt }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // This function now sends a real network request to your Python server
  const sendMessage = async (query: string, context?: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: query };
    // Add the new user message to the history immediately for a snappy UI
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    try {
      // Make the API call to your backend
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the entire conversation history, including the new message and any context
        body: JSON.stringify({ 
          history: currentMessages, 
          context: context 
        }),
      });

      if (!response.ok) {
        // If the server returns an error (like 500), throw an error to be caught below
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Create the bot's response message and add it to the state
      const botMessage: ChatMessage = { role: 'bot', content: data.response };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("AI Tutor fetch error:", error);
      const errorMessage: ChatMessage = { 
        role: 'bot', 
        content: "Sorry, I'm having trouble connecting to my brain right now. Please check the server connection and try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};