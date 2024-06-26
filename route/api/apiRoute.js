const router=require('express').Router()
// middleware
const upload=require('../../middleware/upload')



// location controller 
const {getDivisionDistrictUpzila}=require('../../controller/api/locationController')

// customer controller 
const {customerRegistration,
        customerLogin,
        getCustomerProfile,
        updateCustomerProfile,
        deleteCustomer,
        changeCustomerPassword,
        verifyCustomerCode,
        resetCustomerPassword
        }=require('../../controller/api/customerController')

// surveyor controller 
const {surveyorRegistration,
        surveyorLogin,
        getSurveyorByServiceIdAndDate,
        getAllSurveyors,
        getSurveyorById,
        createSurveyorTransaction,
        surveyorApprovalChange,
        surveyorTransactionVerificationChange,
        deleteSurveyor,
        changeSurveyorPassword,
        getSurveyorByServiceIdAndDateAndSurveyorId,
        verifySurveyorCode,
        resetSurveyorPassword,
        updateSurveyorProfile
        }=require('../../controller/api/surveyorController')

// our services
const {getOurServices,deleteService}=require('../../controller/api/ourServiceController')

// surveyor experience
const {createSurveyorExperience,replaceOrDeleteSurveyorExperiences}=require('../../controller/api/surveyorExperienceController')

// appointment
const {getAppointmentStatus,createAppointment,createTransaction,verifyTransaction}=require('../../controller/api/appointmentController')

// contact us 
const {insertContactUs,deleteContactUs}=require('../../controller/api/contactUsController')


// about us 
const {getAbout_us}=require('../../controller/api/aboutUsController')


// terms and policy
const {getAllTerms_and_policy,deleteTerms_and_policy}=require('../../controller/api/termsAndPolicy')



// social media link
const {getAllsocial_media_link,deletesocial_media_link}=require('../../controller/api/socialMediaLink')


// instruments
const {getAllInstruments,getInstrumentById,deleteInstrument,postInstrumentOrder,instruments_ordersTransactionVerificationChange,changeOrderStatus}=require('../../controller/api/instrumentController')


// course
const {insertCourseSection,
        getCourseBySurveyor,
        getCourseByCustomer,
        enrollCourse,
        getCourseDetails,
        courseEnrollTransactionVerificationChange,
        editCourseSection,
        deleteCourseSection,
        deleteCourse,
        deleteVideo,
        deleteFile,
        courseLecureVideoPublicStatusChange,
        courseLecureFilePublicStatusChange,
        insertCourseTeacher,
        deleteCourseTeacher
        }=require('../../controller/api/courseController')

// teacher
const {deleteTeacher}=require('../../controller/api/teacherController')


// banner 
const {getBanner}=require('../../controller/api/bannerController')


// ----------------------------------------------------------location--------------------------------------------------------------
// for location ( division,district, upliza)
router.get('/locations',getDivisionDistrictUpzila)

// ----------------------------------------------------------location--------------------------------------------------------------



// ----------------------------------------------------------customer--------------------------------------------------------------
// for customer registration
router.post('/customer/auth/registration',upload.single('customer-profile-image'),customerRegistration)
// for customer loign 
router.post('/customer/auth/login',customerLogin)
// for customer profile
router.get('/customer/profile',getCustomerProfile)
// for customer profile update 
router.post('/customer/profile/update',upload.single('customer-profile-image'),updateCustomerProfile)
// for delete customer
router.delete('/customer-delete',deleteCustomer)
// for change password
router.post('/customer-change-password',changeCustomerPassword)
// for verify code
router.post('/customer-verify-code',verifyCustomerCode)
// for reset password
router.post('/customer-reset-password',resetCustomerPassword)

// ----------------------------------------------------------customer--------------------------------------------------------------



// ----------------------------------------------------------surveyor--------------------------------------------------------------
// for surveyor registration
router.post('/surveyor/auth/registration',upload.single('surveyor-profile-image'),surveyorRegistration)
// for surveyor login
router.post('/surveyor/auth/login',surveyorLogin)
// for get surveyors by service id and date 
router.get('/surveyors/service-id-and-date',getSurveyorByServiceIdAndDate)
// for get surveyors by service id and date and surveyor id
router.get('/surveyors/service-id-and-date-and-surveyor-id',getSurveyorByServiceIdAndDateAndSurveyorId)
// for get all Surveyors
router.get('/surveyors',getAllSurveyors)
// for get surveyor by id 
router.get('/surveyor',getSurveyorById)
// for surveyor transaction
router.post('/surveyor/transaction-create',createSurveyorTransaction)
// for surveyor approval change 
router.post('/surveyor/change-approval',surveyorApprovalChange)
// for surveyor transaction verification change 
router.post('/surveyor/transaction-verification-change',surveyorTransactionVerificationChange)
// for surveyor delete
router.delete('/surveyor-delete',deleteSurveyor)
// for surveyor change password
router.post('/surveyor-change-password',changeSurveyorPassword)
// for verify code
router.post('/surveyor-verify-code',verifySurveyorCode)
// for reset password
router.post('/surveyor-reset-password',resetSurveyorPassword)
// for update surveyor profile
router.post('/surveyor/profile/update',upload.single('surveyor-profile-image'),updateSurveyorProfile)


