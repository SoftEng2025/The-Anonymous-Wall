import React, { createContext, useContext, useState, useEffect } from 'react'

const MessageContext = createContext()

export function useMessages() {
    return useContext(MessageContext)
}

export function MessageProvider({ children }) {
    // Initialize with some dummy data for visualization purposes
    const [messages, setMessages] = useState([
        {
            id: 1,
            recipient: 'totga',
            message: 'I miss you every day.',
            theme: 'coral',
            mood: 'sad',
            timestamp: Date.now()
        },
        {
            id: 2,
            recipient: 'Rhoy',
            message: 'Thanks for being a great friend!',
            theme: 'peach',
            mood: 'happy',
            timestamp: Date.now(),
            spotifyEmbedUrl: 'https://open.spotify.com/embed/track/7lPN2DXiMsVn7XUKtOW1CS'
        },
        {
            id: 3,
            recipient: 'Gerald',
            message: 'Where is my money?',
            theme: 'mint',
            mood: 'angry',
            timestamp: Date.now()
        },
        {
            id: 4,
            recipient: 'my honeybunch',
            message: 'Love you so much!',
            theme: 'lime',
            mood: 'in-love',
            timestamp: Date.now()
        },
        {
            id: 5,
            recipient: 'sugarglider',
            message: 'You are amazing.',
            theme: 'sage',
            mood: 'happy',
            timestamp: Date.now()
        },
        {
            id: 6,
            recipient: 'femboy rhoi',
            message: 'Lets hang out soon.',
            theme: 'peach',
            mood: 'confused',
            timestamp: Date.now()
        },
        {
            id: 7,
            recipient: 'jam',
            message: 'Happy birthday!',
            theme: 'sage',
            mood: 'happy',
            timestamp: Date.now()
        },
        {
            id: 8,
            recipient: 'samantha',
            message: 'See you tomorrow.',
            theme: 'lavender',
            mood: 'happy',
            timestamp: Date.now()
        }
    ])

    const addMessage = (message) => {
        const timestamp = Date.now()
        setMessages(prev => [{
            ...message,
            id: timestamp,
            timestamp,
            spotifyEmbedUrl: message.spotifyEmbedUrl || ''
        }, ...prev])
    }

    const value = {
        messages,
        addMessage
    }

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    )
}
