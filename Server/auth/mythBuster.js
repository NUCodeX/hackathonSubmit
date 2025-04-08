const db = require('../database')
const util = require('util')


const query = util.promisify(db.query).bind(db)

exports.mythBuster = async (req, res) => {
    try {
        const {answer, question} = req.body
        console.log(answer);
        
        const mythBusterQuery = `INSERT INTO mythbuster (question, answer) VALUES (?, ?)`

        if(answer === '' || question === ''){
            return res.status(400).json({ error: "Missing required fields" });
        }
        await query(mythBusterQuery, [question, answer])
        
    }catch(error){
        console.log(error);
        
    }

}