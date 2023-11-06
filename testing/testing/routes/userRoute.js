const express=require('express');
const user_route=express();

user_route.use(express.json());
const usercontroller=require('../controller/userController');

const auth=require('../middleware/auth');

user_route.post('/add-user',usercontroller.create_user);
user_route.get('/login',usercontroller.login_user);
user_route.get('/test',auth,usercontroller.test);
user_route.post('/forget-pass',auth,usercontroller.forget_password);
user_route.post('/reset-pass',usercontroller.reset_password);
user_route.get('/search/:key',usercontroller.search_user);
user_route.put('/update-profile',auth,usercontroller.update_user);
user_route.get('/paginate',usercontroller.paginate);
user_route.get('/qrcode',usercontroller.create_qr);

module.exports=user_route;