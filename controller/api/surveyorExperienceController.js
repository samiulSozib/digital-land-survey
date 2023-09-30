const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// create surveyor experience 
// exports.createSurveyorExperience=async(req,res,next)=>{
//     try{
//         let {surveyor_id,service_id}=req.body
//         db.beginTransaction(async(err)=>{
//             if(err){
//                 return res.status(503).json({status:false,message:'Internal Server Error',surveyor_experience:{}})
//             }
//             try{
                
//                 const insert_surveyor_experience_query='INSERT INTO surveyor_experiences (surveyor_id,service_id) VALUES (?,?)'
//                 const values=[surveyor_id,service_id]
//                 const created_surveyor_experience=await queryAsync(insert_surveyor_experience_query,values)
//                 const surveyor_experience_id=created_surveyor_experience.insertId
//                 const get_created_surveyor_experience='SELECT * FROM surveyor_experiences WHERE surveyor_experience_id=?'
//                 const surveyor_experience_data=await queryAsync(get_created_surveyor_experience,[surveyor_experience_id])
                
//                 db.commit((err)=>{
//                     if(err){
//                         db.rollback(()=>{
//                             return res.status(500).json({status:false,message:'Failed to insert surveyor experience',surveyor_experience:{}})
//                         })
//                     }
                    
//                     return res.status(200).json({status:true,message:'',surveyor_experience:surveyor_experience_data[0]})
//                 })
//             }catch(e){
//                 console.log(e)
//                 db.rollback();
//                 return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor_experience: {} });
//             }

//         })
//     }catch(e){
//         console.log(e)
//         return res.status(503).json({status:false,message:'Internal Server Error',surveyor_experience:{}})
//     }
// }

// Create surveyor experience
exports.createSurveyorExperience = async (req, res, next) => {
    try {
        const experiences = req.body.experiences; // Assuming the request body contains an array of experiences

        if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Invalid or empty experience data',
                surveyor_experiences: [],
            });
        }

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({
                    status: false,
                    message: 'Internal Server Error',
                    surveyor_experiences: [],
                });
            }

            try {
                const insertExperiencePromises = experiences.map(async (experience) => {
                    const { surveyor_id, service_id } = experience;
                    const insertSurveyorExperienceQuery = 'INSERT INTO surveyor_experiences (surveyor_id, service_id) VALUES (?, ?)';
                    const values = [surveyor_id, service_id];
                    return queryAsync(insertSurveyorExperienceQuery, values);
                });

                const createdSurveyorExperienceResults = await Promise.all(insertExperiencePromises);
                const surveyorExperienceIds = createdSurveyorExperienceResults.map((result) => result.insertId);

                const getCreatedSurveyorExperiencesQuery = 'SELECT * FROM surveyor_experiences WHERE surveyor_experience_id IN (?)';
                const surveyorExperienceData = await queryAsync(getCreatedSurveyorExperiencesQuery, [surveyorExperienceIds]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({
                                status: false,
                                message: 'Failed to insert surveyor experiences',
                                surveyor_experiences: [],
                            });
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: '',
                        surveyor_experiences: surveyorExperienceData,
                    });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({
                    status: false,
                    message: 'Internal Server Error',
                    surveyor_experiences: [],
                });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({
            status: false,
            message: 'Internal Server Error',
            surveyor_experiences: [],
        });
    }
};


// Replace surveyor experiences or delete all experiences for a surveyor
exports.replaceOrDeleteSurveyorExperiences = async (req, res, next) => {
    try {
        const surveyor_id = req.query.surveyor_id;
        const experiences = req.body.experiences; // Assuming the request body contains an array of experiences to replace or is empty

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({
                    status: false,
                    message: 'Internal Server Error',
                    surveyor_experiences: [],
                });
            }

            try {
                // If experiences are provided in the request body, replace them; otherwise, delete all experiences for the surveyor
                if (experiences && Array.isArray(experiences) && experiences.length > 0) {
                    // Delete existing surveyor experiences
                    const deleteExperiencesQuery = 'DELETE FROM surveyor_experiences WHERE surveyor_id = ?';
                    await queryAsync(deleteExperiencesQuery, [surveyor_id]);

                    // Insert the new surveyor experiences
                    const insertExperiencePromises = experiences.map(async (experience) => {
                        const { service_id } = experience; // Assuming surveyor_id is the same as the one from req.query
                        const insertSurveyorExperienceQuery = 'INSERT INTO surveyor_experiences (surveyor_id, service_id) VALUES (?, ?)';
                        const values = [surveyor_id, service_id];
                        return queryAsync(insertSurveyorExperienceQuery, values);
                    });

                    await Promise.all(insertExperiencePromises);
                } else {
                    // Delete all experiences for the surveyor
                    const deleteAllExperiencesQuery = 'DELETE FROM surveyor_experiences WHERE surveyor_id = ?';
                    await queryAsync(deleteAllExperiencesQuery, [surveyor_id]);
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({
                                status: false,
                                message: 'Failed to replace or delete surveyor experiences',
                                surveyor_experiences: [],
                            });
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'Surveyor experiences replaced or deleted successfully',
                        surveyor_experiences: experiences?experiences:"",
                    });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({
                    status: false,
                    message: 'Internal Server Error',
                    surveyor_experiences: [],
                });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({
            status: false,
            message: 'Internal Server Error',
            surveyor_experiences: [],
        });
    }
};


