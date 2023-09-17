const router=require('express').Router()
// middleware
const upload=require('../../middleware/upload')



// location controller 
const {getDivisionDistrictUpzila}=require('../../controller/api/locationController')

// customer controller 
const {customerRegistration,customerLogin}=require('../../controller/api/customerController')

// surveyor controller 
const {surveyorRegistration,surveyorLogin}=require('../../controller/api/surveyorController')

// our services
const {getOurServices}=require('../../controller/api/ourServiceController')

// surveyor experience
const {createSurveyorExperience}=require('../../controller/api/surveyorExperienceController')







// ----------------------------------------------------------location--------------------------------------------------------------
// for location ( division,district, upliza)
router.get('/locations',getDivisionDistrictUpzila)

// ----------------------------------------------------------location--------------------------------------------------------------



// ----------------------------------------------------------customer--------------------------------------------------------------
// for customer registration
router.post('/customer/auth/registration',upload.single('customer-profile-image'),customerRegistration)
// for customer loign 
router.post('/customer/auth/login',customerLogin)

// ----------------------------------------------------------customer--------------------------------------------------------------



// ----------------------------------------------------------surveyor--------------------------------------------------------------
// for surveyor registration
router.post('/surveyor/auth/registration',upload.single('surveyor-profile-image'),surveyorRegistration)
// for surveyor login
router.post('/surveyor/auth/login',surveyorLogin)

// ----------------------------------------------------------surveyor--------------------------------------------------------------



// ----------------------------------------------------------our services--------------------------------------------------------------
// for surveyor login
router.get('/our-services',getOurServices)

// ----------------------------------------------------------our services--------------------------------------------------------------




// ----------------------------------------------------------surveyor experience--------------------------------------------------------------
// for surveyor experience create 
router.post('/surveyor-experience/create',createSurveyorExperience)

// ----------------------------------------------------------surveyor services--------------------------------------------------------------



module.exports=router

