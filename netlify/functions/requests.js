import pool from './db.js';
import jwt from 'jsonwebtoken';

const verifyToken = (event) => {
  const token = event.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (err) {
    return null;
  }
};

export const handler = async (event, context) => {
  const user = verifyToken(event);
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  const method = event.httpMethod;

  try {
    if (method === 'GET') {
      const res = await pool.query(`
        SELECT r.*, u.name as requester_name 
        FROM requests r 
        JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC
      `);
      return { statusCode: 200, body: JSON.stringify(res.rows) };
    }

    if (method === 'POST') {
      const { drug_name, quantity, location, priority, photo_url } = JSON.parse(event.body);
      const res = await pool.query(
        'INSERT INTO requests (user_id, drug_name, quantity, location, priority, photo_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [user.id, drug_name, quantity, location, priority, photo_url, 'Pending']
      );
      
      await pool.query(
        'INSERT INTO activity_logs (request_id, user_id, action) VALUES ($1, $2, $3)',
        [res.rows[0].id, user.id, 'Mengajukan permintaan baru']
      );

      return { statusCode: 201, body: JSON.stringify(res.rows[0]) };
    }

    if (method === 'PUT') {
      const { id, status } = JSON.parse(event.body);
      const res = await pool.query(
        'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
      );

      await pool.query(
        'INSERT INTO activity_logs (request_id, user_id, action) VALUES ($1, $2, $3)',
        [id, user.id, `Status diupdate ke ${status}`]
      );

      return { statusCode: 200, body: JSON.stringify(res.rows[0]) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (err) {
    console.error('Requests error:', err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
