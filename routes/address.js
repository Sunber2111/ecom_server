const router = require("express").Router();
const axios = require("axios");
const verifyToken = require("../middlewares/verify-token");
const Address = require("../models/address");
const User = require("../models/user");

router.post("/addresses", verifyToken, async (req, res) => {
  try {

    let address = new Address();
    address.user = req.decoded._id;
    address.country = req.body.country;
    address.fullName = req.body.fullName;
    address.streetAddress = req.body.streetAddress;
    address.city = req.body.city;
    address.state = req.body.state;
    address.zipCode = req.body.zipCode;
    address.phoneNumber = req.body.phoneNumber;

    await address.save();
    res.json({
      success: true,
      message: "Successfully added an address",
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/addresses", verifyToken, async (req, res) => {
  try {
    let addresses = await Address.find({ user: req.decoded._id });
    res.json({
      success: true,
      addresses: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/countries", async (req, res) => {
  try {
    let response = await axios.get("https://restcountries.eu/rest/v2/all");
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/addresses/:id', verifyToken, async(req,res)=>{
    try {
        let address = await Address.findOne({_id:req.params.id})
        res.json({
            success: true,
            address : address
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
})

router.put("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let foundAddress = await Address.findOne({ _id: req.params.id });
    if (foundAddress) {
      let address = new Address();
      if (req.body.user) foundAddress.user = req.decoded._id;
      if (req.body.country) foundAddress.country = req.body.country;
      if (req.body.fullName) foundAddress.fullName = req.body.fullName;
      if (req.body.streetAddress)
        foundAddress.streetAddress = req.body.streetAddress;
      if (req.body.city) foundAddress.city = req.body.city;
      if (req.body.state) foundAddress.state = req.body.state;
      if (req.body.zipCode) foundAddress.zipCode = req.body.zipCode;
      if (req.body.phoneNumber) foundAddress.phoneNumber = req.body.phoneNumber;
      await foundAddress.save();
      res.json({
        success: true,
        message: "Successfully update the address",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete('/addresses/:id',verifyToken,async(req,res)=>{
    try {
        let deleteAddress = await Address.remove({user : req.decoded._id ,_id : req.params.id})

        if(deleteAddress){
            res.json({
                success: true,
                message : "Address has been delete"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
})

router.put('/addresses/set/default',verifyToken,async(req,res)=>{
    try {
        const updateAddressUser = await User.findOneAndUpdate({_id: req.decoded._id},{$set : {address: req.body.id}})
        if(updateAddressUser){
            res.json({
                success:true,
                message :"Successfully set this address as default"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });   
    }
})
module.exports = router;