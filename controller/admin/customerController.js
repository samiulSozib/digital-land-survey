const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url = require('../../const/const')

// get Customer list
exports.getCustomerList=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_customers_query = `SELECT c.*,
                                        d.*,
                                        di.*,
                                        u.*
                                        FROM customers as c
                                        INNER JOIN divisions as d ON c.customer_division=d.division_id
                                        INNER JOIN districts as di ON c.customer_district=di.district_id
                                        INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id
                                        ORDER BY c.customer_id`; 
                const customers = await queryAsyncWithoutValue(get_customers_query);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customers)
                    return res.render('pages/customerList',{title:"Customer List",customers,nav:"customers"})
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

// edit Customer page 
exports.getEditCustomer=async(req,res,next)=>{
    try{
        let customer_id=req.params.customer_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_customer_query = `SELECT c.*,
                                        d.*,
                                        di.*,
                                        u.*
                                        FROM customers as c
                                        INNER JOIN divisions as d ON c.customer_division=d.division_id
                                        INNER JOIN districts as di ON c.customer_district=di.district_id
                                        INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id
                                        WHERE customer_id=?
                                        `; 
                const customer = await queryAsync(get_customer_query,[customer_id]);
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
                    //return res.json(customer[0])
                    return res.render('pages/editCustomer',{title:"Edit Customer",customer:customer[0],locations:nestedData.divisions,nav:"customers"})
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

// edit Customer page submit
exports.postEditCustomer=async(req,res,next)=>{
    try{
        let customer_id=req.params.customer_id
        let{customer_name,customer_mobile_number,customer_address,customer_division,customer_district,customer_upzila}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_customer_query = 'SELECT * FROM customers WHERE customer_id = ?';
                const existing_customer = await queryAsync(get_customer_query, [customer_id]);

                if (existing_customer.length === 0) {
                    return res.redirect('/customer-list')
                }

                let image=existing_customer[0].customer_image
                // console.log(image)
                // console.log(req.file.filename)
                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const update_customer_query = 'UPDATE customers SET customer_name = ?,customer_image=?, customer_mobile_number = ?,customer_division = ?, customer_district = ?,customer_upzila=?, customer_address=? WHERE customer_id = ?';
                const updateValues = [customer_name,image, customer_mobile_number,customer_division,customer_district,customer_upzila,customer_address, customer_id];
                await queryAsync(update_customer_query, updateValues);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json()
                    return res.redirect('/customer-edit/'+customer_id)
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

// customer view details
exports.getCustomerDetails=async(req,res,next)=>{
    try{
        let customer_id=req.params.customer_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_customer_query = `SELECT c.*,
                                        d.*,
                                        di.*,
                                        u.*
                                        FROM customers as c
                                        INNER JOIN divisions as d ON c.customer_division=d.division_id
                                        INNER JOIN districts as di ON c.customer_district=di.district_id
                                        INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id
                                        WHERE c.customer_id=?
                                        `; 
                const customer_info = await queryAsync(get_customer_query,[customer_id]);
                // 

                const get_customer_appointment_query = `SELECT a.*,
                                        a_s.*,
                                        s.*,
                                        os.*
                                        FROM appointment as a
                                        INNER JOIN surveyors as s ON s.surveyor_id=a.surveyor_id
                                        INNER JOIN appointment_status as a_s ON a_s.appointment_status_id=a.appointment_status
                                        INNER JOIN our_services as os ON os.service_id=a.service_id
                                        
                                        WHERE a.customer_id=?
                                        `; 
                const customer_appointment_info = await queryAsync(get_customer_appointment_query,[customer_id]);

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer_appointment_info)
                    return res.render('pages/customerDetails',{title:"Customer Details",customer:customer_info[0],customer_appointment_info,nav:"customers"})
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
