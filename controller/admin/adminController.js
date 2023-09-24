const db=require('../../config/database')
const {queryAsync,queryAsyncWithoutValue}=require('../../config/helper')
// const Flash=require('../util/Flash')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

// admin registration

exports.registration=async(req,res,next)=>{
    try{
        let {username,password}=req.body
        
        password=await bcrypt.hash(password,10)
        
        let insertAdmin=`INSERT INTO admin(username,password)VALUES(?,?)`
        let values=[username,password]
        console.log(values)

        db.query(insertAdmin,values,(err,result)=>{
            if(err){
                throw err
            }
            return res.json("registration success")
        })
    }catch(e){
        return res.status(500).json({msg:'Internal Server Error'})
    }
}

/// get login 
exports.getLogin=async(req,res,next)=>{
    try{
        
        return res.status(200).render('pages/login')
    }catch(e){
        return res.status(500).json({msg:'Error'})
    }
}

// post login 
exports.postLogin=async(req,res,next)=>{
    try{
        const { username, password } = req.body;

        db.query('SELECT * FROM admin WHERE username = ?', username, (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            //req.flash('fail', 'Login Failed')
            return res.status(401).redirect('/login')
          }
      
          const user = result[0];
      
          const isMatch = bcrypt.compare(password, user.password)
            if (!isMatch) {
                //req.flash('fail', 'Login Failed')
              return res.status(401).redirect('/login')
            }
      
            // User authenticated, create a JWT
            const token = jwt.sign({ userId: user.id }, "dls_admin_login_secret", { expiresIn: '2h' });
            res.cookie('token', token, { httpOnly: true});
            //req.flash('success', 'Login Success')
            return res.redirect('/');
           
          });
        
    }catch(e){
        return res.status(500).json({msg:'Error'})
    }
}

// logOut
exports.logOut=async(req,res,next)=>{
    try{
        // Clear the 'token' cookie
    res.clearCookie('token');
    console.log("delete")
    console.log(res.cookies)

    // Destroy the session
    req.session.destroy((err) => {
        
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
      }

      return res.redirect('/login');
    });
        
    
    }catch(e){
        console.log(e)
        return res.status(500).json({msg:'Internal Server Error'})

    }
}