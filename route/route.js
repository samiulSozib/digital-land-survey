const apiRoute=require('./api/apiRoute')

const routes = [
    {
        path:'/api',
        handler:apiRoute
    },
    {
        path: '/',
        handler: (req,res)=>{
            return res.json({msg:'Welcome to the application'})
        }
    },
   
]

module.exports = (app) => {
    routes.forEach(r => {
        if (r.path == '/') {
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}