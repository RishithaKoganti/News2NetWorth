const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// Your Colab URL
const COLAB_ML_URL = 'https://milliary-danae-homotaxial.ngrok-free.dev';

// Apply auth middleware to all routes
router.use(auth);

// Prediction endpoint
router.post('/predict', async (req, res) => {
    try {
        const { news_article } = req.body;
        
        if (!news_article) {
            return res.status(400).json({ 
                success: false, 
                error: 'News article is required' 
            });
        }

        console.log('📡 Sending to Colab:', news_article.substring(0, 50) + '...');
        
        const response = await axios.post(`${COLAB_ML_URL}/predict`, {
            news_article: news_article
        }, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            timeout: 30000
        });

        res.json({
            ...response.data,
            timestamp: new Date().toISOString(),
            user_id: req.userId
        });

    } catch (error) {
        console.error('❌ Colab error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'ML service unavailable' 
        });
    }
});

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        const response = await axios.get(`${COLAB_ML_URL}/health`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        res.json({
            colab: 'connected',
            ...response.data
        });
    } catch (error) {
        res.json({
            colab: 'disconnected',
            message: 'Colab not reachable'
        });
    }
});

module.exports = router;