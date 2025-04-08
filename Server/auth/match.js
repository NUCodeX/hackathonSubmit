const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.matcher = async (req, res) => {
    try {
      const { categories } = req.body;
      const collectedIds = [];
      // Validate input
      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({
          error: true,
          message: "Categories array is required"
        });
      }
  
      // 1. Get politicians from advocacy table
      const placeholders = categories.map(() => '?').join(',');
      const advocacyQuery = `SELECT * FROM advocacy WHERE advocacy IN (${placeholders})`;
      const advocacyResults = await query(advocacyQuery, categories);
  
      const advPoliticianIds = advocacyResults.map(item => item.politician_Id);
      collectedIds.push(...advPoliticianIds);
  
      // 2. Politician table conditions
      const candidateCondition = [];
  
      if (categories.includes(60)) {
        candidateCondition.push(`age >= 60`);
      }
      if (categories.includes("College Graduate")) {
        candidateCondition.push(`education = 'College Graduate'`);
      }
  
      if (categories.includes("true")) {
        // Query to get all politician IDs from pastroles who have experience
        const experiencedResults = await query(`
          SELECT politician_id, COUNT(*) as roleCount
          FROM pastroles
          GROUP BY politician_id
          HAVING roleCount > 0
        `);
  
        const experiencedIds = experiencedResults.map(item => item.politician_Id);
        collectedIds.push(...experiencedIds);
      }
  
      if (candidateCondition.length > 0) {
        const conditionQuery = `SELECT * FROM politician WHERE ${candidateCondition.join(' OR ')}`;
        const politicians = await query(conditionQuery);
        const polIds = politicians.map(p => p.id);
        collectedIds.push(...polIds);
      }
  
      const pastQuery = `SELECT * FROM pastroles`;
      const pastRoles = await query(pastQuery);
      const pastRoleIds = pastRoles.map(p => p.politician_Id);
      collectedIds.push(...pastRoleIds);

      const allPoliticians = await query(`SELECT id FROM politician`);
      const validPoliticianIds = new Set(allPoliticians.map(p => p.id));
  
      const counts = {};
      collectedIds.forEach(id => {
        if (validPoliticianIds.has(id)) {
          counts[id] = (counts[id] || 0) + 1;
        }
      });
  
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const topMatchId = sorted.length > 0 ? sorted[0][0] : null;
  
      if (!topMatchId) {
        return res.json({
          error: true,
          message: 'No candidate matched',
          name: "No match found",
          score: 0
        });
      }
  
      const [matchedCandidate] = await query(`SELECT * FROM politician WHERE id = ?`, [topMatchId]);
  
      if (!matchedCandidate) {
        return res.json({
          error: true,
          message: 'Match not found in DB',
          name: "No match found",
          score: 0
        });
      }
  
      res.json({
        id: matchedCandidate.id,
        name: matchedCandidate.firstname + " " + matchedCandidate.lastname,
        age: matchedCandidate.age || 'N/A',
        education: matchedCandidate.education || 'N/A',
        role: matchedCandidate.role || 'N/A',
        error: false
      });
      
  
      console.log(matchedCandidate);
  
    } catch (error) {
      console.error('Matcher Error:', error);
      res.status(500).json({
        error: true,
        message: 'Server error occurred',
        name: "Error finding match",
        score: 0
      });
    }
  };
  