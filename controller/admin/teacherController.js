const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')
const base_url=require('../../const/const')


// get teachers

exports.getTeacher=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_teacher_query=`SELECT * FROM teacher`;
                const teachers=await queryAsyncWithoutValue(get_teacher_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(teachers)
                    return res.render('pages/teachers',{title:"Teachers",teachers,nav:"teacher"})
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


// get add teacher
exports.getAddTeacher=async(req,res,next)=>{
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
                    return res.render('pages/addTeacher',{title:"Add teacher",nav:"teacher"})
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

// post add teachers
exports.postAddTeacher=async(req,res,next)=>{
    try{
        let {teacher_name,teacher_phone_number}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                let teacher_image=null

                if(req.file){
                    teacher_image=`${base_url}/uploads/${req.file.filename}`
                }

                const insert_teacher_query=`INSERT INTO teacher (teacher_name,teacher_image,teacher_phone_number) VALUES (?,?,?)`
                const values=[teacher_name,teacher_image,teacher_phone_number]
                await queryAsync(insert_teacher_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/teacher')
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

// get edit teacher
exports.getEditTeacher=async(req,res,next)=>{
    try{
        const teacher_id=req.params.teacher_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_teacher_query=`SELECT * FROM teacher WHERE teacher_id=?`
                const teacher=await queryAsync(get_teacher_query,[teacher_id])
                //console.log(teacher)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.render('pages/editTeacher',{title:"Edit teacher",teacher:teacher[0],nav:"teacher"})
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

// post edit teachers
exports.postEditTeacher = async (req, res, next) => {
    try {
        const teacher_id = req.params.teacher_id; 

        let { teacher_name, teacher_phone_number } = req.body;
        db.beginTransaction(async (err) => {
            if (err) {
                return res.redirect('/');
            }
            try {
                const get_teacher_query=`SELECT * FROM teacher WHERE teacher_id=?`
                const teacher=await queryAsync(get_teacher_query,[teacher_id])
                let teacher_image = teacher[0].teacher_image;

                if (req.file) {
                    teacher_image = `${base_url}/uploads/${req.file.filename}`;
                }

                const update_teacher_query = `UPDATE teacher SET teacher_name=?, teacher_image=?, teacher_phone_number=? WHERE teacher_id=?`;
                const values = [teacher_name, teacher_image, teacher_phone_number, teacher_id];
                await queryAsync(update_teacher_query, values);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            
                            return res.redirect('/');
                        });
                    }

                    
                    return res.redirect('/teacher');
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
