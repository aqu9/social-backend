const jwt = require('jsonwebtoken');

const isAuthorized = (req, res, next) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: 'Access token missing from header' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: 'Access token is invalid or has expired' });
  }
};

module.exports = {
  isAuthorized,
};
