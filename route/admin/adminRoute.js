const router=require('express').Router()
// middleware
const upload=require('../../middleware/upload')
const multiUpload=require('../../middleware/multiupload')
const adminAuth=require('../../middleware/authMiddleware')

// admin auth controller
const {registration,getLogin,postLogin,logOut}=require('../../controller/admin/adminController')

// dashboard controller
const {getDashboard}=require('../../controller/admin/dashboardController')


// Customer controller
const {getCustomerList,getEditCustomer,postEditCustomer,getCustomerDetails}=require('../../controller/admin/customerController')


// surveyor controller
const {getSurveyorList,
    getSurveyorTransactionList,
    getEditSurveyor,
    postEditSurveyor,
    getSurveyorDetails
}=require('../../controller/admin/surveyorController')


// Services controller
const {getServiceList,getEditService,getAddService,postAddService,postEditService}=require('../../controller/admin/serviceController')


// appointment controller
const {getAppointmentList,getAppointmentTransactionList,getAppointmentDetails}=require('../../controller/admin/appointmentController')


// contact us controller
const {getContactUs}=require('../../controller/admin/contactUsController')


// instrument 
const {getInstruments,
    getAddInstrument,
    postAddInstrument,
    getEditInstrument,
    postEditInstrument,
    getInstrumentsOrder,
    getInstrumentsOrderDetails,
    getInstrumentsOrderTransaction
    }=require('../../controller/admin/instrumentController')

// social media 
const {getSocialMedia,getEditSocialMedia,postEditSocialMedia}=require('../../controller/admin/socialMediaController')

// about us 
const {getAboutUs,getEditAboutUs,postEditAboutUs}=require('../../controller/admin/aboutUsController')

// terms_and_policy
const {getTermsPolicy,getAddTermsaAndPolicy,getEditTermsAndPolicy,postAddTermsAndPolicy,postEditTermsAndPolicy}=require('../../controller/admin/terms_and_policy')

// course
const {getCourse,getAddCourse,
    postAddCourse,
    getCourseDetails,
    postAddCourseVideo,
    postAddCourseFile,
    getCourseEnrollTransaction,
    getEditCourse,
    editCourse
    }=require('../../controller/admin/courseController')

// teacher
const {getTeacher,getAddTeacher,postAddTeacher,getEditTeacher,postEditTeacher}=require('../../controller/admin/teacherController')

// banner
const {getBanner,getEditBanner,postEditBanner}=require('../../controller/admin/bannerController')



// -------------------------------------------------routing-------------------------------------------------------

// -------------------------------------------------admin-------------------------------------------------------
// for get dashboard
router.get('/login',getLogin)
router.post('/login',postLogin)
router.get('/logout',logOut)
// -------------------------------------------------admin-------------------------------------------------------



// -------------------------------------------------dashboard-------------------------------------------------------
// for get dashboard
router.get('/',adminAuth,getDashboard)
// -------------------------------------------------dashboard-------------------------------------------------------


// -------------------------------------------------Customer-------------------------------------------------------
// for get edit customer page 
router.get('/customer-edit/:customer_id',adminAuth,getEditCustomer)
// for get customer List
router.get('/customer-list',adminAuth,getCustomerList)
// for post edit customer
router.post('/customer-edit/:customer_id',adminAuth,upload.single("customer-profile-image"),postEditCustomer)
// for get customer details
router.get('/customer-details/:customer_id',adminAuth,getCustomerDetails)

// -------------------------------------------------Customer-------------------------------------------------------


// -------------------------------------------------Surveyor-------------------------------------------------------
// for get surveyor List
router.get('/surveyor-list',adminAuth,getSurveyorList)
// for surveyor transaction list 
router.get('/surveyor-transaction-list',adminAuth,getSurveyorTransactionList)
// for get surveyor edit 
router.get('/surveyor-edit/:surveyor_id',adminAuth,getEditSurveyor)
// for post surveyor edit 
router.post('/surveyor-edit/:surveyor_id',adminAuth,upload.single("surveyor-profile-image"),postEditSurveyor)
// for surveyor details
router.get('/surveyor-details/:surveyor_id',adminAuth,getSurveyorDetails)
// -------------------------------------------------Surveyor-------------------------------------------------------


// -------------------------------------------------Services-------------------------------------------------------
// for get service List
router.get('/service-list',adminAuth,getServiceList)
// for get edit service
router.get('/service-edit/:service_id',adminAuth,getEditService)
// for get add service
router.get('/service-add',adminAuth,getAddService)
// for post add service
router.post('/service-add',adminAuth,upload.single("service_thumbnail_image"),postAddService)
// for post edit service
router.post('/service-edit/:service_id',adminAuth,upload.single("service_thumbnail_image"),postEditService)
// -------------------------------------------------Services-------------------------------------------------------


// -------------------------------------------------Appointment-------------------------------------------------------
// for get appointment List
router.get('/appointment-list',adminAuth,getAppointmentList)
// for appointment transaction list 
router.get('/appointment-transaction-list',adminAuth,getAppointmentTransactionList)
// for appointment details
router.get('/appointment-details/:appointment_id',adminAuth,getAppointmentDetails)
// -------------------------------------------------Appointment-------------------------------------------------------


