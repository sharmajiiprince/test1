const mongoose=require('mongoose');
const myschema=new mongoose.Schema({
    // user_id:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Users'
    // },//for single populates.

    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    subject:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    mobile:{
      type:String,
      required:true
    }
});
module.exports=mongoose.model('Subject',myschema);