// ----------------------------------------------------------surveyor--------------------------------------------------------------



// ----------------------------------------------------------our services--------------------------------------------------------------
// for surveyor login
router.get('/our-services',getOurServices)
// for delete service
router.delete('/service-delete',deleteService)

// ----------------------------------------------------------our services--------------------------------------------------------------




// ----------------------------------------------------------surveyor experience--------------------------------------------------------------
// for surveyor experience create 
router.post('/surveyor-experience/create',createSurveyorExperience)
// for surveyor experience update 
router.post('/surveyor-experience/update',replaceOrDeleteSurveyorExperiences)

// ----------------------------------------------------------surveyor services--------------------------------------------------------------



// ----------------------------------------------------------appointment--------------------------------------------------------------
// get appointment status 
router.get('/appointment-status',getAppointmentStatus)
// for surveyor experience create 
router.post('/appointment/create',createAppointment)
// for insert transaction
router.post('/appointment/transaction/create',createTransaction)
// for verifing transaction
router.post('/appointment/transaction-verify',verifyTransaction)

// ----------------------------------------------------------appointment--------------------------------------------------------------



// ----------------------------------------------------------contact us--------------------------------------------------------------
// insert contact us 
router.post('/contact-us/create',insertContactUs)
// delete contact us
router.delete('/contact-us-delete',deleteContactUs)

// ----------------------------------------------------------contact us--------------------------------------------------------------



// ----------------------------------------------------------about us--------------------------------------------------------------
// get about us 
router.get('/about-us',getAbout_us)


// ----------------------------------------------------------about us--------------------------------------------------------------



// ----------------------------------------------------------terms and policy--------------------------------------------------------------
// get about us 
router.get('/terms-and-policy',getAllTerms_and_policy)
// delete terms and policy
router.delete('/terms-and-policy-delete',deleteTerms_and_policy)
// ----------------------------------------------------------terms and policy--------------------------------------------------------------



// ----------------------------------------------------------social media--------------------------------------------------------------
// get about us 
router.get('/social-media-link',getAllsocial_media_link)
// delete terms and policy
router.delete('/social-media-link-delete',deletesocial_media_link)
// ----------------------------------------------------------social media--------------------------------------------------------------



// ----------------------------------------------------------instruments--------------------------------------------------------------
// get all instruments
router.get('/instruments',getAllInstruments)
// get instrument by id 
router.get('/instruments/instrument-id',getInstrumentById)
// delete instrument
router.delete('/instrument-delete',deleteInstrument)
// for post instrument order and transaction
router.post('/instrument-order-create',postInstrumentOrder)
// for change order transaction verification id 
router.post('/instruments-orders-transaction-verify',instruments_ordersTransactionVerificationChange)
router.post('/instruments-orders-status-change',changeOrderStatus)

// ----------------------------------------------------------instruments--------------------------------------------------------------



// ----------------------------------------------------------course--------------------------------------------------------------
// post course section
router.post('/course/course-section-add/:course_id',insertCourseSection)
// get course by surveyor_id
router.get('/courses/surveyor',getCourseBySurveyor)
// get course by customer_id
router.get('/courses/customer',getCourseByCustomer)
// for post course enroll
router.post('/course/enroll',enrollCourse)
// for course details by id
router.get('/course-details',getCourseDetails)
// for change course enroll verification status change
router.post('/course-enroll-transaction-verify',courseEnrollTransactionVerificationChange)
// for edit course section
router.post('/course/course-section-edit/:course_id/:section_id',editCourseSection)
// for section delete
router.delete('/course/course-section-delete/:section_id',deleteCourseSection)
// for course delete 
router.delete('/course-delete/:course_id',deleteCourse)
// for video lecture delete 
router.delete('/course/course-lecture-video-delete/:course_lecture_video_id',deleteVideo)
// for file lecture delete 
router.delete('/course/course-lecture-file-delete/:course_lecture_file_id',deleteFile)
// for course lecture video public status change
router.post('/course/course-lecture-video-public-status',courseLecureVideoPublicStatusChange)
// for course lecture file public status change
router.post('/course/course-lecture-file-public-status',courseLecureFilePublicStatusChange)
// post course teacher
router.post('/course/course-teacher-add/:course_id',insertCourseTeacher)
// for delete course teacher
router.delete('/course/course-teacher-delete/:course_teacher_id',deleteCourseTeacher)

// ----------------------------------------------------------course--------------------------------------------------------------

// ----------------------------------------------------------teacher--------------------------------------------------------------
// for delete teacher
router.delete('/teacher-delete',deleteTeacher)

// ----------------------------------------------------------teacher--------------------------------------------------------------


// ----------------------------------------------------------banner--------------------------------------------------------------
// for get banner
router.get('/banner',getBanner)

// ----------------------------------------------------------banner--------------------------------------------------------------




module.exports=router

