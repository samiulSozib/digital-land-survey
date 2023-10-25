const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// insert course section 
exports.insertCourseSection=async(req,res,next)=>{
    try{
        let course_id=req.params.course_id
        let {section_name}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', course:{}})
            }
            try{
                
                const insert_course_section_query=`INSERT INTO course_section(section_name,course_id) VALUES (?,?)`
                const values=[section_name,course_id]
                await queryAsync(insert_course_section_query,values)
                const get_course_query=`SELECT c.*,
                cs.section_id,
                cs.section_name
                FROM course as c 
                LEFT JOIN course_section as cs ON c.course_id=cs.course_id
                WHERE c.course_id=?
                `
                const course=await queryAsync(get_course_query,[course_id])

                const nestedJson = course.reduce((result, item) => {
                    const { course_id, course_name, course_price, course_discount, course_discount_price, description, objective, thumbnail_image, promotion_video, createdAt, updatedAt } = item;
                  
                    // Check if the course object already exists, create it if not
                    if (!result[course_id]) {
                      result[course_id] = {
                        course_id,
                        course_name,
                        course_price,
                        course_discount,
                        course_discount_price,
                        description,
                        objective,
                        thumbnail_image,
                        promotion_video,
                        createdAt,
                        updatedAt,
                        sections: [],
                      };
                    }
                  
                    // Add the section to the course's sections array
                    
                    if (item.section_id !== null && item.section_name !== null) {
                        // Add the section to the course's sections array
                        result[course_id].sections.push({ section_id: item.section_id, section_name: item.section_name });
                      }
                  
                    return result;
                  }, {});
                db.commit((err)=>{
                    if(err){
                        console.log(err)
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert course section data',course:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',course:nestedJson[course_id]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',course:{}})
    }
}

// edit course section 
exports.editCourseSection=async(req,res,next)=>{
    try{
        let course_id=req.params.course_id
        let section_id=req.params.section_id
        let {section_name}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', course:{}})
            }
            try{
                
                const insert_course_section_query=`UPDATE course_section
                SET section_name = ?
                WHERE section_id = ?;
                `
                const values=[section_name,section_id]
                await queryAsync(insert_course_section_query,values)
                const get_course_query=`SELECT c.*,
                cs.section_id,
                cs.section_name
                FROM course as c 
                LEFT JOIN course_section as cs ON c.course_id=cs.course_id
                WHERE c.course_id=?
                `
                const course=await queryAsync(get_course_query,[course_id])

                const nestedJson = course.reduce((result, item) => {
                    const { course_id, course_name, course_price, course_discount, course_discount_price, description, objective, thumbnail_image, promotion_video, createdAt, updatedAt } = item;
                  
                    // Check if the course object already exists, create it if not
                    if (!result[course_id]) {
                      result[course_id] = {
                        course_id,
                        course_name,
                        course_price,
                        course_discount,
                        course_discount_price,
                        description,
                        objective,
                        thumbnail_image,
                        promotion_video,
                        createdAt,
                        updatedAt,
                        sections: [],
                      };
                    }
                  
                    // Add the section to the course's sections array
                    
                    if (item.section_id !== null && item.section_name !== null) {
                        // Add the section to the course's sections array
                        result[course_id].sections.push({ section_id: item.section_id, section_name: item.section_name });
                      }
                  
                    return result;
                  }, {});
                db.commit((err)=>{
                    if(err){
                        console.log(err)
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to edit course section data',course:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',course:nestedJson[course_id]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',course:{}})
    }
}


// get Course by surveyor_id
exports.getCourseBySurveyor = async (req, res, next) => {
    try {
        const surveyor_id=req.query.surveyor_id
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: [] });
            }

            try {
                const get_all_courses_query = `
                SELECT c.*,
                (ce.surveyor_id IS NOT NULL) AS is_enrolled,
                cet.is_verified as is_verified
                FROM course as c 
                LEFT JOIN course_enroll as ce ON c.course_id =ce.course_id AND ce.surveyor_id=?
                LEFT JOIN course_enroll_transaction as cet ON ce.course_enroll_id=cet.course_enroll_id
                ORDER BY c.course_id
                `;
                const all_course = await queryAsync(get_all_courses_query,[surveyor_id]);
                if (all_course.length === 0) {
                    return res.status(200).json({ status: true, message: 'No course data found', course: [] });
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find course data', course: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', course: all_course });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', course: [] });
    }
};

// get Course by customer_id
exports.getCourseByCustomer = async (req, res, next) => {
    try {
        const customer_id=req.query.customer_id
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: [] });
            }

            try {
                const get_all_courses_query = `
                SELECT c.*,
                (ce.customer_id IS NOT NULL) AS is_enrolled,
                cet.is_verified as is_verified
                FROM course as c 
                LEFT JOIN course_enroll as ce ON c.course_id =ce.course_id AND ce.customer_id=?
                LEFT JOIN course_enroll_transaction as cet ON ce.course_enroll_id=cet.course_enroll_id
                ORDER BY c.course_id
                `;
                const all_course = await queryAsync(get_all_courses_query,[customer_id]);
                if (all_course.length === 0) {
                    return res.status(200).json({ status: true, message: 'No course data found', course: [] });
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find course data', course: [] });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', course: all_course });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: [] });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', course: [] });
    }
};

