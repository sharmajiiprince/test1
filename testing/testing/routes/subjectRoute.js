const express=require('express');
const subject_route=express();
const multer=require('multer');
const path=require('path');


subject_route.use(express.json());
subject_route.use(express.static('public'));

const storagefile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storagefile });


const auth=require('../middleware/auth');

const subjectcontrller=require('../controller/subjectController');
subject_route.post('/add-subject',upload.single('image'),subjectcontrller.creat_details);
subject_route.get('/poplate',subjectcontrller.populate);
subject_route.post('/add-tech',upload.single('image'),subjectcontrller.creat_populates);
module.exports=subject_route;