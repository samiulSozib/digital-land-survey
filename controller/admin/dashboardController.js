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
                
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    return res.render('pages/dashboard',{title:"Dashboard",nav:"dashboard"})
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