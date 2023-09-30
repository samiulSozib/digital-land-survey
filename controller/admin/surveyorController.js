const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url=require('../../const/const')


// get surveyor list
exports.getSurveyorList=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_surveyors_query = `SELECT c.*,
                                        d.*,
                                        di.*,
                                        u.*
                                        FROM surveyors as c
                                        INNER JOIN divisions as d ON c.surveyor_division=d.division_id
                                        INNER JOIN districts as di ON c.surveyor_district=di.district_id
                                        INNER JOIN upzilas as u ON c.surveyor_upzila=u.upzila_id
                                        ORDER BY c.surveyor_id`; 
                const surveyors = await queryAsyncWithoutValue(get_surveyors_query);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(surveyors)
                    return res.render('pages/surveyorList',{title:"Surveyor List",surveyors,nav:"surveyors"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// get surveyor transaction 
exports.getSurveyorTransactionList=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_surveyors_transaction_query = `SELECT s.*,
                                        d.*,
                                        di.*,
                                        u.*,
                                        st.*
                                        FROM surveyors as s
                                        INNER JOIN divisions as d ON s.surveyor_division=d.division_id
                                        INNER JOIN districts as di ON s.surveyor_district=di.district_id
                                        INNER JOIN upzilas as u ON s.surveyor_upzila=u.upzila_id
                                        INNER JOIN surveyor_transaction as st ON s.surveyor_id=st.surveyor_id
                                        `; 
                const transactions = await queryAsyncWithoutValue(get_surveyors_transaction_query);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(transactions)
                    return res.render('pages/surveyorTransactionList',{title:"S. Transaction List",transactions,nav:"surveyor_transaction"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// get eidt surveyor 

exports.getEditSurveyor=async(req,res,next)=>{
    try{
        let surveyor_id=req.params.surveyor_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_surveyor_query = `SELECT c.*,
                                        d.*,
                                        di.*,
                                        u.*
                                        FROM surveyors as c
                                        INNER JOIN divisions as d ON c.surveyor_division=d.division_id
                                        INNER JOIN districts as di ON c.surveyor_district=di.district_id
                                        INNER JOIN upzilas as u ON c.surveyor_upzila=u.upzila_id
                                        WHERE surveyor_id=?
                                        `; 
                const surveyor = await queryAsync(get_surveyor_query,[surveyor_id]);
                // 
                const get_all_location_query = `SELECT
                                                d.*,
                                                di.district_id,
                                                di.district_name,
                                                di.district_createdAt,
                                                di.district_updatedAt,
                                                u.upzila_id,
                                                u.upzila_name,
                                                u.upzila_createdAt,
                                                u.upzila_updatedAt
                                            FROM
                                                divisions AS d
                                            LEFT JOIN
                                                districts AS di ON d.division_id = di.division_id
                                            LEFT JOIN
                                                upzilas AS u ON di.district_id = u.district_id`;
                const all_location = await queryAsyncWithoutValue(get_all_location_query);
                const nestedData = {
                    divisions: [] // Initialize divisions as an empty list
                };
                
                all_location.forEach(location => {
                    const divisionId = location.division_id;
                    const districtId = location.district_id;
                    const upzilaId = location.upzila_id;
                
                    // Check if the division exists in the nested structure
                    let division = nestedData.divisions.find(division => division.division_id === divisionId);
                
                    if (!division) {
                    division = {
                        division_id: divisionId,
                        division_name: location.division_name,
                        division_createdAt: location.division_createdAt,
                        division_updatedAt: location.division_updatedAt,
                        districts: [] // Initialize districts as an empty list
                    };
                    nestedData.divisions.push(division);
                    }
                
                    // Check if the district exists in the division
                    let district = division.districts.find(district => district.district_id === districtId);
                
                    if (!district && districtId!=null) {
                    district = {
                        district_id: districtId,
                        district_name: location.district_name,
                        district_createdAt: location.district_createdAt,
                        district_updatedAt: location.district_updatedAt,
                        upzilas: [] // Initialize upzilas as an empty list
                    };
                    division.districts.push(district);
                    }
                
                    // Check if the upzila exists in the district
                    if (upzilaId !== null) {
                    district.upzilas.push({
                        upzila_id: upzilaId,
                        upzila_name: location.upzila_name,
                        upzila_createdAt: location.upzila_createdAt,
                        upzila_updatedAt: location.upzila_updatedAt
                    });
                    }
                });
      
      // Add this section to make district list empty for divisions without districts
                nestedData.divisions.forEach(division => {
                    if (division.districts.length === 0) {
                        division.districts = [];
                    }
                });
                // 
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(surveyor[0])
                    return res.render('pages/editSurveyor',{title:"Edit Surveyor",surveyor:surveyor[0],locations:nestedData.divisions,nav:"surveyors"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// post eidt surveyor
exports.postEditSurveyor=async(req,res,next)=>{
    try{
        let surveyor_id=req.params.surveyor_id
        let{surveyor_name,surveyor_mobile_number,surveyor_address,surveyor_division,surveyor_district,surveyor_upzila}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_surveyor_query = 'SELECT * FROM surveyors WHERE surveyor_id = ?';
                const existing_surveyor = await queryAsync(get_surveyor_query, [surveyor_id]);

                if (existing_surveyor.length === 0) {
                    return res.redirect('/surveyor-list')
                }

                let image=existing_surveyor[0].surveyor_image
                // console.log(image)
                // console.log(req.file.filename)
                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const update_surveyor_query = 'UPDATE surveyors SET surveyor_name = ?,surveyor_image=?, surveyor_mobile_number = ?,surveyor_division = ?, surveyor_district = ?,surveyor_upzila=?, surveyor_address=? WHERE surveyor_id = ?';
                const updateValues = [surveyor_name,image, surveyor_mobile_number,surveyor_division,surveyor_district,surveyor_upzila,surveyor_address, surveyor_id];
                await queryAsync(update_surveyor_query, updateValues);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json()
                    return res.redirect('/surveyor-edit/'+surveyor_id)
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}

// surveyor view details
exports.getSurveyorDetails=async(req,res,next)=>{
    try{
        let surveyor_id=req.params.surveyor_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_surveyor_query = `SELECT s.*, 
                                            d.*, 
                                            di.*, 
                                            u.*, 
                                            GROUP_CONCAT(CONCAT(os.service_name) SEPARATOR ',') AS surveyor_experiences
                                    FROM surveyors AS s
                                    INNER JOIN divisions AS d ON s.surveyor_division = d.division_id
                                    INNER JOIN districts AS di ON s.surveyor_district = di.district_id
                                    INNER JOIN upzilas AS u ON s.surveyor_upzila = u.upzila_id
                                    INNER JOIN surveyor_experiences AS se ON s.surveyor_id = se.surveyor_id
                                    INNER JOIN our_services AS os ON se.service_id = os.service_id
                                    WHERE s.surveyor_id = ?
                                    GROUP BY s.surveyor_id;         
                                        `; 
                const surveyor_info = await queryAsync(get_surveyor_query,[surveyor_id]);
                // 

                const get_surveyor_appointment_query = `SELECT a.*,
                                        a_s.*,
                                        s.*,
                                        c.*,
                                        os.*
                                        FROM appointment as a
                                        INNER JOIN customers as c ON a.customer_id=c.customer_id
                                        INNER JOIN surveyors as s ON s.surveyor_id=a.surveyor_id
                                        INNER JOIN appointment_status as a_s ON a_s.appointment_status_id=a.appointment_status
                                        INNER JOIN our_services as os ON os.service_id=a.service_id
                                        
                                        WHERE a.surveyor_id=?
                                        `; 
                const surveyor_appointment_info = await queryAsync(get_surveyor_appointment_query,[surveyor_id]);

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star  Success')
                    //return res.json(surveyor_info)
                    //return res.json(surveyor_appointment_info)
                    return res.render('pages/surveyorDetails',{title:"Surveyor Details",surveyor:surveyor_info[0],surveyor_appointment_info,nav:"surveyors"})
                })
            }catch(e){
                db.rollback();
                console.log(e)
                //req.flash('fail', 'Star Insert Fail')
                return res.redirect('/')
            }
        })
    }catch(e){
        console.log(e)
        //req.flash('fail', 'star Insert Fail')
        return res.redirect('/')
    }
}