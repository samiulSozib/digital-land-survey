const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

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
                                        INNER JOIN upzilas as u ON c.customer_upzila=u.upzila_id`; 
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