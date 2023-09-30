const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// get dashboard list
exports.getDashboard=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_custoemr_qeury='SELECT * FROM customers'
                const customers=await queryAsyncWithoutValue(get_custoemr_qeury)
                const get_surveyor_qery='SELECT * FROM surveyors'
                const surveyors=await queryAsyncWithoutValue(get_surveyor_qery)
                const get_service_query='SELECT * FROM our_services'
                const services=await queryAsync(get_service_query)
                const get_appointments_query = `SELECT a.*,
                                        su.*,
                                        c.*,
                                        s.*,
                                        st.*
                                        FROM appointment as a
                                        INNER JOIN surveyors as su ON a.surveyor_id=su.surveyor_id
                                        INNER JOIN customers as c ON a.customer_id=c.customer_id
                                        INNER JOIN our_services as s ON a.service_id=s.service_id
                                        INNER JOIN appointment_status as st ON a.appointment_status=st.appointment_status_id
                                        `; 
                const appointments = await queryAsyncWithoutValue(get_appointments_query);


                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    return res.render('pages/dashboard',{title:"Dashboard",nav:"dashboard",customers,surveyors,services,appointments})
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