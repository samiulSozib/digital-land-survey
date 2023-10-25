const db=require('../../config/database')
const {queryAsync, queryAsyncWithoutValue}=require('../../config/helper')


// get Course
exports.getCourse=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_course_query=`SELECT * FROM course`;
                const courses=await queryAsyncWithoutValue(get_course_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    return res.render('pages/courseList',{title:"Course",courses,nav:"course"})
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


// get add course
exports.getAddCourse=async(req,res,next)=>{
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
                    return res.render('pages/addCourse',{title:"Add Course",nav:"course"})
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


// post add course
exports.postAddCourse=async(req,res,next)=>{
    try{
        let {course_name,course_price,course_discount,description,objective}=req.body
        let course_thumbnail_image=req.files['course_thumbnail_image']?req.files['course_thumbnail_image'][0]:null 
        let course_promotion_video=req.files['video']?req.files['video'][0]:null
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                let thumbnail_image=null 
                let promotion_video=null 

                if(course_thumbnail_image){
                    thumbnail_image=`/uploads/${course_thumbnail_image.filename}`
                }

                if(course_promotion_video){
                    promotion_video=`/uploads/${course_promotion_video.filename}`
                }

                let course_discount_price=(course_price-(course_price*(course_discount/100)));

                const insert_course_query=`INSERT INTO course (course_name,course_price,course_discount,course_discount_price,description,objective,thumbnail_image,promotion_video) VALUES (?,?,?,?,?,?,?,?)`
                const values=[course_name,course_price,course_discount,course_discount_price,description,objective,thumbnail_image,promotion_video]
                await queryAsync(insert_course_query,values)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect('/course')
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

// get edit course
exports.getEditCourse=async(req,res,next)=>{
    try{
        const course_id=req.params.course_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                const get_course_query=`SELECT * FROM course WHERE course_id=?`
                const course=await queryAsync(get_course_query,[course_id])
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(course[0])
                    return res.render('pages/editCourse',{title:"Edit Course",nav:"course",course:course[0]})
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

// edit course
exports.editCourse = async (req, res, next) => {
    try {
        const course_id = req.params.course_id; // Assuming you have the course ID in the URL
        const { course_name, course_price, course_discount, description, objective } = req.body;
        const courseThumbnailImage = req.files['course_thumbnail_image'] ? req.files['course_thumbnail_image'][0] : null;
        const coursePromotionVideo = req.files['video'] ? req.files['video'][0] : null;

        db.beginTransaction(async (err) => {
            if (err) {
                return res.redirect('/');
            }

            try {

                const get_course=`SELECT * FROM course WHERE course_id=?`
                const course=await queryAsync(get_course,[course_id])

                let thumbnail_image = course[0].thumbnail_image;
                let promotion_video = course[0].promotion_video;

                if (courseThumbnailImage) {
                    thumbnail_image = `/uploads/${courseThumbnailImage.filename}`;
                }

                if (coursePromotionVideo) {
                    promotion_video = `/uploads/${coursePromotionVideo.filename}`;
                }

                const courseDiscountPrice = course_price - (course_price * (course_discount / 100));

                const updateCourseQuery = `
                    UPDATE course
                    SET
                        course_name = ?,
                        course_price = ?,
                        course_discount = ?,
                        course_discount_price = ?,
                        description = ?,
                        objective = ?,
                        thumbnail_image = ?,
                        promotion_video = ?
                    WHERE course_id = ?
                `;

                const values = [
                    course_name,
                    course_price,
                    course_discount,
                    courseDiscountPrice,
                    description,
                    objective,
                    thumbnail_image,
                    promotion_video,
                    course_id
                ];

                await queryAsync(updateCourseQuery, values);

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            // Handle rollback error
                            return res.redirect('/');
                        });
                    }

                    // Update was successful
                    return res.redirect('/course');
                });
            } catch (e) {
                db.rollback();
                console.log(e);
                // Handle update failure
                return res.redirect('/');
            }
        });
    } catch (e) {
        console.log(e);
        // Handle exception
        return res.redirect('/');
    }
};



// get course details

exports.getCourseDetails=async(req,res,next)=>{
    try{
        let course_id=req.params.course_id
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
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
                t.teacher_image
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
                          });
                        }
                      }
                  
                    return result;
                  }, {});

                  const get_all_teacher_query=`SELECT * FROM teacher`
                  const teachers=await queryAsyncWithoutValue(get_all_teacher_query)
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(course)
                    //return res.json(nestedJson[course_id])
                    return res.render('pages/courseDetails',{title:"Course Details",nav:"course",course:nestedJson[course_id],teachers})
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

// post add course video
exports.postAddCourseVideo=async(req,res,next)=>{
    try{
        let {video_lecture_name}=req.body
        let course_id=req.params.course_id
        let section_id=req.params.section_id


        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                
                let course_lecture_video=null 

                if(req.file){
                    course_lecture_video=`/uploads/${req.file.filename}`
                }

               

                const insert_course_lecture_video_query=`INSERT INTO course_lecture_video (course_id,section_id,lecture_name,lecture_video,public) VALUES (?,?,?,?,?)`
                const values=[course_id,section_id,video_lecture_name,course_lecture_video,false]
                await queryAsync(insert_course_lecture_video_query,values)

                

                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect(`/course-details/${course_id}`)
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


// post add course video
exports.postAddCourseFile=async(req,res,next)=>{
    try{
        let {file_lecture_name}=req.body
        let course_id=req.params.course_id
        let section_id=req.params.section_id


        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                
                let lecture_file=null 

                if(req.file){
                    lecture_file=`/uploads/${req.file.filename}`
                }

               

                const insert_course_lecture_file_query=`INSERT INTO course_lecture_file (course_id,section_id,lecture_name,lecture_file,public) VALUES (?,?,?,?,?)`
                const values=[course_id,section_id,file_lecture_name,lecture_file,false]
                await queryAsync(insert_course_lecture_file_query,values)

                

                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(customer[0])
                    return res.redirect(`/course-details/${course_id}`)
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

// get course transaction
exports.getCourseEnrollTransaction=async(req,res,next)=>{
    try{
        
        db.beginTransaction(async(err)=>{
            if(err){
                return res.redirect('/')
            }
            try{
                
                const get_courses_enroll_transaction_query=`SELECT ce.*,
                                            c.*,
                                            s.*,
                                            cet.*
                                            FROM course_enroll as ce
                                            LEFT JOIN customers as c ON c.customer_id=ce.customer_id
                                            LEFT JOIN surveyors as s ON s.surveyor_id=ce.surveyor_id
                                            INNER JOIN course_enroll_transaction as cet ON ce.course_enroll_id=cet.course_enroll_id
                                            `;


                const courses_enroll_transactions=await queryAsyncWithoutValue(get_courses_enroll_transaction_query)
          
                db.commit((err)=>{
                    if(err){
                        db.rollback(()=>{
                            //req.flash('fail', 'Star Insert Fail')
                            return res.redirect('/')
                        })
                    }
                    //req.flash('success', 'Star Insert Success')
                    //return res.json(courses_enroll_transactions)
                    return res.render('pages/courseEnrollTransaction',{title:"Course Enroll Transaction",courses_enroll_transactions,nav:"course_transaction"})
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




function sectionContainsVideo(section, videoId) {
    return section.video_lectures.some((video) => video.course_lecture_video_id === videoId);
  }
  
  // Helper function to check if a file lecture already exists in the section
  function sectionContainsFile(section, fileId) {
    return section.file_lectures.some((file) => file.course_lecture_file_id === fileId);
  }