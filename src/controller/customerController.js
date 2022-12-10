const customerModel = require('../model/customerModel')
const {isValid,isValidBody,isValidObjectId} = require('../validation/validator')
const aws= require("aws-sdk")

aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async (file) =>{
    return new Promise( function(resolve, reject) {
     let s3 = new aws.S3({apiVersion: '2006-03-01'});

     var uploadParams= {
         ACL: "public-read",
         Bucket: "classroom-training-bucket",
         Key: file.originalname,
         Body: file.buffer
     }
    
     s3.upload( uploadParams, function (err, data ){
         if(err) return reject({"error": err})
         return resolve(data.Location)
     })
    })
 }

const createCustomer = async function (req, res)
{
    try{
            let profile = req.files[0]
            if(req.files.length==0) return res.status(400).send({ status: false, message: "please enter profile picture" });
            let data =req.body
            if(!isValid(data)) return res.status(400).send({ status: false, message: "No Data Found" });

            let {fname,lname,username,password,cpassword,address,country,state,city,zipcode} = data

            if(!isValid(fname)) return res.status(400).send({ status: false, message: "Please Enter First Name" });
            if(!isValid(lname)) return res.status(400).send({ status: false, message: "Please Enter Last Name" });

            if(!isValid(username)) return res.status(400).send({ status: false, message: "Please Enter Username" });
            const checkUsername = await customerModel.findOne({ username: username });
            if (checkUsername) return res.status(400).send({ status: false, message: "Username is already register" });
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username.trim())) return res.status(400).send({ status: false, message: "Username should be valid" });
            
            if(!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });
            if (password.length < 8 || password.length > 15) return res.status(400).send({status: false,message: "password length should be in the range of 8 to 15 only",});

            if(!isValid(cpassword)) return res.status(400).send({ status: false, message: "Please Enter Confirm Password" });

            if(password!=cpassword) return res.status(400).send({ status: false, message: "Confirm Password Should Be Same" });

            if(!isValid(address)) return res.status(400).send({ status: false, message: "Please Enter address" });
            if(!isValid(country)) return res.status(400).send({ status: false, message: "Please Enter Country" });
            if(!isValid(state)) return res.status(400).send({ status: false, message: "Please Enter State" });
            if(!isValid(city)) return res.status(400).send({ status: false, message: "Please Enter City" });
            if(!isValid(zipcode)) return res.status(400).send({ status: false, message: "Please Enter Zipcode" });
            
            
            let imageUrl = await uploadFile(profile)
            data.profile = imageUrl

            let customer = await customerModel.create(data)
            return res.status(201).send({status:true ,message:"Customer created successfully", data:customer})
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message})
    }
}

const customer = async function (req, res)
{
    try{
            
            let customer = await customerModel.find()
            return res.status(201).send({status:true ,message:"Customer List", data:customer})
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message})
    }
}

const customerById = async function (req, res)
{
    try{
            let custId = req.params.customerId
            if(!isValidObjectId(custId)) return res.status(400).send({status:false , message:"Please Enter Valid Customer Id"})
            
            let customer = await customerModel.findOne({_id:custId})
            if (!customer) return res.status(404).send({ status: false, message: "customer not found" });
            return res.status(201).send({status:true ,message:"Customer Found", data:customer})
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message})
    }
}

const updateCustomer = async function (req, res)
{
    try{
            let custId = req.params.customerId
            if(!isValidObjectId(custId)) return res.status(400).send({status:false , message:"Please Enter Valid Customer Id"})
            
            let findCustomer = await customerModel.findOne({_id:custId})
            if (!findCustomer) return res.status(404).send({ status: false, message: "customer not found" });

            let data =req.body
            if(!isValid(data) && req.files.length==0) return res.status(400).send({ status: false, message: "No Data Found" });

            
            if(req.files.length!=0){
                let profile = req.files[0]
                let imageUrl = await uploadFile(profile)
                data.profile = imageUrl
              }

            let customer = await customerModel.findOneAndUpdate(
                {_id:custId},
                data,
                {new:true}
                )
            return res.status(201).send({status:true ,message:"Customer updated successfully", data:customer})
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message})
    }
}

const deleteCustomer = async function (req, res)
{
    try{
            let custId = req.params.customerId
            if(!isValidObjectId(custId)) return res.status(400).send({status:false , message:"Please Enter Valid Customer Id"})
            
            let findCustomer = await customerModel.findOne({_id:custId})
            if (!findCustomer) return res.status(404).send({ status: false, message: "customer not found" });

            let customer = await customerModel.findByIdAndDelete(custId)
            return res.status(201).send({status:true ,message:"Customer deleted successfully", data:customer})
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message})
    }
}

module.exports = {createCustomer,customer,customerById,updateCustomer,deleteCustomer}