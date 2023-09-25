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
        deleteCustomer
        }=require('../../controller/api/customerController')

// surveyor controller 
const {surveyorRegistration,
        surveyorLogin,
        getSurveyorByServiceIdAndDate,
        getAllSurveyors,getSurveyorById,
        createSurveyorTransaction,
        surveyorApprovalChange,
        surveyorTransactionVerificationChange,
        deleteSurveyor
        }=require('../../controller/api/surveyorController')

// our services
const {getOurServices}=require('../../controller/api/ourServiceController')

// surveyor experience
const {createSurveyorExperience}=require('../../controller/api/surveyorExperienceController')

// appointment
const {getAppointmentStatus,createAppointment,createTransaction,verifyTransaction}=require('../../controller/api/appointmentController')

// contact us 
const {insertContactUs}=require('../../controller/api/contactUsController')




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

// ----------------------------------------------------------customer--------------------------------------------------------------



// ----------------------------------------------------------surveyor--------------------------------------------------------------
// for surveyor registration
router.post('/surveyor/auth/registration',upload.single('surveyor-profile-image'),surveyorRegistration)
// for surveyor login
router.post('/surveyor/auth/login',surveyorLogin)
// for get surveyors by service id and date 
router.get('/surveyors/service-id-and-date',getSurveyorByServiceIdAndDate)
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

// ----------------------------------------------------------surveyor--------------------------------------------------------------



// ----------------------------------------------------------our services--------------------------------------------------------------
// for surveyor login
router.get('/our-services',getOurServices)

// ----------------------------------------------------------our services--------------------------------------------------------------




// ----------------------------------------------------------surveyor experience--------------------------------------------------------------
// for surveyor experience create 
router.post('/surveyor-experience/create',createSurveyorExperience)

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


// ----------------------------------------------------------contact us--------------------------------------------------------------



module.exports=router

