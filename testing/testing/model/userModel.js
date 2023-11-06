const mongoose=require('mongoose');
const myschema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    useremail:{
        type:String,
        required:true
    },
    userage:{
        type:Number,
        required:true
    },
    userpassword:{
        type:String,
        required:true
    },
    usercity:{
        type:String,
        required:true
    },
    userotp:{
        type:Number,
        default:''
    }
});
module.exports=mongoose.model("Users",myschema);
