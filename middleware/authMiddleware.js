const jwt = require("jsonwebtoken");

const adminAuth = async(req, res, next) => {
    const token = req.cookies.token;
        //console.log(token)

        if (!token) {
            return res.redirect('/login')
        }
    try {
        
        const verified = jwt.verify(token, "dls_admin_login_secret");
        //console.log(jwt.verify(token,"passwordKey"))
        if (!verified)
            return res.redirect('/login')


        req.admin = verified.userId;
        
        
        return next();
    } catch (err) {
        return res.status(500).redirect('/login')
    }
};



module.exports = adminAuth;