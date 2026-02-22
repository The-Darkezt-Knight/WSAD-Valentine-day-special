/**
 * Storage Service using JSONbin.io
 * Free tier: 10,000 requests/month
 * 
 * Setup:
 * 1. Go to https://jsonbin.io and create a free account
 * 2. Create a new bin with initial content: { "messages": [] }
 * 3. Copy your X-Master-Key (from API Keys section)
 * 4. Copy your Bin ID (from the bin URL)
 * 5. Update config.js with these values
 */

const StorageService = {
    // These will be loaded from config.js
    BIN_ID: typeof JSONBIN_CONFIG !== 'undefined' ? JSONBIN_CONFIG.BIN_ID : '',
    API_KEY: typeof JSONBIN_CONFIG !== 'undefined' ? JSONBIN_CONFIG.API_KEY : '',
    BASE_URL: 'https://api.jsonbin.io/v3/b',

    /**
     * Fetch all messages from JSONbin
     * @returns {Promise<Array>} Array of message objects
     */
    async getMessages() {
        if (!this.BIN_ID || !this.API_KEY) {
            console.warn('JSONbin not configured. Using localStorage fallback.');
            return this.getMessagesFromLocalStorage();
        }

        try {
            const response = await fetch(`${this.BASE_URL}/${this.BIN_ID}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            const data = await response.json();
            return data.record.messages || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Fallback to localStorage
            return this.getMessagesFromLocalStorage();
        }
    },

    /**
     * Save a new message to JSONbin
     * @param {Object} message - Message object with author and body
     * @returns {Promise<boolean>} Success status
     */
    async saveMessage(message) {
        if (!this.BIN_ID || !this.API_KEY) {
            console.warn('JSONbin not configured. Using localStorage fallback.');
            return this.saveMessageToLocalStorage(message);
        }

        try {
            // First, get existing messages
            const messages = await this.getMessages();
            
            // Add new message with timestamp
            const newMessage = {
                ...message,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            messages.push(newMessage);

            // Update the bin
            const response = await fetch(`${this.BASE_URL}/${this.BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.API_KEY
                },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                throw new Error(`Failed to save message: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error saving message:', error);
            // Fallback to localStorage
            return this.saveMessageToLocalStorage(message);
        }
    },

    // LocalStorage fallback methods
    getMessagesFromLocalStorage() {
        const stored = localStorage.getItem('valentines_messages');
        return stored ? JSON.parse(stored) : [];
    },

    saveMessageToLocalStorage(message) {
        const messages = this.getMessagesFromLocalStorage();
        const newMessage = {
            ...message,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };
        messages.push(newMessage);
        localStorage.setItem('valentines_messages', JSON.stringify(messages));
        return true;
    }
};
