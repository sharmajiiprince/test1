const Subjects=require('../model/subjectModel');
const creat_details=async(req,res)=>{
    const subject = new Subjects({
        user_id: req.body.id,
        subject: req.body.subject,
        experience: req.body.experience,
        image: req.file.filename,
        mobile: req.body.mobile,
    });
    const result=subject.save();
    res.status(200).send(result);
}

const populate=async(req,res)=>{
    let result=await Subjects.find({_id:req.body.id}).populate('user_id');
    res.status(200).send(result);
}

const creat_populates = async (req, res) => {
    const subject = await Subjects.findOne(req.body._id);
    if (!subject) {
        // const data = new Subjects({
        //     user_id: req.body.id,
        //     subject: req.body.subject,
        //     experience: req.body.experience,
        //     image: req.file.filename,
        //     mobile: req.body.mobile,
        // });
        //  const result=subject.save();
        res.status(200).send('this subjects not existes please creat new!');
    }

    const { id, experience, mobile } = req.body;
    const result = await Subjects.findByIdAndUpdate(
        req.body.subject,
        { $push: { user_id: id } }, 
        { new: true }
    );
    res.status(200).send(result);
}

module.exports={
    creat_details,
    populate,
    creat_populates
}