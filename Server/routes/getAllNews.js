
const db = require('../database')
const util = require('util')

const query = util.promisify(db.query).bind(db)

exports.getAllNews =  async (req,res)=>{
    try {
            const fetchNews = await query(`SELECT * FROM newflash`)
            console.log(fetchNews);
            
            return res.json(fetchNews)
    } catch (error) {
        console.log(error);
        
    }
}