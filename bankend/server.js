// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Your Alpha Vantage API Key
const ALPHA_VANTAGE_API_KEY = '527IYY90A0RYVMK9';

// Route to get market news
app.get('/api/news', async (req, res) => {
    try {
        const { pair } = req.query;
        
        // Extract base currency from pair (e.g., EUR/USD -> EUR)
        const baseCurrency = pair ? pair.split('/')[0] : 'EUR';
        
        // Make request to Alpha Vantage API
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'NEWS_SENTIMENT',
                topics: 'forex',
                apikey: ALPHA_VANTAGE_API_KEY,
            }
        });

        // Return only relevant data to frontend
        const newsData = response.data.articles || [];
        
        // Filter news by currency
        const filteredNews = newsData.filter(article => 
            article.title.toLowerCase().includes(baseCurrency.toLowerCase()) ||
            article.summary.toLowerCase().includes(baseCurrency.toLowerCase())
        );
        
        res.json({
            success: true,
             filteredNews.slice(0, 5),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching market news'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
