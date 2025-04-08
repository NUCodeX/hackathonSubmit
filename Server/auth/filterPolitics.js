const db = require('../database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.filerPolitics = async (req, res) => {
    try {
                const { advocacy, platform, education } = req.body;


         const filterElection = await query('SELECT * FROM election_settings ORDER BY id DESC LIMIT 1');
        
            console.log(filterElection[0]);
            if(filterElection[0].status === 'Close'){
              console.log('The election is close');
              return res.json({messeage: "The election is close"})
              
            }

        if ((!advocacy || advocacy.length === 0) && 
            (!platform || platform.length === 0) && 
            (!education || education.length === 0)) {
            return res.status(400).json({ message: "Please select at least one filter (advocacy, platform, or education)." });
        }

        const sql = `SELECT politician_Id FROM advocacy WHERE advocacy IN (?) OR platform IN (?)`;
        const results = await query(sql, [advocacy.length ? advocacy : [null], platform.length ? platform : [null]]);
        
        const politicianIds = [...new Set(results.map(row => row.politician_Id))];

        if (politicianIds.length === 0) {
            return res.status(200).json({ message: "No politicians found", politicians: [] });
        }

        const sortPolitics = await query(
            `SELECT * FROM politician WHERE education IN (?) AND id IN (?) AND electoralyear IN (?)`, 
            [education.length ? education : [null], politicianIds, filterElection[0].year]
        );

        console.log('Filtered Politicians:', sortPolitics);
        res.status(200).json({ politicians: sortPolitics });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error", error });
    }
};
