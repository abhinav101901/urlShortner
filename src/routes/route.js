const express=require("express");
const router=express.Router();
const UrlController=require("../Controller/urlController")




router.post("/url/shorten",UrlController.createShortUrl)
router.get("/:urlCode",UrlController.redirectUrl)
router.all("/*",function(req,res){
    return res.status(400).send({status:false,message:"Invalid URL"})
})
module.exports=router;