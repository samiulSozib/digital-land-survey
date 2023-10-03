const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url = require('../../const/const')

// get Social Media 
exports.getSocialMedia=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_Social_Media_query=`SELECT * FROM social_media_link`;
                const social_media_links=await queryAsyncWithoutValue(get_Social_Media_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(social_media_links)
                    return res.render('pages/socialMedia',{title:"Social Media",social_media_links,nav:"socail_media"})
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
exports.getEditSocialMedia=async(req,res,next)=>{
    try{
        let social_media_id=req.params.social_media_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_social_media_query = `SELECT * FROM social_media_link WHERE id=?`; 
                const social_medias=await queryAsync(get_social_media_query,[social_media_id])
                

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(social_medias[0])
                    return res.render('pages/editSocialMedia',{title:"Edit Social Media",social_media:social_medias[0],nav:"socail_media"})
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
exports.postEditSocialMedia=async(req,res,next)=>{
    try{
        let social_media_id=req.params.social_media_id
        let {name,link}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{

                let get_social_media_query=`SELECT * FROM social_media_link WHERE id=?`
                let social_media=await queryAsync(get_social_media_query,[social_media_id])

                let image=social_media[0].image

                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const update_social_media_query=`UPDATE social_media_link SET name=?, link=?, image=? WHERE id=?`
                const values=[name,link,image,social_media_id]
                await queryAsync(update_social_media_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/social-media')
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