// enroll course
exports.enrollCourse=async(req,res,next)=>{
    try{
        
        let {course_id,surveyor_id,customer_id,account_type,account_number,amount,transaction_id,}=req.body
        //console.log(req.body)
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', course_enroll:{}})
            }
            try{
                if(!surveyor_id){
                    surveyor_id=null
                }else{
                    customer_id=null
                }
                const insert_enroll_course_query=`INSERT INTO course_enroll(course_id,surveyor_id,customer_id,amount) VALUES (?,?,?,?)`
                const values=[course_id,surveyor_id,customer_id,amount]
                const enroll_course= await queryAsync(insert_enroll_course_query,values)

                const insert_course_enroll_transaction_query=`INSERT INTO course_enroll_transaction(course_id,course_enroll_id,account_type,account_number,amount,transaction_id,is_verified) VALUES(?,?,?,?,?,?,?)`
                const transaction_values=[course_id,enroll_course.insertId,account_type,account_number,amount,transaction_id,false]
                const course_enroll_transaction=await queryAsync(insert_course_enroll_transaction_query,transaction_values)

                
                db.commit((err)=>{
                    if(err){
                        console.log(err)
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert course enroll data',course_enroll:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',course_enroll:enroll_course[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course_enroll: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',course_enroll:{}})
    }
}



// get enroll course details
exports.getCourseDetails = async (req, res, next) => {
    try {
        const course_id=req.query.course_id
        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }

            try {
                const get_course_query=`SELECT c.*,
                cs.section_id,
                cs.section_name,
                clv.course_lecture_video_id,
                clv.course_id as video_lecture_course_id,
                clv.section_id as video_lecture_section_id,
                clv.lecture_name as video_lecture_name,
                clv.lecture_video,
                clv.public as video_lecture_public,
                clf.course_lecture_file_id,
                clf.course_id as file_lecture_course_id,
                clf.section_id as file_lecture_section_id,
                clf.lecture_name as file_lecture_name,
                clf.lecture_file,
                clf.public as file_lecture_public,
                ct.course_teacher_id,
                ct.teacher_id,
                t.teacher_name,
                t.teacher_image,
                t.teacher_phone_number
                FROM course as c 
                LEFT JOIN course_section as cs ON c.course_id=cs.course_id
                LEFT JOIN course_lecture_video as clv ON cs.section_id=clv.section_id
                LEFT JOIN course_lecture_file as clf ON cs.section_id=clf.section_id
                LEFT JOIN course_teacher as ct ON c.course_id=ct.course_id
                LEFT JOIN teacher as t ON ct.teacher_id=t.teacher_id
                WHERE c.course_id=?
                `
                const course=await queryAsync(get_course_query,[course_id])

                const nestedJson = course.reduce((result, item) => {
                    const {
                      course_id,
                      course_name,
                      course_price,
                      course_discount,
                      course_discount_price,
                      description,
                      objective,
                      thumbnail_image,
                      promotion_video,
                      createdAt,
                      updatedAt,
                    } = item;
                  
                    // Check if the course object already exists, create it if not
                    if (!result[course_id]) {
                      result[course_id] = {
                        course_id,
                        course_name,
                        course_price,
                        course_discount,
                        course_discount_price,
                        description,
                        objective,
                        thumbnail_image,
                        promotion_video,
                        createdAt,
                        updatedAt,
                        sections: [],
                        teachers: [], // Store teachers in an array
                      };
                    }
                  
                    // Check if it's a section (with or without video/file lectures)
                    if (item.section_id !== null && item.section_name !== null) {
                      const existingSection = result[course_id].sections.find(
                        (section) => section.section_id === item.section_id
                      );
                  
                      if (!existingSection) {
                        const newSection = {
                          section_id: item.section_id,
                          section_name: item.section_name,
                          video_lectures: [],
                          file_lectures: [],
                        };
                  
                        if (item.video_lecture_course_id !== null) {
                          newSection.video_lectures.push({
                            course_lecture_video_id: item.course_lecture_video_id,
                            video_lecture_course_id: item.video_lecture_course_id,
                            video_lecture_section_id: item.video_lecture_section_id,
                            video_lecture_name: item.video_lecture_name,
                            lecture_video: item.lecture_video,
                            video_lecture_public: item.video_lecture_public,
                          });
                        }
                  
                        if (item.file_lecture_course_id !== null) {
                          newSection.file_lectures.push({
                            course_lecture_file_id: item.course_lecture_file_id,
                            file_lecture_course_id: item.file_lecture_course_id,
                            file_lecture_section_id: item.file_lecture_section_id,
                            file_lecture_name: item.file_lecture_name,
                            lecture_file: item.lecture_file,
                            file_lecture_public: item.file_lecture_public,
                          });
                        }
                  
                        result[course_id].sections.push(newSection);
                      } else {
                        if (
                          item.video_lecture_course_id !== null &&
                          !sectionContainsVideo(existingSection, item.course_lecture_video_id)
                        ) {
                          existingSection.video_lectures.push({
                            course_lecture_video_id: item.course_lecture_video_id,
                            video_lecture_course_id: item.video_lecture_course_id,
                            video_lecture_section_id: item.video_lecture_section_id,
                            video_lecture_name: item.video_lecture_name,
                            lecture_video: item.lecture_video,
                            video_lecture_public: item.video_lecture_public,
                          });
                        }
                  
                        if (
                          item.file_lecture_course_id !== null &&
                          !sectionContainsFile(existingSection, item.course_lecture_file_id)
                        ) {
                          existingSection.file_lectures.push({
                            course_lecture_file_id: item.course_lecture_file_id,
                            file_lecture_course_id: item.file_lecture_course_id,
                            file_lecture_section_id: item.file_lecture_section_id,
                            file_lecture_name: item.file_lecture_name,
                            lecture_file: item.lecture_file,
                            file_ecture_public: item.file_lecture_public,
                          });
                        }
                      }
                    }
                  
                    // Check if it's a teacher for the course
                    if (item.course_teacher_id !== null) {
                        const existingTeacher = result[course_id].teachers.find(
                          (teacher) => teacher.teacher_id === item.teacher_id
                        );
                    
                        if (!existingTeacher) {
                          result[course_id].teachers.push({
                            course_teacher_id:item.course_teacher_id,
                            teacher_id: item.teacher_id,
                            teacher_name: item.teacher_name,
                            teacher_image: item.teacher_image,
                            teacher_phone_number:item.teacher_phone_number
                          });
                        }
                      }
                  
                    return result;
                  }, {});

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to find course data', course: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', course: nestedJson[course_id] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
    }
};

// change course enroll transaction verification
exports.courseEnrollTransactionVerificationChange=async(req,res,next)=>{
    try{
        let course_enroll_transaction_id=req.query.course_enroll_transaction_id
        
        let {is_verified}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', transaction:{}})
            }
            try{
                const get_transaction_query='SELECT * FROM course_enroll_transaction WHERE course_enroll_transaction_id = ? '
                const is_transaction_present=await queryAsync(get_transaction_query,[course_enroll_transaction_id])
                if(is_transaction_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Transaction not found.',transaction:{}})
                }
                
                const update_transaction_query=`UPDATE course_enroll_transaction SET is_verified=? WHERE course_enroll_transaction_id=?`
                const values=[is_verified,course_enroll_transaction_id]
                await queryAsync(update_transaction_query,values)
                
                const get_update_transaction_query=`SELECT * FROM course_enroll_transaction WHERE course_enroll_transaction_id=?`
                const transaction_data=await queryAsync(get_update_transaction_query,[course_enroll_transaction_id])

             
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to update course enroll transaction data',transaction:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',transaction:transaction_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', transaction: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',transaction:{}})
    }
}

// delete course section
exports.deleteCourseSection = async (req, res, next) => {
    try {
        const section_id = req.params.section_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', section: {} });
            }

            try {
                const get_section_query = 'SELECT * FROM course_section WHERE section_id = ?';
                const existing_section = await queryAsync(get_section_query, [section_id]);
                //console.log(existing_section)

                if (existing_section.length === 0) {
                    return res.status(200).json({ status: false, message: 'No section found', section: {} });
                }

                const delete_section_query = 'DELETE FROM course_section WHERE section_id = ?';
                await queryAsync(delete_section_query, [section_id]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete section', section: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', section: existing_section[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', section: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', section: {} });
    }
};

// delete course
exports.deleteCourse = async (req, res, next) => {
    try {
        const course_id = req.params.course_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }

            try {
                const get_course_query = 'SELECT * FROM course WHERE course_id = ?';
                const existing_course = await queryAsync(get_course_query, [course_id]);
                //console.log(existing_section)

                if (existing_course.length === 0) {
                    return res.status(200).json({ status: false, message: 'No course found', course: {} });
                }

                const delete_course_query = 'DELETE FROM course WHERE course_id = ?';
                await queryAsync(delete_course_query, [course_id]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete section', course: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', course: existing_course[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
    }
};

// delete video
exports.deleteVideo = async (req, res, next) => {
    try {
        const course_lecture_video_id = req.params.course_lecture_video_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', video: {} });
            }

            try {
                const get_video_query = 'SELECT * FROM course_lecture_video WHERE course_lecture_video_id = ?';
                const existing_video = await queryAsync(get_video_query, [course_lecture_video_id]);
                //console.log(existing_section)

                if (existing_video.length === 0) {
                    return res.status(200).json({ status: false, message: 'No video found', video: {} });
                }

                const delete_video_query = 'DELETE FROM course_lecture_video WHERE course_lecture_video_id = ?';
                await queryAsync(delete_video_query, [course_lecture_video_id]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete section', video: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', video: existing_video[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', video: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', video: {} });
    }
};

// delete file 
exports.deleteFile = async (req, res, next) => {
    try {
        const course_lecture_file_id = req.params.course_lecture_file_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', file: {} });
            }

            try {
                const get_file_query = 'SELECT * FROM course_lecture_file WHERE course_lecture_file_id = ?';
                const existing_file = await queryAsync(get_file_query, [course_lecture_file_id]);
                //console.log(existing_section)

                if (existing_file.length === 0) {
                    return res.status(200).json({ status: false, message: 'No file found', file: {} });
                }

                const delete_file_query = 'DELETE FROM course_lecture_file WHERE course_lecture_file_id = ?';
                await queryAsync(delete_file_query, [course_lecture_file_id]);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete section', file: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', file: existing_file[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', file: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', file: {} });
    }
};

// change course lecture video change public status 
exports.courseLecureVideoPublicStatusChange=async(req,res,next)=>{
    try{
        let course_lecture_video_id=req.query.course_lecture_video_id
        
        let {is_public}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', course_lecture_video:{}})
            }
            try{
                const get_course_lecture_query='SELECT * FROM course_lecture_video WHERE course_lecture_video_id = ? '
                const is_course_lecture_video_present=await queryAsync(get_course_lecture_query,[course_lecture_video_id])
                if(is_course_lecture_video_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Transaction not found.',course_lecture_video:{}})
                }
                
                const update_course_lecture_video_query=`UPDATE course_lecture_video SET public=? WHERE course_lecture_video_id=?`
                const values=[is_public,course_lecture_video_id]
                await queryAsync(update_course_lecture_video_query,values)
                
                const get_update_course_lecture_video_query=`SELECT * FROM course_lecture_video WHERE course_lecture_video_id=?`
                const course_lecture_video_data=await queryAsync(get_update_course_lecture_video_query,[course_lecture_video_id])

             
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to update course enroll transaction data',course_lecture_video:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',course_lecture_video:course_lecture_video_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course_lecture_video: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',course_lecture_video:{}})
    }
}

// change course lecture file change public status 
exports.courseLecureFilePublicStatusChange=async(req,res,next)=>{
    try{
        let course_lecture_file_id=req.query.course_lecture_file_id
        
        let {is_public}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Internal Server Error', course_lecture_file:{}})
            }
            try{
                const get_course_lecture_query='SELECT * FROM course_lecture_file WHERE course_lecture_file_id = ? '
                const is_course_lecture_file_present=await queryAsync(get_course_lecture_query,[course_lecture_file_id])
                if(is_course_lecture_file_present.length===0){
                    db.rollback()
                    return res.status(200).json({status:false,message:'Transaction not found.',course_lecture_file:{}})
                }
                
                const update_course_lecture_file_query=`UPDATE course_lecture_file SET public=? WHERE course_lecture_file_id=?`
                const values=[is_public,course_lecture_file_id]
                await queryAsync(update_course_lecture_file_query,values)
                
                const get_update_course_lecture_file_query=`SELECT * FROM course_lecture_file WHERE course_lecture_file_id=?`
                const course_lecture_file_data=await queryAsync(get_update_course_lecture_file_query,[course_lecture_file_id])

             
                
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to update course enroll transaction data',course_lecture_file:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',course_lecture_file:course_lecture_file_data[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course_lecture_file: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',course_lecture_file:{}})
    }
}

// insert course teacher 
exports.insertCourseTeacher=async(req,res,next)=>{
    try{
        let course_id=req.params.course_id
        let {teacher_id}=req.body
        db.beginTransaction(async(err)=>{
            if(err){
                console.log(e)
                return res.status(503).json({status:false, message:'Fail! Internal Server Error', course:{}})
            }
            try{
                
                const insert_course_teacher_query=`INSERT INTO course_teacher(course_id,teacher_id) VALUES (?,?)`
                const values=[course_id,teacher_id]
                await queryAsync(insert_course_teacher_query,values)
                const get_course_query=`SELECT c.*,
                ct.teacher_id
                FROM course as c 
                LEFT JOIN course_teacher as ct ON c.course_id=ct.course_id
                WHERE c.course_id=?
                `
                const course=await queryAsync(get_course_query,[course_id])
                //console.log(course)
                
                db.commit((err)=>{
                    if(err){
                        console.log(err)
                        db.rollback(()=>{
                            return res.status(500).json({status:false,message:'Failed to insert course teacher data',course:{}})
                        })
                    }
                    
                    return res.status(200).json({status:true,message:'',course:course[0]})
                })
            }catch(e){
                console.log(e)
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }
        })
    }catch(e){
        console.log(e)
        return res.status(503).json({status:false,message:'Internal Server Error',course:{}})
    }
}


// delete course teacher
exports.deleteCourseTeacher = async (req, res, next) => {
    try {
        const course_teacher_id = req.params.course_teacher_id; 

        db.beginTransaction(async (err) => {
            if (err) {
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }

            try {
                const get_course_teacher_query = 'SELECT * FROM course_teacher WHERE course_teacher_id = ?';
                const existing_course_teacher = await queryAsync(get_course_teacher_query, [course_teacher_id]);
                

                if (existing_course_teacher.length === 0) {
                    return res.status(200).json({ status: false, message: 'No teacher found', course: {} });
                }

                const delete_course_teacher_query = 'DELETE FROM course_teacher WHERE course_teacher_id = ?';
                await queryAsync(delete_course_teacher_query, [course_teacher_id]);

                const get_course_query=`SELECT c.*,
                ct.teacher_id
                FROM course as c 
                LEFT JOIN course_teacher as ct ON c.course_id=ct.course_id
                WHERE ct.course_teacher_id=?
                `
                const course=await queryAsync(get_course_query,[course_teacher_id])

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).json({ status: false, message: 'Failed to delete section', course: {} });
                        });
                    }

                    return res.status(200).json({ status: true, message: '', course: course[0] });
                });
            } catch (e) {
                console.log(e);
                db.rollback();
                return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(503).json({ status: false, message: 'Internal Server Error', course: {} });
    }
};


function sectionContainsVideo(section, videoId) {
    return section.video_lectures.some((video) => video.course_lecture_video_id === videoId);
  }
  
  // Helper function to check if a file lecture already exists in the section
  function sectionContainsFile(section, fileId) {
    return section.file_lectures.some((file) => file.course_lecture_file_id === fileId);
  }