// -------------------------------------------------contact us-------------------------------------------------------
// for get contact us
router.get('/contact-us',adminAuth,getContactUs)

// -------------------------------------------------contact us-------------------------------------------------------



// -------------------------------------------------instrument-------------------------------------------------------
// for get instrument
router.get('/instruments',adminAuth,getInstruments)
// for get add instrument
router.get('/instrument-add',adminAuth,getAddInstrument)
// for post add instrument
router.post('/instrument-add',adminAuth,upload.single("instrument_image"),postAddInstrument)
// for get edit instrument
router.get('/instrument-edit/:instrument_id',adminAuth,getEditInstrument)
// for post edit instrument
router.post('/instrument-edit/:instrument_id',adminAuth,upload.single("instrument_image"),postEditInstrument)
// for get instrument order 
router.get('/instruments-order',adminAuth,getInstrumentsOrder)
// for get instrument order details
router.get('/instruments-order-details/:instrument_order_id',adminAuth,getInstrumentsOrderDetails)
// for get instrument order transaction
router.get('/instruments-transaction',adminAuth,getInstrumentsOrderTransaction)

// -------------------------------------------------instrument-------------------------------------------------------



// -------------------------------------------------socail_media-------------------------------------------------------
// for get socail_media
router.get('/social-media',adminAuth,getSocialMedia)
// for get edit social media
router.get('/social-media-edit/:social_media_id',adminAuth,getEditSocialMedia)
// for post edit social media
router.post('/social-media-edit/:social_media_id',adminAuth,upload.single("social_media_image"),postEditSocialMedia)

// -------------------------------------------------socail_media-------------------------------------------------------



// -------------------------------------------------about_us-------------------------------------------------------
// for get about us
router.get('/about-us',adminAuth,getAboutUs)
// for get edit about_us
router.get('/about-us-edit/:about_us_id',adminAuth,getEditAboutUs)
// for post edit AboutUs
router.post('/about-us-edit/:about_us_id',adminAuth,postEditAboutUs)

// -------------------------------------------------about_us-------------------------------------------------------



// -------------------------------------------------terms_and_policy-------------------------------------------------------
// for get terms_and_policy
router.get('/terms-and-policy',adminAuth,getTermsPolicy)
// for get edit terms_and_policy
router.get('/terms-and-policy-edit/:terms_and_policy_id',adminAuth,getEditTermsAndPolicy)
// for get add terms_and_policy
router.get('/terms-and-policy-add',adminAuth,getAddTermsaAndPolicy)
// for post add terms_and_policy
router.post('/terms-and-policy-add',adminAuth,postAddTermsAndPolicy)
// for post edit terms_and_policy
router.post('/terms-and-policy-edit/:terms_and_policy_id',adminAuth,postEditTermsAndPolicy)
// -------------------------------------------------terms_and_policy-------------------------------------------------------



// -------------------------------------------------course-------------------------------------------------------
// for get course
router.get('/course',adminAuth,getCourse)
// for get add course
router.get('/course-add',adminAuth,getAddCourse)
// for post add course
router.post('/course-add',adminAuth,multiUpload.fields([{name:"course_thumbnail_image"},{name:"video"}]),postAddCourse)
// for get course details
router.get('/course-details/:course_id',adminAuth,getCourseDetails)
// for add course video lecture 
router.post('/course-add-video-lecture/:course_id/:section_id',adminAuth,upload.single('video'),postAddCourseVideo)
// for add course lecture file
router.post('/course-add-lecture-file/:course_id/:section_id',adminAuth,upload.single('lecture_file'),postAddCourseFile)
// for get course Enroll transaction
router.get('/course-transaction',adminAuth,getCourseEnrollTransaction)
// for get edit course
router.get('/course-edit/:course_id',adminAuth,getEditCourse)
// for post edit course
router.post('/course-edit/:course_id',adminAuth,multiUpload.fields([{name:"course_thumbnail_image"},{name:"video"}]),editCourse)

// -------------------------------------------------course-------------------------------------------------------



//--------------------------------------------------teacher------------------------------------------------------
// for get teacher
router.get('/teacher',adminAuth,getTeacher)
// for get add teacher
router.get('/teacher-add',adminAuth,getAddTeacher)
// for post add teacher
router.post('/teacher-add',adminAuth,upload.single('teacher_image'),postAddTeacher)
// for get edit teacher
router.get('/teacher-edit/:teacher_id',adminAuth,getEditTeacher)
// for post edit teacher
router.post('/teacher-edit/:teacher_id',adminAuth,upload.single('teacher_image'),postEditTeacher)

//--------------------------------------------------teacher------------------------------------------------------

//--------------------------------------------------banner------------------------------------------------------
// for get banner 
router.get('/banner',adminAuth,getBanner)
// for get edit banner
router.get('/banner-edit/:banner_id',adminAuth,getEditBanner)
// for post edit banner
router.post('/banner-edit/:banner_id',adminAuth,upload.single('banner_image'),postEditBanner)

//--------------------------------------------------banner------------------------------------------------------



module.exports=router