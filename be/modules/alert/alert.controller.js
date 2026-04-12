import { AlertService } from './alert.service.js';

export const AlertController = {
    /**
     * API Endpoint: Test the WebSocket Pop-up functionality
     * POST /api/alerts/test
     */
    async testAlert(req, res) {
        try {
            const { alertType } = req.body;
            
            // Trigger the service (defaults to 'OUT_OF_ZONE' if no type is provided)
            const result = await AlertService.sendCriticalAlert(alertType || 'OUT_OF_ZONE');

            return res.status(200).json({
                message: 'Alert triggered successfully',
                details: result
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};