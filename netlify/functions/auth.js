const pool = require('./db');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = res.rows[0];

    if (!user || user.password !== password) { // Simple password check for now, should use bcrypt in prod
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Email atau password salah' })
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: { id: user.id, email: user.email, role: user.role, name: user.name }
      })
    };
  } catch (err) {
    console.error('Auth error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};
