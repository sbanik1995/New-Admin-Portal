// Handles simple session-based admin authentication.
exports.login = (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === validUsername && password === validPassword) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    return res.status(200).json({ message: 'Login successful.' });
  }

  return res.status(401).json({ message: 'Invalid username or password.' });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully.' });
  });
};

exports.me = (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ isAuthenticated: false });
  }

  return res.status(200).json({
    isAuthenticated: true,
    username: req.session.username,
  });
};
