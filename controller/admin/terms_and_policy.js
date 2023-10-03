const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// get Terms Policy
exports.getTermsPolicy=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_terms_and_policy_query=`SELECT * FROM terms_and_policy`;
                const terms_and_policy=await queryAsyncWithoutValue(get_terms_and_policy_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    return res.render('pages/termsAndPolicy',{title:"Terms & Policy",terms_and_policy,nav:"terms_and_policy"})
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

// get edit terms_and_policy
exports.getEditTermsAndPolicy=async(req,res,next)=>{
    try{
        let terms_and_policy_id=req.params.terms_and_policy_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_terms_and_policy_query = `SELECT * FROM terms_and_policy WHERE id=?`; 
                const terms_and_policy=await queryAsync(get_terms_and_policy_query,[terms_and_policy_id])
                

          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.render('pages/editTermsAndPolicy',{title:"Edit Terms And Policy",terms_and_policy:terms_and_policy[0],nav:"terms_and_policy"})
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

// get add terms_and_policy
exports.getAddTermsaAndPolicy=async(req,res,next)=>{
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
                    return res.render('pages/addTermsAndPolicy',{title:"Add Terms And Policy",nav:"terms_and_policy"})
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

// post add terms_and_policy
exports.postAddTermsAndPolicy=async(req,res,next)=>{
    try{
        let {title,description}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                

                const insert_terms_and_policy_query=`INSERT INTO terms_and_policy (title,description) VALUES (?,?)`
                const values=[title,description]
                await queryAsync(insert_terms_and_policy_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/terms-and-policy')
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

// post edit terms_and_policy
exports.postEditTermsAndPolicy=async(req,res,next)=>{
    try{
        let terms_and_policy_id=req.params.terms_and_policy_id
        let {title,description}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{

                let get_terms_and_policy_query=`SELECT * FROM terms_and_policy WHERE id=?`
                let terms_and_policy=await queryAsync(get_terms_and_policy_query,[terms_and_policy_id])


                const update_terms_and_policy_query=`UPDATE terms_and_policy SET title=?, description=? WHERE id=?`
                const values=[title,description,terms_and_policy_id]
                await queryAsync(update_terms_and_policy_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/terms-and-policy')
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