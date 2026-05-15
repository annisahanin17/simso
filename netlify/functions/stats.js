const pool = require('./db');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  const token = event.headers.authorization?.split(' ')[1];
  if (!token) return { statusCode: 401, body: 'Unauthorized' };

  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending,
        COUNT(*) FILTER (WHERE status = 'Approved' OR status = 'Processing') as processing,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed
      FROM requests
    `);

    // Mocking some other stats from the images
    const extraStats = {
      stok_menipis: 12,
      obat_kadaluwarsa: 3
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ ...stats.rows[0], ...extraStats })
    };
  } catch (err) {
    console.error('Stats error:', err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
