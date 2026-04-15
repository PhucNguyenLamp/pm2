import { sendAlertToClients } from '../../../socket.js';

export const PopupProvider = {
    /**
     * Broadcasts the pop-up alert command via WebSocket
     * @param {Object} alertData - Contains title, message, type, and timestamp
     */
    async send(alertData) {
        try {
            // Emit the event to all connected active clients
            sendAlertToClients(alertData);
            
            console.log('[Popup Provider] Successfully broadcasted popup alert via WebSocket.');
            return true;
        } catch (error) {
            console.error('[Popup Provider] Error broadcasting via WebSocket:', error.message);
            throw new Error(`WebSocket Popup failed: ${error.message}`);
        }
    }
};