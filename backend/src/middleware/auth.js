import jwt from 'jsonwebtoken';

// DELETE this line from the top of the file:
// const JWT_SECRET = process.env.JWT_SECRET; 

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  // Use process.env.JWT_SECRET directly here.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT VERIFICATION ERROR:", err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}
