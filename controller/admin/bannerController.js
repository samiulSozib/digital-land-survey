const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url = require('../../const/const')

// get banners list
exports.getBanner=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_banners_query=`SELECT * FROM banner`;
                const banners=await queryAsyncWithoutValue(get_banners_query)
                //console.log(banners)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    return res.render('pages/banner',{title:"banners",banner:banners[0],nav:"banner"})
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

// get edit banners
exports.getEditBanner=async(req,res,next)=>{
    try{
        let banner_id=req.params.banner_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_banner_query = `SELECT * FROM banner WHERE banner_id=?`; 
                const banners=await queryAsync(get_banner_query,[banner_id])
                

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.render('pages/editBanner',{title:"Edit banner",banner:banners[0],nav:"banner"})
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

// post edit banner
exports.postEditBanner = async (req, res, next) => {
    try {
        const banner_id = req.params.banner_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.redirect('/');
            }
            try {
                const get_banner_query=`SELECT * FROM banner WHERE banner_id=?`
                const banner=await queryAsync(get_banner_query,[banner_id])
                let banner_image = banner[0].banner_image;

                if (req.file) {
                    banner_image = `${base_url}/uploads/${req.file.filename}`;
                }

                const update_banner_query = `UPDATE banner SET banner_image=? WHERE banner_id=?`;
                const values = [banner_image, banner_id];
                await queryAsync(update_banner_query, values);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            
                            return res.redirect('/');
                        });
                    }

                    
                    return res.redirect('/banner');
                });
            } catch (e) {
                db.rollback();
                console.log(e);
                
                return res.redirect('/');
            }
        });
    } catch (e) {
        console.log(e);
        
        return res.redirect('/');
    }
}