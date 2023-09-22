const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const bcrypt=require('bcrypt')
const base_url = require('../../const/const')

// surveyor registration
exports.surveyorRegistration=async(req,res,next)=>{
    try{
        let {name,mobile_number,division,district,upzila,address,password,confirm_password}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', surveyor:{}})
            }
            try{
                const get_surveyor_query='SELECT * FROM surveyors WHERE surveyor_mobile_number = ? '
                const is_surveyor_present=await queryAsync(get_surveyor_query,[mobile_number])
                if(is_surveyor_present.length>0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'The mobile number is used, please try another number.',celebrity:{}})
                }
                if(password!==confirm_password){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Wrong password. The password you entered does not match.',celebrity:{}})
                }
                password=await bcrypt.hash(password,10)
                let surveyor_image=null
                if(req.file){
                    surveyor_image=`${base_url}/uploads/${req.file.filename}`
                }
                const insert_surveyor_query=`INSERT INTO surveyors(surveyor_name,surveyor_image,surveyor_mobile_number,surveyor_division,surveyor_district,surveyor_upzila,surveyor_address,surveyor_password,surveyor_is_approved) VALUES (?,?,?,?,?,?,?,?,?)`
                const values=[name,surveyor_image,mobile_number,division,district,upzila,address,password,0]
                const surveyor=await queryAsync(insert_surveyor_query,values)

                const surveyor_id=surveyor.insertId
                const get_inserted_surveyor_query=`SELECT s.*,
                                                d.*,
                                                di.*,
                                                u.*
                                                FROM surveyors as s
                                                INNER JOIN divisions as d ON s.surveyor_division=d.division_id
                                                INNER JOIN districts as di ON s.surveyor_district=di.district_id
                                                INNER JOIN upzilas as u ON s.surveyor_upzila=u.upzila_id WHERE s.surveyor_id = ?`
                const surveyor_data=await queryAsync(get_inserted_surveyor_query,[surveyor_id])

                const nestedJsonData={
                    data:{
                        surveyor_id:surveyor_data[0].surveyor_id,
                        surveyor_name:surveyor_data[0].surveyor_name,
                        surveyor_image:surveyor_data[0].surveyor_image,
                        surveyor_mobile_number:surveyor_data[0].surveyor_mobile_number,
                        surveyor_password:surveyor_data[0].surveyor_password,
                        surveyor_address:surveyor_data[0].surveyor_address,
                        surveyor_is_approved:surveyor_data[0].surveyor_is_approved,
                        surveyor_createdAt:surveyor_data[0].surveyor_createdAt,
                        surveyor_updatedAt:surveyor_data[0].surveyor_updatedAt,
                        division:{
                            division_id:surveyor_data[0].division_id,
                            division_name:surveyor_data[0].division_name,
                            division_createdAt:surveyor_data[0].division_createdAt,
                            division_updatedAt:surveyor_data[0].division_updatedAt,
                            district:{
                                district_id:surveyor_data[0].district_id,
                                district_name:surveyor_data[0].district_name,
                                district_createdAt:surveyor_data[0].district_createdAt,
                                district_updatedAt:surveyor_data[0].district_updatedAt,
                                upzila:{
                                    upzila_id:surveyor_data[0].upzila_id,
                                    upzila_name:surveyor_data[0].upzila_name,
                                    upzila_createdAt:surveyor_data[0].upzila_createdAt,
                                    upzila_updatedAt:surveyor_data[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert surveyor data',surveyor:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',surveyor:nestedJsonData.data})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',surveyor:{}})
    }
}

// surveyor login 
exports.surveyorLogin=async(req,res,next)=>{
    try{
        let {mobile_number,password}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',surveyor:{}})
            }
            try{
                const find_surveyor_by_mobile_number=`SELECT s.*,
                                                    d.*,
                                                    di.*,
                                                    u.*
                                                    FROM surveyors as s
                                                    INNER JOIN divisions as d ON s.surveyor_division=d.division_id
                                                    INNER JOIN districts as di ON s.surveyor_district=di.district_id
                                                    INNER JOIN upzilas as u ON s.surveyor_upzila=u.upzila_id WHERE s.surveyor_mobile_number = ?`;
                const surveyor=await queryAsync(find_surveyor_by_mobile_number,[mobile_number])
                
                if(surveyor.length===0){
                    db.rollback()
                    return res.status(200).json({ status: true, message: 'surveyor Not Found', surveyor: {} });
                }

                const password_match=await bcrypt.compare(password,surveyor[0].surveyor_password)
                if(!password_match){
                    db.rollback()
                    return res.status(200).json({ status: false, message: 'Wrong password. The password you entered does not match.', surveyor: {} });
                }

                const nestedJsonData={
                    data:{
                        surveyor_id:surveyor[0].surveyor_id,
                        surveyor_name:surveyor[0].surveyor_name,
                        surveyor_image:surveyor[0].surveyor_image,
                        surveyor_mobile_number:surveyor[0].surveyor_mobile_number,
                        surveyor_password:surveyor[0].surveyor_password,
                        surveyor_address:surveyor[0].surveyor_address,
                        surveyor_is_approved:surveyor[0].surveyor_is_approved,
                        surveyor_createdAt:surveyor[0].surveyor_createdAt,
                        surveyor_updatedAt:surveyor[0].surveyor_updatedAt,
                        division:{
                            division_id:surveyor[0].division_id,
                            division_name:surveyor[0].division_name,
                            division_createdAt:surveyor[0].division_createdAt,
                            division_updatedAt:surveyor[0].division_updatedAt,
                            district:{
                                district_id:surveyor[0].district_id,
                                district_name:surveyor[0].district_name,
                                district_createdAt:surveyor[0].district_createdAt,
                                district_updatedAt:surveyor[0].district_updatedAt,
                                upzila:{
                                    upzila_id:surveyor[0].upzila_id,
                                    upzila_name:surveyor[0].upzila_name,
                                    upzila_createdAt:surveyor[0].upzila_createdAt,
                                    upzila_updatedAt:surveyor[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'surveyor login failed',surveyor:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',surveyor:nestedJsonData.data})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',surveyor:{}})
    }
}


// get surveyor by services id and date
exports.getSurveyorByServiceIdAndDate = async (req, res, next) => {
    try {
        let {date,service_id}=req.query
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyors: [] });
            }

            try {
                const get_surveyors_query = `SELECT surveyors.*,
                d.*,
                di.*,
                u.*
                FROM surveyors
                INNER JOIN divisions as d ON surveyors.surveyor_division=d.division_id
                INNER JOIN districts as di ON surveyors.surveyor_district=di.district_id
                INNER JOIN upzilas as u ON surveyors.surveyor_upzila=u.upzila_id
                INNER JOIN surveyor_transaction ON surveyors.surveyor_id=surveyor_transaction.surveyor_id
                JOIN surveyor_experiences ON surveyors.surveyor_id=surveyor_experiences.surveyor_id
                WHERE surveyors.surveyor_id NOT IN (
                    SELECT appointment.surveyor_id
                    FROM appointment
                    WHERE appointment.appointment_date = ?
                )
                AND surveyors.surveyor_is_approved=1 AND surveyor_transaction.is_verified=1 AND surveyor_experiences.service_id=?`;
                const values=[date,service_id]
                const surveyors = await queryAsync(get_surveyors_query,values);
                if (surveyors.length === 0) {
                    return res.status(200).json({ status: true, message: 'Surveyors not found', surveyors: [] });
                }

                const nestedJsonData={
                    data:surveyors.map((surveyor=>({
                        surveyor_id:surveyor.surveyor_id,
                        surveyor_name:surveyor.surveyor_name,
                        surveyor_image:surveyor.surveyor_image,
                        surveyor_mobile_number:surveyor.surveyor_mobile_number,
                        surveyor_password:surveyor.surveyor_password,
                        surveyor_address:surveyor.surveyor_address,
                        surveyor_is_approved:surveyor.surveyor_is_approved,
                        surveyor_createdAt:surveyor.surveyor_createdAt,
                        surveyor_updatedAt:surveyor.surveyor_updatedAt,
                        division:{
                            division_id:surveyor.division_id,
                            division_name:surveyor.division_name,
                            division_createdAt:surveyor.division_createdAt,
                            division_updatedAt:surveyor.division_updatedAt,
                            district:{
                                district_id:surveyor.district_id,
                                district_name:surveyor.district_name,
                                district_createdAt:surveyor.district_createdAt,
                                district_updatedAt:surveyor.district_updatedAt,
                                upzila:{
                                    upzila_id:surveyor.upzila_id,
                                    upzila_name:surveyor.upzila_name,
                                    upzila_createdAt:surveyor.upzila_createdAt,
                                    upzila_updatedAt:surveyor.upzila_updatedAt
                                }
                            },
                        },
                    })))
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find Surveyors', surveyors: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', surveyors: nestedJsonData.data });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyors: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', surveyors: [] });
    }
};

// get all surveyors 
exports.getAllSurveyors = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyors: [] });
            }

            try {
                const get_surveyors_query = `SELECT surveyors.*,
                d.*,
                di.*,
                u.*
                FROM surveyors
                INNER JOIN divisions as d ON surveyors.surveyor_division=d.division_id
                INNER JOIN districts as di ON surveyors.surveyor_district=di.district_id
                INNER JOIN upzilas as u ON surveyors.surveyor_upzila=u.upzila_id
                INNER JOIN surveyor_transaction ON surveyors.surveyor_id=surveyor_transaction.surveyor_id
                WHERE surveyors.surveyor_is_approved=1 AND surveyor_transaction.is_verified=1`;
                
                const surveyors = await queryAsyncWithoutValue(get_surveyors_query);
                if (surveyors.length === 0) {
                    return res.status(200).json({ status: true, message: 'Surveyors not found', surveyors: [] });
                }

                const nestedJsonData={
                    data:surveyors.map((surveyor=>({
                        surveyor_id:surveyor.surveyor_id,
                        surveyor_name:surveyor.surveyor_name,
                        surveyor_image:surveyor.surveyor_image,
                        surveyor_mobile_number:surveyor.surveyor_mobile_number,
                        surveyor_password:surveyor.surveyor_password,
                        surveyor_address:surveyor.surveyor_address,
                        surveyor_is_approved:surveyor.surveyor_is_approved,
                        surveyor_createdAt:surveyor.surveyor_createdAt,
                        surveyor_updatedAt:surveyor.surveyor_updatedAt,
                        division:{
                            division_id:surveyor.division_id,
                            division_name:surveyor.division_name,
                            division_createdAt:surveyor.division_createdAt,
                            division_updatedAt:surveyor.division_updatedAt,
                            district:{
                                district_id:surveyor.district_id,
                                district_name:surveyor.district_name,
                                district_createdAt:surveyor.district_createdAt,
                                district_updatedAt:surveyor.district_updatedAt,
                                upzila:{
                                    upzila_id:surveyor.upzila_id,
                                    upzila_name:surveyor.upzila_name,
                                    upzila_createdAt:surveyor.upzila_createdAt,
                                    upzila_updatedAt:surveyor.upzila_updatedAt
                                }
                            },
                        },
                    })))
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find Surveyors', surveyors: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', surveyors: nestedJsonData.data });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyors: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', surveyors: [] });
    }
};


