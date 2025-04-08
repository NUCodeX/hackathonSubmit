const db = require('../database'); // Your original database module
const util = require('util');

const query = util.promisify(db.query).bind(db);

let previousQuestions = [];
let lastQuestion = null;

exports.rightAndRiddle = async (req, res) => {
  try {
    const tableCheck = await query('SELECT 1 FROM game LIMIT 1').catch(() => null);
    if (!tableCheck) {
      return res.status(500).json({ error: "Game table does not exist or is inaccessible" });
    }

    const allRows = await query('SELECT id FROM game');
    const allIds = allRows.map(row => row.id);

    if (!allIds || allIds.length < 4) {
      return res.status(400).json({ 
        error: "Not enough questions (minimum 4 required)",
        available: allIds.length || 0
      });
    }

    let correctQuestion = null;
    let availableIds = allIds.filter(id => !previousQuestions.includes(id));
    
    if (availableIds.length === 0) {
      previousQuestions = [];
      availableIds = [...allIds];
    }

    for (let i = 0; i < Math.min(100, availableIds.length); i++) {
      const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
      const rows = await query('SELECT * FROM game WHERE id = ?', [randomId]);
      
      if (rows && rows[0]) {
        correctQuestion = rows[0];
        previousQuestions.push(correctQuestion.id);
        lastQuestion = correctQuestion.id;
        break;
      }
    }

    if (!correctQuestion) {
      return res.status(404).json({ error: "No suitable question found" });
    }

    const wrongAnswerIds = allIds
      .filter(id => id !== correctQuestion.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const wrongAnswers = await query(
      'SELECT * FROM game WHERE id IN (?)',
      [wrongAnswerIds]
    );

    const allChoices = [correctQuestion, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);

    res.json({
      question: correctQuestion.question,
      choices: allChoices.map(q => q.answer),
      correctAnswer: correctQuestion.answer,
      remainingQuestions: allIds.length - previousQuestions.length
    });

  } catch (error) {
    console.error("Database Error:", {
      timestamp: new Date(),
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: "Internal server error",
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  }
};