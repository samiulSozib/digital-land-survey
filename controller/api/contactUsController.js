const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// insert contact us 
exports.insertContactUs=async(req,res,next)=>{
    try{
        let {name,mobile_number,message}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', contact:{}})
            }
            try{
                
                const insert_contact_us_query=`INSERT INTO contact_us(name,mobile_number,message) VALUES (?,?,?)`
                const values=[name,mobile_number,message]
                const contact_us=await queryAsync(insert_contact_us_query,values)
                const get_contact_us_query=`SELECT * FROM contact_us WHERE contact_us_id =?`
                const contact_us_data=await queryAsync(get_contact_us_query,[contact_us.insertId])
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert contact us data',contact:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',contact:contact_us_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', contact: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',contact:{}})
    }
}