const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// get appointment status 
exports.getAppointmentStatus = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', appointment_status: [] });
            }

            try {
                const get_appointment_status_query = 'SELECT * FROM appointment_status';
                const appointment_status = await queryAsyncWithoutValue(get_appointment_status_query);
                if (appointment_status.length === 0) {
                    return res.status(200).json({ status: true, message: 'Appointment Status not found', appointment_status: [] });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find Appointment Status', appointment_status: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', appointment_status: appointment_status });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', appointment_status: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', appointment_status: [] });
    }
};

// create appointment 
exports.createAppointment=async(req,res,next)=>{
    try{
        let {surveyor_id,service_id,customer_id,appointment_date,name,mobile_number,district,upzila,mouja,JL_number,land_amount,RS_dag,BS_dag}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',appointment:{}})
            }
            try{
                
                const insert_appointment_query='INSERT INTO appointment (surveyor_id,service_id,customer_id,appointment_date,name,mobile_number,district,upzila,mouja,JL_number,land_amount,RS_dag,BS_dag,appointment_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                const values=[surveyor_id,service_id,customer_id,appointment_date,name,mobile_number,district,upzila,mouja,JL_number,land_amount,RS_dag,BS_dag,1]
                const created_appointment=await queryAsync(insert_appointment_query,values)
                const appointment_id=created_appointment.insertId
                const get_created_appointment='SELECT * FROM appointment WHERE appointment_id=?'
                const appointment_data=await queryAsync(get_created_appointment,[appointment_id])
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert appointment',appointment:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',appointment:appointment_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', appointment: {} });
            }

        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',appointment:{}})
    }
}

// make payment for appointment
exports.createTransaction=async(req,res,next)=>{
    try{
        let {appointment_id,account_number,account_type,amount,transaction_id,address}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',transaction:{}})
            }
            try{
                
                const insert_transaction_query='INSERT INTO transaction (appointment_id,account_number,account_type,amount,transaction_id,address,is_verified) VALUES (?,?,?,?,?,?,?)'
                const values=[appointment_id,account_number,account_type,amount,transaction_id,address,0]
                const created_transaction=await queryAsync(insert_transaction_query,values)
                const id=created_transaction.insertId
                const get_created_transaction='SELECT * FROM transaction WHERE id=?'
                const transaction_data=await queryAsync(get_created_transaction,[id])

                // update appointment status

                // const get_appointment_query=`SELECT * FROM appointment WHERE appointment_id=?`
                // const appointment=await queryAsync(get_appointment_query,[appointment_id])

                const update_appointment_query=`UPDATE appointment SET appointment_status= ? WHERE appointment_id=?`
                const appointment_values=[2,appointment_id]
                const update_appointment=await queryAsync(update_appointment_query,appointment_values)
                
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

// change appointment status by verifing the transaction 
exports.verifyTransaction=async(req,res,next)=>{
    try{
        let id=req.query.transaction_id
        let {is_verified}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.status(503).json({status:false,message:'Internal Server Error',transaction:{}})
            }
            try{
                
                

                // update transaction
                const update_transaction_query=`UPDATE transaction SET is_verified=? WHERE id=?`
                const values=[is_verified,id]
                await queryAsync(update_transaction_query,values)
                const get_transaction_query=`SELECT * FROM transaction WHERE id =?`
                const transaction_data=await queryAsync(get_transaction_query,[id])
                console.log(transaction_data[0])
                const appointment_id=transaction_data[0].appointment_id
               // update appointment

                const update_appointment_query=`UPDATE appointment SET appointment_status= ? WHERE appointment_id=?`
                
                const appointment_values=[is_verified==1?3:2,appointment_id]
                const update_appointment=await queryAsync(update_appointment_query,appointment_values)
                
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

