const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// create surveyor experience 
exports.createSurveyorExperience=async(req,res,next)=>{
    try{
        let {surveyor_id,service_id}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',surveyor_experience:{}})
            }
            try{
                
                const insert_surveyor_experience_query='INSERT INTO surveyor_experiences (surveyor_id,service_id) VALUES (?,?)'
                const values=[surveyor_id,service_id]
                const created_surveyor_experience=await queryAsync(insert_surveyor_experience_query,values)
                const surveyor_experience_id=created_surveyor_experience.insertId
                const get_created_surveyor_experience='SELECT * FROM surveyor_experiences WHERE surveyor_experience_id=?'
                const surveyor_experience_data=await queryAsync(get_created_surveyor_experience,[surveyor_experience_id])
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert surveyor experience',surveyor_experience:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',surveyor_experience:surveyor_experience_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor_experience: {} });
            }

        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',surveyor_experience:{}})
    }
}