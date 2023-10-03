const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')

// get Social Media 
exports.getAboutUs=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_about_us_query=`SELECT * FROM about_us`;
                const about_us=await queryAsyncWithoutValue(get_about_us_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(about_us_links)
                    return res.render('pages/aboutUs',{title:"About Us",about_us:about_us,nav:"about_us"})
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

// get edit social Media
exports.getEditAboutUs=async(req,res,next)=>{
    try{
        let about_us_id=req.params.about_us_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_about_us_query = `SELECT * FROM about_us WHERE id=?`; 
                const about_us=await queryAsync(get_about_us_query,[about_us_id])
                

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(about_uss[0])
                    return res.render('pages/editAboutUs',{title:"Edit About Us",about_us:about_us[0],nav:"about_us"})
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

// post edit socail_media
exports.postEditAboutUs=async(req,res,next)=>{
    try{
        let about_us_id=req.params.about_us_id
        let {title,description}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{

                let get_about_us_query=`SELECT * FROM about_us WHERE id=?`
                let about_us=await queryAsync(get_about_us_query,[about_us_id])

                

                const update_about_us_query=`UPDATE about_us SET title=?, description=? WHERE id=?`
                const values=[title,description,about_us_id]
                await queryAsync(update_about_us_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/about-us')
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