const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// get Customer list
exports.getContactUs=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_contact_us_query = `SELECT * FROM contact_us`; 
                const contact_us = await queryAsyncWithoutValue(get_contact_us_query);
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(contact_us)
                    return res.render('pages/contactUs',{title:"Contact Us",contact_us,nav:"contact_us"})
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