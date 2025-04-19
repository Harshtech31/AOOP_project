const Session = require('../models/Session');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ message: 'Unauthorized - No session ID' });
  }

  try {
    const session = await Session.findOne({
      session_id: sessionId,
      expires_at: { $gt: new Date() },
      is_revoked: false
    }).populate('user_id');
    
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }
    
    req.user = { id: session.user_id._id };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

module.exports = { authenticate }; 