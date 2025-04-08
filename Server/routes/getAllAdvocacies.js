const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);


exports.GetAllAdvocacies = async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT advocacy FROM advocacy');
    
    res.json({
      success: true,
      data: result.map(item => item.advocacy)
    });
    
  
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch advocacies" 
    });
  }
};