const jwt = require('jsonwebtoken');

// Use the same secret key as in your auth routes
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token, authorization denied' 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add user info to request
        req.userId = decoded.userId;
        req.user = decoded;
        
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ 
            success: false, 
            message: 'Token is not valid' 
        });
    }
};