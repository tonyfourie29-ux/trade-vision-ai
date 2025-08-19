// api/news.js - Serverless function for Vercel
export default async function handler(req, res) {
    // Get the currency pair from query parameters
    const { pair } = req.query;
    const baseCurrency = pair ? pair.split('/')[0] : 'EUR';
    
    // Your Alpha Vantage API Key
    const API_KEY = '527IYY90A0RYVMK9';
    
    try {
        // Fetch news from Alpha Vantage
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=forex&apikey=${API_KEY}`);
        const data = await response.json();
        
        // Filter news by currency
        const articles = data.articles || [];
        const filteredNews = articles.filter(article => 
            article.title.toLowerCase().includes(baseCurrency.toLowerCase()) ||
            article.summary.toLowerCase().includes(baseCurrency.toLowerCase())
        ).slice(0, 5);
        
        res.status(200).json({
            success: true,
            data: filteredNews,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching news'
        });
    }
}
