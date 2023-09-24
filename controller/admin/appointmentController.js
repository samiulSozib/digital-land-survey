const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// get Customer list
exports.getAppointmentList=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(err)
                return res.redirect('/')
            }
            try{
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
                    //return res.json(appointments)
                    return res.render('pages/appointmentList',{title:"Appointment List",appointments,nav:"appointments"})
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

// get appointment transaction list 
exports.getAppointmentTransactionList=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(err)
                return res.redirect('/')
            }
            try{
                const get_appointments_query = `SELECT t.*,
                                        a.*,
                                        aps.*
                                        FROM transaction as t
                                        INNER JOIN appointment as a ON a.appointment_id=t.appointment_id
                                        INNER JOIN appointment_status as aps ON aps.appointment_status_id=a.appointment_status
                                        `; 
                const transactions = await queryAsyncWithoutValue(get_appointments_query);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(transactions)
                    return res.render('pages/appointmentTransactionList',{title:"Appointment Transaction List",transactions,nav:"appointment_transaction"})
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