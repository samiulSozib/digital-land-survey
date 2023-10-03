const router=require('express').Router()
// middleware
const upload=require('../../middleware/upload')
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




module.exports=router