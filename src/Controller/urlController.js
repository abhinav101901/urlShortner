const UrlModel=require("../model/urlModel");
const shortid=require("shortid");
const axios=require("axios")


const createShortUrl=async function(req,res){


    let obj={};
    let data =req.body;

if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Provide data in body"})
if(!data.longUrl) return res.status(400).send({status:false,message:"Provide Long URL"})

let urlfound= false;
await axios.get(data.longUrl)
.then((result)=>{
    if(result.status==200||result.status==201)
    urlfound=true;
})
.catch((error)=>{})

if(urlfound==false) return res.status(400).send({status:false,message:"Invalid Link"})



    let urlCode= shortid.generate();
    let shortUrl= "http://localhost:3000/"+urlCode;
    obj.longUrl=data.longUrl;
    obj.shortUrl=shortUrl;
    obj.urlCode=urlCode;

   
    let created = await UrlModel.create(obj)
    return res.status(201).send({status:true,data:created})
}

const redirectUrl=async function(req,res){
    let urlCode=req.params.urlCode;
    let getUrl= await UrlModel.findOne({urlCode:urlCode}).select({longUrl:1,_id:0})
    return res.status(200).send({status:true,data:getUrl})
}



module.exports.createShortUrl=createShortUrl
module.exports.redirectUrl=redirectUrl