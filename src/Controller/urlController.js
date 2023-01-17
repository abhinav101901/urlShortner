const UrlModel=require("../model/urlModel");
const shortid=require("shortid");
const axios=require("axios")

//---------------------------------------Creating urlData--------------------------------------------------------
const createShortUrl=async function(req,res){
    try{
        let obj={};
        let data =req.body;

    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Provide data in body"})
    if(!data.longUrl) return res.status(400).send({status:false,message:"Provide Long URL"})

    if (typeof longUrl!="string") return res.status(400).send({ status: false, message: "Long url is not String" });

    let urlfound= false;
    await axios.get(data.longUrl)
    .then((result)=>{
        if(result.status==200||result.status==201)
            urlfound=true;
    })
    .catch((error)=>{})

    if(urlfound==false) return res.status(400).send({status:false,message:"Invalid long Url"})

    let longUrlPresent = await UrlModel.findOne({longUrl:data.longUrl}).select({_id:0,createdAt:0,updatedAt:0,__v:0})
    if(longUrlPresent) return res.status(200).send({status:true,data:longUrlPresent})

    let urlCode= shortid.generate().toLowerCase();//fdjgfdnsg7 --->fDjGfDnsg7-->fdjgfdnsg7

    let urlCodePresent = await UrlModel.findOne({urlCode:urlCode})
    if(urlCodePresent) return res.status(400).send({status:false,message:"Url code is already present"})

    let shortUrl= "http://localhost:3000/"+urlCode;

    obj.longUrl=data.longUrl;
    obj.shortUrl=shortUrl;
    obj.urlCode=urlCode;

    let created = await UrlModel.create(obj)
    let result= await UrlModel.findById(created._id).select({longUrl:1,shortUrl:1,urlCode:1,_id:0})
    return res.status(201).send({status:true,data:result})
}
    catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

//---------------------------------------------- Get urlData -----------------------------------------------------------------------------------

const redirectUrl=async function(req,res){
    try{
        let urlCode=req.params.urlCode;
    if(!urlCode) return res.status(400).send({status:false,message:"Please enter the Url Code"})

    if(!shortid.isValid(urlCode)) return res.status(400).send({status:false,message:"Please enter correct Url code"})

    let checkUrlCode = await UrlModel.findOne({urlCode:urlCode}).select({longUrl:1,_id:0})
    if(!checkUrlCode) return res.status(404).send({status:false,message:"Url Code not found"})

    let Url = checkUrlCode.longUrl 

    return res.status(302).redirect(Url)
}
    catch(error){
        return res.status(500).send({status:false,Error:error.message})
    }
}

module.exports={createShortUrl,redirectUrl}
