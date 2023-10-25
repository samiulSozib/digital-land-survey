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
                    return res.status(200).json({status:false,message:'The mobile number is used, please try another number.',customer:{}})
                }
                if(password!==confirm_password){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Wrong password. The password you entered does not match.',customer:{}})
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
                        location:{
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

                let image=existing_customer[0].customer_image
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


// delete customer
exports.deleteCustomer = async (req, res, next) => {
    try {
        const id = req.query.customer_id;

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

                

                const delete_customer_query = `DELETE FROM customers WHERE customer_id = ?`;
                
                await queryAsync(delete_customer_query, [id]);

                
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete customer', customer: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', customer: existing_customer[0] });
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

// change password
exports.changeCustomerPassword = async (req, res, next) => {
    try {
        const customer_id = req.query.customer_id;
        const { newPassword } = req.body;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', customer: {} });
            }

            try {
                const get_customer_query = `SELECT * FROM customers WHERE customer_id=?`;
                const existing_customer = await queryAsync(get_customer_query, [customer_id]);

                if (existing_customer.length === 0) {
                    return res.status(200).json({ status: true, message: 'No customer found', customer: {} });
                }

                const hashedNewPassword = await bcrypt.hash(newPassword,10)
                const update_customer_query = 'UPDATE customers SET customer_password = ? WHERE customer_id = ?';
                const updateValues = [hashedNewPassword, customer_id];
                await queryAsync(update_customer_query, updateValues);

                const find_customer_by_id=`SELECT c.*,
                                                    d.*,
                                                    di.*,
                                                    u.*
                                                    FROM customers as c
                                                    INNER JOIN divisions as d ON c.customer_division=d.division_id
                                                    INNER JOIN districts as di ON c.customer_district=di.district_id
                                                    INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id WHERE c.customer_id = ?`;
                const customer=await queryAsync(find_customer_by_id,[customer_id])

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to change customer password', customer: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: "", customer: customer[0] });
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

// verify code for forgot customer_password
exports.verifyCustomerCode=async(req,res,next)=>{
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
        return res.status(503).json({ status: 'false', message: 'Internal Server Error', customer: {} }); 
    }
}


// reset customer_password
exports.resetCustomerPassword=async(req,res,next)=>{
    try{
        let {customer_mobile_number,customer_password,confirm_customer_password}=req.body
        db.beginTransaction(async(err)=>{
            if (err) {
                return res.status(503).json({ status: 'false', message: 'Internal Server Error', customer: {} });
            }

            try{
                const get_customer_query=`SELECT * FROM customers 
                                WHERE customer_mobile_number = ?`
                const customer=await queryAsync(get_customer_query,[customer_mobile_number])
                if(customer.length===0){
                    return res.status(200).json({ status: 'false', message: 'No customer found with phone number', customer: {} });
                }

                if(customer_password!=confirm_customer_password){
                    return res.status(200).json({ status: 'false', message: 'Wrong customer_password. The customer_password you entered does not match.', customer: {} });
                }

                customer_password=await bcrypt.hash(customer_password,10)
                const update_customer_query = 'UPDATE customers SET customer_password = ? WHERE customer_mobile_number = ?';
                const updateValues = [customer_password, customer_mobile_number];
                await queryAsync(update_customer_query, updateValues);
                const updated_customer=await queryAsync(get_customer_query,[customer_mobile_number])
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: 'false', message: 'Failed to reset customer customer_password', customer: {} });
                        });
                    }

                    return res.status(200).json({ status: 'true', message: '', customer: updated_customer[0] });
                });

            }catch(e){
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: 'false', message: 'Internal Server Error', customer: {} });
            }
        })
    }catch(e){
        console.log(e);
        return res.status(503).json({ status: 'false', message: 'Internal Server Error', customer: {} }); 
    }
}