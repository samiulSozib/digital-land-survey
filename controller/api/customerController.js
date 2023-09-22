const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const bcrypt=require('bcrypt')
const base_url = require('../../const/const')

// customer registration
exports.customerRegistration=async(req,res,next)=>{
    try{
        let {name,mobile_number,division,district,upzila,address,password,confirm_password}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', customer:{}})
            }
            try{
                const get_customer_query='SELECT * FROM customers WHERE customer_mobile_number = ? '
                const is_customer_present=await queryAsync(get_customer_query,[mobile_number])
                if(is_customer_present.length>0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'The mobile number is used, please try another number.',celebrity:{}})
                }
                if(password!==confirm_password){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Wrong password. The password you entered does not match.',celebrity:{}})
                }
                password=await bcrypt.hash(password,10)
                let customer_image=null
                if(req.file){
                    customer_image=`${base_url}/uploads/${req.file.filename}`
                }
                const insert_customer_query=`INSERT INTO customers(customer_name,customer_image,customer_mobile_number,customer_division,customer_district,customer_upzila,customer_address,customer_password) VALUES (?,?,?,?,?,?,?,?)`
                const values=[name,customer_image,mobile_number,division,district,upzila,address,password]
                const customer=await queryAsync(insert_customer_query,values)

                const customer_id=customer.insertId
                const get_inserted_customer_query=`SELECT c.*,
                                                    d.*,
                                                    di.*,
                                                    u.*
                                                    FROM customers as c
                                                    INNER JOIN divisions as d ON c.customer_division=d.division_id
                                                    INNER JOIN districts as di ON c.customer_district=di.district_id
                                                    INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id WHERE c.customer_id = ?`
                const customer_data=await queryAsync(get_inserted_customer_query,[customer_id])
                const nestedJsonData={
                    data:{
                        customer_id:customer_data[0].customer_id,
                        customer_name:customer_data[0].customer_name,
                        customer_image:customer_data[0].customer_image,
                        customer_mobile_number:customer_data[0].customer_mobile_number,
                        customer_password:customer_data[0].customer_password,
                        customer_address:customer_data[0].customer_address,
                        customer_createdAt:customer_data[0].customer_createdAt,
                        customer_updatedAt:customer_data[0].customer_updatedAt,
                        division:{
                            division_id:customer_data[0].division_id,
                            division_name:customer_data[0].division_name,
                            division_createdAt:customer_data[0].division_createdAt,
                            division_updatedAt:customer_data[0].division_updatedAt,
                            district:{
                                district_id:customer_data[0].district_id,
                                district_name:customer_data[0].district_name,
                                district_createdAt:customer_data[0].district_createdAt,
                                district_updatedAt:customer_data[0].district_updatedAt,
                                upzila:{
                                    upzila_id:customer_data[0].upzila_id,
                                    upzila_name:customer_data[0].upzila_name,
                                    upzila_createdAt:customer_data[0].upzila_createdAt,
                                    upzila_updatedAt:customer_data[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }

                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert customer data',customer:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',customer:nestedJsonData.data})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',customer:{}})
    }
}

// customer login 
exports.customerLogin=async(req,res,next)=>{
    try{
        let {mobile_number,password}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',customer:{}})
            }
            try{
                const find_customer_by_mobile_number=`SELECT c.*,
                                                    d.*,
                                                    di.*,
                                                    u.*
                                                    FROM customers as c
                                                    INNER JOIN divisions as d ON c.customer_division=d.division_id
                                                    INNER JOIN districts as di ON c.customer_district=di.district_id
                                                    INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id WHERE c.customer_mobile_number = ?`;
                const customer=await queryAsync(find_customer_by_mobile_number,[mobile_number])
                
                if(customer.length===0){
                    db.rollback()
                    return res.status(200).json({ status: true, message: 'Customer Not Found', customer: {} });
                }

                const password_match=await bcrypt.compare(password,customer[0].customer_password)
                if(!password_match){
                    db.rollback()
                    return res.status(200).json({ status: false, message: 'Wrong password. The password you entered does not match.', customer: {} });
                }

                const nestedJsonData={
                    data:{
                        customer_id:customer[0].customer_id,
                        customer_name:customer[0].customer_name,
                        customer_image:customer[0].customer_image,
                        customer_mobile_number:customer[0].customer_mobile_number,
                        customer_password:customer[0].customer_password,
                        customer_address:customer[0].customer_address,
                        customer_createdAt:customer[0].customer_createdAt,
                        customer_updatedAt:customer[0].customer_updatedAt,
                        division:{
                            division_id:customer[0].division_id,
                            division_name:customer[0].division_name,
                            division_createdAt:customer[0].division_createdAt,
                            division_updatedAt:customer[0].division_updatedAt,
                            district:{
                                district_id:customer[0].district_id,
                                district_name:customer[0].district_name,
                                district_createdAt:customer[0].district_createdAt,
                                district_updatedAt:customer[0].district_updatedAt,
                                upzila:{
                                    upzila_id:customer[0].upzila_id,
                                    upzila_name:customer[0].upzila_name,
                                    upzila_createdAt:customer[0].upzila_createdAt,
                                    upzila_updatedAt:customer[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Customer login failed',customer:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',customer:nestedJsonData.data})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',customer:{}})
    }
}

// get customer profile
exports.getCustomerProfile=async(req,res,next)=>{
    try {
        const id = req.query.customer_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }

            try {
                const get_customer_query = `SELECT c.*,
                                        d.*,
                                        di.*,
                                        u.*
                                        FROM customers as c
                                        INNER JOIN divisions as d ON c.customer_division=d.division_id
                                        INNER JOIN districts as di ON c.customer_district=di.district_id
                                        INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id WHERE c.customer_id = ?`; 
                const customer = await queryAsync(get_customer_query, [id]);

                if (customer.length === 0) {
                    return res.status(200).json({ status: false, message: 'No customer found', customer: {} });
                }

                const nestedJsonData={
                    data:{
                        customer_id:customer[0].customer_id,
                        customer_name:customer[0].customer_name,
                        customer_image:customer[0].customer_image,
                        customer_mobile_number:customer[0].customer_mobile_number,
                        customer_password:customer[0].customer_password,
                        customer_address:customer[0].customer_address,
                        customer_createdAt:customer[0].customer_createdAt,
                        customer_updatedAt:customer[0].customer_updatedAt,
                        division:{
                            division_id:customer[0].division_id,
                            division_name:customer[0].division_name,
                            division_createdAt:customer[0].division_createdAt,
                            division_updatedAt:customer[0].division_updatedAt,
                            district:{
                                district_id:customer[0].district_id,
                                district_name:customer[0].district_name,
                                district_createdAt:customer[0].district_createdAt,
                                district_updatedAt:customer[0].district_updatedAt,
                                upzila:{
                                    upzila_id:customer[0].upzila_id,
                                    upzila_name:customer[0].upzila_name,
                                    upzila_createdAt:customer[0].upzila_createdAt,
                                    upzila_updatedAt:customer[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find customer', customer: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', customer: nestedJsonData.data });
                });
            } catch (e) {
                console.log(e);
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
    }
}

// update customer profile
exports.updateCustomerProfile = async (req, res, next) => {
    try {
        const id = req.query.customer_id;
        let {name,mobile_number,division,district,upzila,address}=req.body

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }

            try {
                const get_customer_query = 'SELECT * FROM customers WHERE customer_id = ?';
                const existing_customer = await queryAsync(get_customer_query, [id]);

                if (existing_customer.length === 0) {
                    return res.status(200).json({ status: false, message: 'No customer found', customer: {} });
                }

                let image=existing_customer[0].image
                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const update_customer_query = 'UPDATE customers SET customer_name = ?,customer_image=?, customer_mobile_number = ?,customer_division = ?, customer_district = ?,customer_upzila=?, customer_address=? WHERE customer_id = ?';
                const updateValues = [name,image, mobile_number,division,district,upzila,address, id];
                await queryAsync(update_customer_query, updateValues);

                const get_updated_customer_query = `SELECT c.*,
                d.*,
                di.*,
                u.*
                FROM customers as c
                INNER JOIN divisions as d ON c.customer_division=d.division_id
                INNER JOIN districts as di ON c.customer_district=di.district_id
                INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id WHERE c.customer_id = ?`;
                const customer = await queryAsync(get_updated_customer_query, [id]);
                const nestedJsonData={
                    data:{
                        customer_id:customer[0].customer_id,
                        customer_name:customer[0].customer_name,
                        customer_image:customer[0].customer_image,
                        customer_mobile_number:customer[0].customer_mobile_number,
                        customer_password:customer[0].customer_password,
                        customer_address:customer[0].customer_address,
                        customer_createdAt:customer[0].customer_createdAt,
                        customer_updatedAt:customer[0].customer_updatedAt,
                        division:{
                            division_id:customer[0].division_id,
                            division_name:customer[0].division_name,
                            division_createdAt:customer[0].division_createdAt,
                            division_updatedAt:customer[0].division_updatedAt,
                            district:{
                                district_id:customer[0].district_id,
                                district_name:customer[0].district_name,
                                district_createdAt:customer[0].district_createdAt,
                                district_updatedAt:customer[0].district_updatedAt,
                                upzila:{
                                    upzila_id:customer[0].upzila_id,
                                    upzila_name:customer[0].upzila_name,
                                    upzila_createdAt:customer[0].upzila_createdAt,
                                    upzila_updatedAt:customer[0].upzila_updatedAt
                                }
                            },
                        },
                    }
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to update customer profile', customer: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', customer: nestedJsonData.data });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
    }
};
