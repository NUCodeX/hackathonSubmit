const db = require('../database')
const util = require('util')

const query = util.promisify(db.query).bind(db)

exports.statistics = async (req,res)=>{
    try {
        const statistics = await query(`SELECT * FROM statistics`)
        res.json(statistics)
    } catch (error) {
        
    }
}