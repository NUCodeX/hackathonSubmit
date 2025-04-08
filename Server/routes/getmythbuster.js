const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);
let previouslySelectedQuestions = new Set(); 

exports.getMythbuster = async (req, res) => {
  
    try {
        const result = await query('SELECT * FROM mythbuster');

        if (result.length > 0) {
            const availableQuestions = result.filter(q => !previouslySelectedQuestions.has(q.id));

            if (availableQuestions.length > 0) {
                const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
                previouslySelectedQuestions.add(randomQuestion.id); 

                if (previouslySelectedQuestions.size >= result.length) {
                    previouslySelectedQuestions.clear(); 
                }

                res.json({ 
                    question: randomQuestion.question, 
                    correct_answer: randomQuestion.answer 
                }); 
            } else {
                res.status(404).json({ message: 'All questions have been answered.' });
            }
        } else {
            res.status(404).json({ message: 'No questions found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
};
