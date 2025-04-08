const db = require('../database')
const uitl = require('util')

const query = uitl.promisify(db.query).bind(db)

exports.game =  async (req, res)=>{

    
    const {answer , question} = req.body

    const gameQuery = `INSERT INTO game (question, answer) VALUES (?, ?)`

    try{
        await query(gameQuery, [question, answer])
    }catch(err){
        console.log(err)
    }
    
}