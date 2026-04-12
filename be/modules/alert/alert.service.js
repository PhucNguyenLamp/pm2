import { PopupProvider } from './providers/popup.provider.js';

export const AlertService = {
    /**
     * Generates the alert payload and triggers the real-time pop-up
     * @param {string} type - 'OUT_OF_ZONE' | 'LOW_BATTERY' | 'OFFLINE'
     */
    async sendCriticalAlert(type) {
        let title = 'CLMS SYSTEM ALERT';
        let message = '';

        // 1. Prepare payload based on the specific alert type
        switch (type) {
            case 'OUT_OF_ZONE':
                title = 'ALERT: OUT OF SAFE ZONE';
                message = 'The system detected that the child has left the safe zone. Please check their location immediately!';
                break;
            case 'LOW_BATTERY':
                title = 'WARNING: LOW BATTERY';
                message = 'The child\'s tracking device has less than 15% battery remaining. Please charge the device as soon as possible.';
                break;
            case 'OFFLINE':
                title = 'WARNING: CONNECTION LOST';
                message = 'The system has lost connection with the child\'s device for over 2 minutes (Heartbeat timeout).';
                break;
            default:
                message = 'There is an unusual event requiring parental attention.';
        }

        const alertPayload = {
            title,
            message,
            type,
            timestamp: new Date()
        };

        // 2. Execute the real-time WebSocket alert
        try {
            await PopupProvider.send(alertPayload);
            return { success: true, channel: 'WEBSOCKET_POPUP' };
        } catch (error) {
            console.error('[AlertService] Failed to send real-time popup alert.');
            throw new Error('Real-time alert delivery failed.');
        }
    }
};