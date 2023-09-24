const apiRoute=require('./api/apiRoute')
const adminRoute=require('./admin/adminRoute')

const routes = [
    {
        path:'/api',
        handler:apiRoute
    },
    {
        path: '/',
        handler: adminRoute
    },
   
]

module.exports = (app) => {
    routes.forEach(r => {
        if (r.path == '/') {
            app.use(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}