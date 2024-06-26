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
                    return res.status(200).json({status:false,message:'The mobile number is used, please try another number.',surveyor:{}})
                }
                if(password!==confirm_password){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Wrong password. The password you entered does not match.',surveyor:{}})
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


// get surveyor by services id and date and surveyor id
exports.getSurveyorByServiceIdAndDateAndSurveyorId = async (req, res, next) => {
    try {
        let {date,service_id,surveyor_id}=req.query
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
                JOIN surveyor_experiences ON surveyors.surveyor_id=surveyor_experiences.surveyor_id
                WHERE surveyors.surveyor_id NOT IN (
                    SELECT appointment.surveyor_id
                    FROM appointment
                    WHERE appointment.appointment_date = ?
                )
                AND surveyors.surveyor_id=? AND surveyors.surveyor_is_approved=1 AND surveyor_transaction.is_verified=1 AND surveyor_experiences.service_id=?`;
                const values=[date,surveyor_id,service_id]
                const surveyors = await queryAsync(get_surveyors_query,values);
                if (surveyors.length === 0) {
                    return res.status(200).json({ status: true, message: 'Surveyor not found', surveyor: {} });
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
                            return res.status(500).json({ status: false, message: 'Failed to find Surveyor', surveyor: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', surveyor: nestedJsonData.data[0] });
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

// update surveyor profile
exports.updateSurveyorProfile = async (req, res, next) => {
    try {
        const id = req.query.surveyor_id;
        let {name,mobile_number,division,district,upzila,address}=req.body

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }

            try {
                const get_surveyor_query = 'SELECT * FROM surveyors WHERE surveyor_id = ?';
                const existing_surveyor = await queryAsync(get_surveyor_query, [id]);
                console.log(existing_surveyor)
                if (existing_surveyor.length === 0) {
                    return res.status(200).json({ status: false, message: 'No surveyor found', surveyor: {} });
                }

                let image=existing_surveyor[0].surveyor_image
                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const update_surveyor_query = 'UPDATE surveyors SET surveyor_name = ?,surveyor_image=?, surveyor_mobile_number = ?,surveyor_division = ?, surveyor_district = ?,surveyor_upzila=?, surveyor_address=? WHERE surveyor_id = ?';
                const updateValues = [name,image, mobile_number,division,district,upzila,address, id];
                await queryAsync(update_surveyor_query, updateValues);

                const get_updated_surveyor_query = `SELECT s.*,
                d.*,
                di.*,
                u.*
                FROM surveyors as s
                INNER JOIN divisions as d ON s.surveyor_division=d.division_id
                INNER JOIN districts as di ON s.surveyor_district=di.district_id
                INNER JOIN upzilas as u ON s.surveyor_upzila=u.upzila_id WHERE s.surveyor_id = ?`;
                const surveyor = await queryAsync(get_updated_surveyor_query, [id]);
                //console.log(surveyor)
                const nestedJsonData={
                    data:{
                        surveyor_id:surveyor[0].surveyor_id,
                        surveyor_name:surveyor[0].surveyor_name,
                        surveyor_image:surveyor[0].surveyor_image,
                        surveyor_mobile_number:surveyor[0].surveyor_mobile_number,
                        surveyor_password:surveyor[0].surveyor_password,
                        surveyor_address:surveyor[0].surveyor_address,
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
                            return res.status(500).json({ status: false, message: 'Failed to update surveyor profile', surveyor: {} });
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

// change surveyor is_approved status 
exports.surveyorApprovalChange=async(req,res,next)=>{
    try{
        let surveyor_id=req.query.surveyor_id
        
        let {surveyor_is_approved}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', surveyor:{}})
            }
            try{
                const get_surveyor_query='SELECT * FROM surveyors WHERE surveyor_id = ? '
                const is_surveyor_present=await queryAsync(get_surveyor_query,[surveyor_id])
                if(is_surveyor_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Surveyor not found.',surveyor:{}})
                }
                
                const update_surveyor_query=`UPDATE surveyors SET surveyor_is_approved=? WHERE surveyor_id=?`
                const values=[surveyor_is_approved,surveyor_id]
                await queryAsync(update_surveyor_query,values)
                
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
                            return res.status(500).json({status:false,message:'Failed to update surveyor data',surveyor:{}})
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

// change surveyor transaction verification
exports.surveyorTransactionVerificationChange=async(req,res,next)=>{
    try{
        let surveyor_id=req.query.surveyor_id
        
        let {is_verified}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', transaction:{}})
            }
            try{
                const get_transaction_query='SELECT * FROM surveyor_transaction WHERE surveyor_id = ? '
                const is_transaction_present=await queryAsync(get_transaction_query,[surveyor_id])
                if(is_transaction_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Transaction not found.',transaction:{}})
                }
                
                const update_transaction_query=`UPDATE surveyor_transaction SET is_verified=? WHERE surveyor_id=?`
                const values=[is_verified,surveyor_id]
                await queryAsync(update_transaction_query,values)
                
                const get_update_transaction_query=`SELECT * FROM surveyor_transaction WHERE surveyor_id=?`
                const transaction_data=await queryAsync(get_update_transaction_query,[surveyor_id])

             
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to update surveyor transaction data',transaction:{}})
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

// delete surveyor
exports.deleteSurveyor = async (req, res, next) => {
    try {
        const id = req.query.surveyor_id;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }

            try {
                const get_surveyor_query = 'SELECT * FROM surveyors WHERE surveyor_id = ?';
                const existing_surveyor = await queryAsync(get_surveyor_query, [id]);

                if (existing_surveyor.length === 0) {
                    return res.status(200).json({ status: false, message: 'No surveyor found', surveyor: {} });
                }

                

                const delete_surveyor_query = `DELETE FROM surveyors WHERE surveyor_id = ?`;
                
                await queryAsync(delete_surveyor_query, [id]);

                
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete surveyor ', surveyor: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', surveyor: existing_surveyor[0] });
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

// change password
exports.changeSurveyorPassword = async (req, res, next) => {
    try {
        const surveyor_id = req.query.surveyor_id;
        const { newPassword } = req.body;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', surveyor: {} });
            }

            try {
                const get_surveyor_query = `SELECT * FROM surveyors WHERE surveyor_id=?`;
                const existing_surveyor = await queryAsync(get_surveyor_query, [surveyor_id]);

                if (existing_surveyor.length === 0) {
                    return res.status(200).json({ status: true, message: 'No surveyor found', surveyor: {} });
                }

                const hashedNewPassword = await bcrypt.hash(newPassword,10)
                const update_surveyor_query = 'UPDATE surveyors SET surveyor_password = ? WHERE surveyor_id = ?';
                const updateValues = [hashedNewPassword, surveyor_id];
                await queryAsync(update_surveyor_query, updateValues);

                const find_surveyor_by_id=`SELECT c.*,
                                                    d.*,
                                                    di.*,
                                                    u.*
                                                    FROM surveyors as c
                                                    INNER JOIN divisions as d ON c.surveyor_division=d.division_id
                                                    INNER JOIN districts as di ON c.surveyor_district=di.district_id
                                                    INNER JOIN upzilas as u ON c.surveyor_upzila=u.upzila_id WHERE c.surveyor_id = ?`;
                const surveyor=await queryAsync(find_surveyor_by_id,[surveyor_id])

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to change surveyor password', surveyor: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', surveyor: surveyor[0] });
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


// verify code for forgot surveyor_password
exports.verifySurveyorCode=async(req,res,next)=>{
    try{
        // const apiKey = '2p34tR8mVe6wcj55iJR84f7h3aWCSYcqFh697czL';
        // const {to,code} = req.body;
      
      
        // const options = {
        //   method: 'POST',
        //   url: 'https://api.sms.net.bd/sendsms',
        //   formData: {
        //     api_key: apiKey,
        //     msg: code,
        //     to: to,
        //   },
        // };
      
        // request(options, function (error, response, body) {
        //   if (error) {
        //     res.status(500).send({
        //       status:'false',
        //       message:'Error sending SMS',
        //       data:''
        //     });
        //     return;
        //   }
        //   console.log('SMS sent:', body);
        //   res.send({
        //     status:'true',
        //     message:'SMS send Successfully',
        //     data:body
        //   });
        // });
        
    }catch(e){
        console.log(e);
        return res.status(503).json({ status: 'false', message: 'Internal Server Error', surveyor: {} }); 
    }
}


// reset surveyor_password
exports.resetSurveyorPassword=async(req,res,next)=>{
    try{
        let {surveyor_mobile_number,surveyor_password,confirm_surveyor_password}=req.body
        db.beginTransaction(async(err)=>{
            if (err) {
                return res.status(503).json({ status: 'false', message: 'Internal Server Error', surveyor: {} });
            }

            try{
                const get_surveyor_query=`SELECT * FROM surveyors 
                                WHERE surveyor_mobile_number = ?`
                const surveyor=await queryAsync(get_surveyor_query,[surveyor_mobile_number])
                if(surveyor.length===0){
                    return res.status(200).json({ status: 'false', message: 'No surveyor found with phone number', surveyor: {} });
                }

                if(surveyor_password!=confirm_surveyor_password){
                    return res.status(200).json({ status: 'false', message: 'Wrong surveyor_password. The surveyor_password you entered does not match.', surveyor: {} });
                }

                surveyor_password=await bcrypt.hash(surveyor_password,10)
                const update_surveyor_query = 'UPDATE surveyors SET surveyor_password = ? WHERE surveyor_mobile_number = ?';
                const updateValues = [surveyor_password, surveyor_mobile_number];
                await queryAsync(update_surveyor_query, updateValues);
                const updated_surveyor=await queryAsync(get_surveyor_query,[surveyor_mobile_number])
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: 'false', message: 'Failed to reset surveyor surveyor_password', surveyor: {} });
                        });
                    }

                    return res.status(200).json({ status: 'true', message: '', surveyor: updated_surveyor[0] });
                });

            }catch(e){
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: 'false', message: 'Internal Server Error', surveyor: {} });
            }
        })
    }catch(e){
        console.log(e);
        return res.status(503).json({ status: 'false', message: 'Internal Server Error', surveyor: {} }); 
    }
}