const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


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
                                        INNER JOIN upzilas as u ON c.surveyor_upzila=u.upzila_id`; 
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