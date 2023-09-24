const router=require('express').Router()
// middleware
const upload=require('../../middleware/upload')
const adminAuth=require('../../middleware/authMiddleware')

// admin auth controller
const {registration,getLogin,postLogin,logOut}=require('../../controller/admin/adminController')

// dashboard controller
const {getDashboard}=require('../../controller/admin/dashboardController')


// Customer controller
const {getCustomerList}=require('../../controller/admin/customerController')


// surveyor controller
const {getSurveyorList,getSurveyorTransactionList}=require('../../controller/admin/surveyorController')


// Services controller
const {getServiceList}=require('../../controller/admin/serviceController')


// appointment controller
const {getAppointmentList,getAppointmentTransactionList}=require('../../controller/admin/appointmentController')


// contact us controller
const {getContactUs}=require('../../controller/admin/contactUsController')


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
// for get customer List
router.get('/customer-list',adminAuth,getCustomerList)
// -------------------------------------------------Customer-------------------------------------------------------


// -------------------------------------------------Surveyor-------------------------------------------------------
// for get surveyor List
router.get('/surveyor-list',adminAuth,getSurveyorList)
// for surveyor transaction list 
router.get('/surveyor-transaction-list',adminAuth,getSurveyorTransactionList)
// -------------------------------------------------Surveyor-------------------------------------------------------


// -------------------------------------------------Services-------------------------------------------------------
// for get service List
router.get('/service-list',adminAuth,getServiceList)
// -------------------------------------------------Services-------------------------------------------------------


// -------------------------------------------------Appointment-------------------------------------------------------
// for get appointment List
router.get('/appointment-list',adminAuth,getAppointmentList)
// for appointment transaction list 
router.get('/appointment-transaction-list',adminAuth,getAppointmentTransactionList)
// -------------------------------------------------Appointment-------------------------------------------------------


// -------------------------------------------------contact us-------------------------------------------------------
// for get contact us
router.get('/contact-us',adminAuth,getContactUs)

// -------------------------------------------------contact us-------------------------------------------------------




module.exports=router