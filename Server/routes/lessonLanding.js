const db = require('../database')
const util = require('util')

const query = util.promisify(db.query).bind(db)

exports.landingLesson = async (req,res)=>{
    try{
        const result = await query(`SELECT * FROM lesson`)
        console.log(result);
        
        res.json(result)
    }catch(error){
        console.log(error);
    }

}