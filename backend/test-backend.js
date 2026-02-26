const axios = require('axios');

async function testBackend() {
    try {
        // First login to get token
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',  // ← REPLACE WITH YOUR EMAIL
            password: 'Test123!'         // ← REPLACE WITH YOUR PASSWORD
        });
        
        const token = loginRes.data.token;
        console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
        
        // Test prediction
        console.log('\nTesting prediction...');
        const predictRes = await axios.post(
            'http://localhost:5000/api/ml/predict',
            { news_article: 'Tesla announces record deliveries' },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        console.log('✅ Prediction successful!');
        console.log('Volatility:', predictRes.data.volatility);
        console.log('Confidence:', predictRes.data.confidence);
        console.log('Sentiment:', predictRes.data.sentiment);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('Backend not running on port 5000');
        }
    }
}

testBackend();