// get all surveyors 
exports.getSurveyorById = async (req, res, next) => {
    try {
        let id=req.query.surveyor_id
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }

            try {
                const get_surveyors_query = `SELECT surveyors.*,
                d.*,
                di.*,
                u.*
                FROM surveyors
                INNER JOIN divisions as d ON surveyors.surveyor_division=d.division_id
                INNER JOIN districts as di ON surveyors.surveyor_district=di.district_id
                INNER JOIN upzilas as u ON surveyors.surveyor_upzila=u.upzila_id
                INNER JOIN surveyor_transaction ON surveyors.surveyor_id=surveyor_transaction.surveyor_id
                WHERE surveyors.surveyor_id=? AND surveyors.surveyor_is_approved=1 AND surveyor_transaction.is_verified=1`;
                
                const surveyor = await queryAsync(get_surveyors_query,[id]);
                if (surveyor.length === 0) {
                    return res.status(200).json({ status: true, message: 'Surveyors not found', surveyor: {} });
                }

                const nestedJsonData={
                    data:{
                        surveyor_id:surveyor[0].surveyor_id,
                        surveyor_name:surveyor[0].surveyor_name,
                        surveyor_image:surveyor[0].surveyor_image,
                        surveyor_mobile_number:surveyor[0].surveyor_mobile_number,
                        surveyor_password:surveyor[0].surveyor_password,
                        surveyor_address:surveyor[0].surveyor_address,
                        surveyor_is_approved:surveyor[0].surveyor_is_approved,
                        surveyor_createdAt:surveyor[0].surveyor_createdAt,
                        surveyor_updatedAt:surveyor[0].surveyor_updatedAt,
                        division:{
                            division_id:surveyor[0].division_id,
                            division_name:surveyor[0].division_name,
                            division_createdAt:surveyor[0].division_createdAt,
                            division_updatedAt:surveyor[0].division_updatedAt,
                            district:{
                                district_id:surveyor[0].district_id,
                                district_name:surveyor[0].district_name,
                                district_createdAt:surveyor[0].district_createdAt,
                                district_updatedAt:surveyor[0].district_updatedAt,
                                upzila:{
                                    upzila_id:surveyor[0].upzila_id,
                                    upzila_name:surveyor[0].upzila_name,
                                    upzila_createdAt:surveyor[0].upzila_createdAt,
                                    upzila_updatedAt:surveyor[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find Surveyors', surveyors: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', surveyor: nestedJsonData.data });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
    }
};


// create transaction for surveyor
exports.createSurveyorTransaction=async(req,res,next)=>{
    try{
        let {surveyor_id,account_number,account_type,amount,transaction_id}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',transaction:{}})
            }
            try{
                
                const insert_transaction_query='INSERT INTO surveyor_transaction (surveyor_id,account_number,account_type,amount,transaction_id,is_verified) VALUES (?,?,?,?,?,?)'
                const values=[surveyor_id,account_number,account_type,amount,transaction_id,0]
                const created_transaction=await queryAsync(insert_transaction_query,values)
                const id=created_transaction.insertId
                const get_created_transaction='SELECT * FROM surveyor_transaction WHERE id=?'
                const transaction_data=await queryAsync(get_created_transaction,[id])

                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert transaction',transaction:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',transaction:transaction_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', transaction: {} });
            }

        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',transaction:{}})
    }
}

