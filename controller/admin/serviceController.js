const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url = require('../../const/const')

// get Services list
exports.getServiceList=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_services_query=`SELECT * FROM our_services`;
                const services=await queryAsyncWithoutValue(get_services_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    return res.render('pages/serviceList',{title:"Services",services,nav:"services"})
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

// get edit services
exports.getEditService=async(req,res,next)=>{
    try{
        let service_id=req.params.service_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_service_query = `SELECT * FROM our_services WHERE service_id=?`; 
                const service=await queryAsync(get_service_query,[service_id])
                

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.render('pages/editService',{title:"Edit Service",service:service[0],nav:"services"})
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

// get add services
exports.getAddService=async(req,res,next)=>{
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
                    //return res.json(customer[0])
                    return res.render('pages/addService',{title:"Add Service",nav:"services"})
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

// post add services
exports.postAddService=async(req,res,next)=>{
    try{
        let {service_name,service_charge,description}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                let image=null

                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const insert_service_query=`INSERT INTO our_services (service_name,service_thumbnail_image,service_charge,description) VALUES (?,?,?,?)`
                const values=[service_name,image,service_charge,description]
                await queryAsync(insert_service_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/service-list')
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

// post edit services
exports.postEditService=async(req,res,next)=>{
    try{
        let service_id=req.params.service_id
        let {service_name,service_charge,description}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{

                let get_service_query=`SELECT * FROM our_services WHERE service_id=?`
                let service=await queryAsync(get_service_query,[service_id])

                let image=service[0].service_thumbnail_image

                if(req.file){
                    image=`${base_url}/uploads/${req.file.filename}`
                }

                const update_service_query=`UPDATE our_services SET service_name=?, service_thumbnail_image=?, service_charge=?,description=? WHERE service_id=?`
                const values=[service_name,image,service_charge,description,service_id]
                await queryAsync(update_service_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/service-list')
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