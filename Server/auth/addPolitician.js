const db = require('../database');
const util = require('util');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "upload/")
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage})

exports.addPolitician = [
    upload.single("image"),
    async (req, res) => {
        const queryAsync = util.promisify(db.query).bind(db);

        try {
                // Parse the JSON strings from form data
      const pastRoles = req.body.pastRoles ? JSON.parse(req.body.pastRoles) : [];
      const pastActivities = req.body.pastActivities ? JSON.parse(req.body.pastActivities) : [];
      const advocacy = req.body.advocacy ? JSON.parse(req.body.advocacy) : [];

      const { firstname, lastname, prefix, suffix, middlename, role, province, city, region, electoralYear, education, age } = req.body;
      const image = req.file ? req.file.filename : "";

      if (!firstname || !lastname || !role) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const politicianQuery = `
        INSERT INTO politician (firstname, lastname, prefix, suffix, middlename, image, role, region, province, city, electoralyear,education, age)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const politicianData = [
        firstname, lastname, prefix || '', suffix || '', middlename || '', 
        image , role, region, province, city, electoralYear || null, education || null,
      age];

      const result = await queryAsync(politicianQuery, politicianData);
      const politicianId = result.insertId;

      // Insert advocacies
      if (advocacy.length > 0) {
        const uniqueAdvocacy = [...new Set(advocacy)];
        const advocacyQuery = `
          INSERT INTO advocacy (advocacy, politician_Id) 
          VALUES ${uniqueAdvocacy.map(() => "(?, ?)").join(", ")}
        `;
        const advocacyValues = uniqueAdvocacy.flatMap(item => [item, politicianId]);
        await queryAsync(advocacyQuery, advocacyValues);
      }

      // Insert past roles
      if (pastRoles.length > 0) {
        const rolesQuery = `
          INSERT INTO pastroles (politician_id, role, year)
          VALUES ${pastRoles.map(() => "(?, ?, ?)").join(", ")}
        `;
        const rolesValues = pastRoles.flatMap(role => [politicianId, role.role, role.year]);
        await queryAsync(rolesQuery, rolesValues);
      }

      // Insert past activities
      if (pastActivities.length > 0) {
        const activitiesQuery = `
          INSERT INTO pastactivities (politician_id, activity, reference)
          VALUES ${pastActivities.map(() => "(?, ?, ?)").join(", ")}
        `;
        const activitiesValues = pastActivities.flatMap(activity => [
          politicianId, 
          activity.details, 
          activity.reference || null
        ]);
        await queryAsync(activitiesQuery, activitiesValues);
      }

      res.status(201).json({ 
        message: "Politician added successfully",
        politicianId 
      });

        } catch (error) {
            console.error("Error adding politician:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
];

