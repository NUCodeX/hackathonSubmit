const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.Politics = async (req, res) => {
  try {
    const { 
      region, 
      province, 
      city, 
      education, 
      role, 
      ageRange,
      advocacies = [] 
    } = req.body;

    // Check election status
    const [election] = await query('SELECT * FROM election_settings ORDER BY id DESC LIMIT 1');
    if (election.status === "Close") {
      return res.json({ message: "Election is currently closed" });
    }

    let sql = `
      SELECT DISTINCT p.* 
      FROM politician p
      WHERE p.electoralyear = ?
    `;
    let params = [election.year];

    if (region) {
      sql += ' AND p.region = ?';
      params.push(region);
    }
    if (province) {
      sql += ' AND p.province = ?';
      params.push(province);
    }
    if (city) {
      sql += ' AND p.city = ?';
      params.push(city);
    }

    // Add other filters
    if (education) {
      sql += ' AND p.education = ?';
      params.push(education);
    }
    if (role) {
      sql += ' AND p.role = ?';
      params.push(role);
    }
   /*  if (ageRange) {
      if (ageRange === '70+') {
        sql += ' AND p.age >= 70';
      } else {
        const [minAge, maxAge] = ageRange.split('-').map(Number);
        sql += ' AND p.age BETWEEN ? AND ?';
        params.push(minAge, maxAge);
      }
    } */

    if (advocacies.length > 0) {
      sql += ` AND EXISTS (
        SELECT 1 FROM advocacy a
        WHERE a.politician_Id = p.id
        AND a.advocacy IN (?)
      )`;
      params.push(advocacies);
    }

    const politicians = await query(sql, params);

    if (politicians.length > 0) {
      const politicianIds = politicians.map(p => p.id);
      const advocacyResults = await query(`
        SELECT politician_Id, GROUP_CONCAT(advocacy) as advocacies
        FROM advocacy
        WHERE politician_Id IN (?)
        GROUP BY politician_Id
      `, [politicianIds]);

      const advocacyMap = {};
      advocacyResults.forEach(row => {
        advocacyMap[row.politician_Id] = row.advocacies.split(',');
      });

      politicians.forEach(p => {
        p.advocacies = advocacyMap[p.id] || [];
      });
    }

    res.json({
      success: true,
      data: politicians
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Something went wrong" 
    });
  }
};
