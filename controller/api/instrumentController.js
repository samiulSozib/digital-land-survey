const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// get all instuments
exports.getAllInstruments = async (req, res, next) => {
    try {
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', instruments: [] });
            }

            try {
                const get_all_instruments_query = 'SELECT * FROM instruments';
                const all_instruments = await queryAsyncWithoutValue(get_all_instruments_query);
                if (all_instruments.length === 0) {
                    return res.status(200).json({ status: true, message: 'No instruments found', instruments: [] });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find instruments', instruments: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', instruments: all_instruments });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instruments: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', instruments: [] });
    }
};

// get instument by id
exports.getInstrumentById = async (req, res, next) => {
    try {
        const instrument_id=req.query.instrument_id
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }

            try {
                const get_instrument_query = 'SELECT * FROM instruments WHERE instrument_id=?';
                const instrument = await queryAsync(get_instrument_query,[instrument_id]);
                if (instrument.length === 0) {
                    return res.status(200).json({ status: true, message: 'No instrument found', instrument: {} });
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find instrument', instrument: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', instrument: instrument[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
    }
};

// delete instrument
exports.deleteInstrument = async (req, res, next) => {
    try {
        const instrument_id = req.query.instrument_id;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }

            try {
                const get_instrument_query = 'SELECT * FROM instruments WHERE instrument_id = ?';
                const existing_instrument = await queryAsync(get_instrument_query, [instrument_id]);

                if (existing_instrument.length === 0) {
                    return res.status(200).json({ status: false, message: 'No instrument found', instrument: {} });
                }

                

                const delete_instrument_query = `DELETE FROM instruments WHERE instrument_id = ?`;
                
                await queryAsync(delete_instrument_query, [instrument_id]);

                
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete instrument', instrument: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', instrument: existing_instrument[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', instrument: {} });
    }
};


// post instrument order and make transaction 
exports.postInstrumentOrder=async(req,res,next)=>{
    try{
        let {surveyor_id,customer_id,instrument_id,quantity,total_price,order_name,order_mobile_number,order_address,account_number,
            account_type,
            amount,
            transaction_id,
            address
            }=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', instrument_order:{}})
            }
            try{
                if(!surveyor_id){
                    surveyor_id=null
                }else{
                    customer_id=null
                }
                const insert_instrument_order_query=`INSERT INTO instrument_order(surveyor_id,customer_id,instrument_id,quantity,total_price,order_name,order_mobile_number,order_address,order_status) VALUES (?,?,?,?,?,?,?,?,?)`
                const values=[surveyor_id,customer_id,instrument_id,quantity,total_price,order_name,order_mobile_number,order_address,0]
                const instrument_order=await queryAsync(insert_instrument_order_query,values)
                const order_id=instrument_order.insertId

                // insert order transaction
                const insert_order_transaction_query=`INSERT INTO order_transaction(instrument_order_id,account_number,account_type,amount,transaction_id,address,is_verified) VALUES (?,?,?,?,?,?,?)`
                const t_values=[order_id,account_number,account_type,amount,transaction_id,address,0]
                const transaction=await queryAsync(insert_order_transaction_query,t_values)

                const get_instrument_order_query=`SELECT * FROM instrument_order WHERE order_id =?`
                const instrument_order_data=await queryAsync(get_instrument_order_query,[order_id])
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert InstrumentOrder us data',instrument_order:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',instrument_order:instrument_order_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument_order: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',instrument_order:{}})
    }
}

// change instruments_orders transaction verification
exports.instruments_ordersTransactionVerificationChange=async(req,res,next)=>{
    try{
        let transaction_id=req.query.instruments_orders_transaction_id
        
        let {is_verified}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', transaction:{}})
            }
            try{
                const get_transaction_query='SELECT * FROM order_transaction WHERE order_transaction_id = ? '
                const is_transaction_present=await queryAsync(get_transaction_query,[transaction_id])
                if(is_transaction_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Transaction not found.',transaction:{}})
                }
                
                const update_transaction_query=`UPDATE order_transaction SET is_verified=? WHERE order_transaction_id=?`
                const values=[is_verified,transaction_id]
                await queryAsync(update_transaction_query,values)
                
                const get_update_transaction_query=`SELECT * FROM order_transaction WHERE order_transaction_id=?`
                const transaction_data=await queryAsync(get_update_transaction_query,[transaction_id])

             
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to update instruments_orders transaction data',transaction:{}})
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


// change order status
exports.changeOrderStatus=async(req,res,next)=>{
    try{
        let order_id=req.query.order_id
        
        let {is_confirmed}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', instrument_order:{}})
            }
            try{
                const get_instrument_order_query='SELECT * FROM instrument_order WHERE order_id = ? '
                const is_instrument_order_present=await queryAsync(get_instrument_order_query,[order_id])
                if(is_instrument_order_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Order not found.',instrument_order:{}})
                }
                
                const update_instrument_order_query=`UPDATE instrument_order SET order_status=? WHERE order_id=?`
                const values=[is_confirmed,order_id]
                await queryAsync(update_instrument_order_query,values)
                
                const get_update_instrument_order_query=`SELECT * FROM instrument_order WHERE order_id=?`
                const instrument_order_data=await queryAsync(get_update_instrument_order_query,[order_id])

             
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to update instruments_orders transaction data',instrument_order:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',instrument_order:instrument_order_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', instrument_order: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',instrument_order:{}})
    }
}