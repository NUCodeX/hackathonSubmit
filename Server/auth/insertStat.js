const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.stats = async (req, res) => {
  try {
  /*   const { id } = req.params;  */// Get ID from URL param

    const { correct, entry, title } = req.body;
    console.log(req.body);
    
    if (correct === undefined || entry === undefined || !title) {
      return res.status(400).json({ error: 'Missing correct, entry, or title' });
    }
    const sql = `
      INSERT INTO statistics ( correct, entries, title)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        correct = correct + VALUES(correct),
        entries = entries + VALUES(entries)
    `;
    console.log("Incoming stats:", { correct, entry, title });

    await query(sql, [correct, entry, title]);

    res.status(200).json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};