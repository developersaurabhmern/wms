
var { checkLoginDetail, signupDetail, checkclientDetail, updateDetail ,getclientDetail} = require('../model/login.model')

async function GetLoginDetail(req, res) {
    try {
        let email = req.body.email || {};
        let pass = req.body.password || {};
        const user = await checkLoginDetail(email, pass);
        if (user != "") {
          //  console.log("user=",user)
            resdata = {
                status: 200,
                message: 'Data found !',
                data: user,
            }
        } else {
            resdata = {
                status: 400,
                message: 'Data not found !',
            }
        }
        res.json(resdata);
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function RegistrationDetail(req, res) {
    
    try {
        let name = req.body.name || {};
        let email = req.body.email || {};
        let mobile = req.body.mobile || {};
        let utype = req.body.utype || {};
        let pass = req.body.pass || {};
        let pan = req.body.pan || {};
        let iin = req.body.iin;
        let leaderpan = req.body.leaderpan;
        let relation = req.body.relation;
        let dob = req.body.dob || {};
        let address = req.body.address;
        let pincode = req.body.pincode;
        let city = req.body.city;
        let state = req.body.state ;
        let country = req.body.country;
        let iin_portfolio = req.body.check;
        pan = pan.toUpperCase();
        leaderpan = leaderpan.toUpperCase();
        if (utype === "Client") {
            const response = await signupDetail(name, email, mobile,pass, utype, pan,iin, leaderpan, relation, dob, address, pincode, city, state, country, iin_portfolio);
            console.log("wwwwwwwww=", response.data)
            console.log("wwww=", response.data.status)
            if(response.data.status === 200){
                resdata = {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data,
                }
            }else{
                resdata = {
                    status: response.data.status,
                    message: response.data.message,
                }
            }
            
        } else {
            const user = await checkclientDetail(email, mobile);
            if (user != "" && user != null) {
                //console.log("user=", user)
                resdata = {
                    status: 400,
                    message: 'Email or mobile already exists !',
                    data: user,
                }
            } else {
                const response = await signupDetail(name, email, mobile,pass, utype, pan, leaderpan, relation, dob, address, pincode, city, state, country,iin_portfolio );
               // console.log("user blank=", user)
                resdata = {
                    status: 200,
                    message: 'Data found !',
                }
            }
        }
        res.json(resdata);
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function Updateuser(req, res) {
    
    try {
        let name = req.body.name || {};
        let email = req.body.email || {};
        let mobile = req.body.mobile || {};
        let utype = req.body.utype || {};
        let pass = req.body.pass || {};
        let pan = req.body.pan || {};
        let leaderpan = req.body.leaderpan;
        let relation = req.body.relation;
        let dob = req.body.dob || {};
        let address = req.body.address;
        let pincode = req.body.pincode;
        let city = req.body.city;
        let state = req.body.state ;
        let country = req.body.country;
        let iin_portfolio = req.body.check;
        pan = pan.toUpperCase();
        leaderpan = leaderpan.toUpperCase();
        if (utype === "Client") {
            const response = await updateDetail(name, email, mobile,pass, utype, pan, leaderpan, relation, dob, address, pincode, city, state, country, iin_portfolio);
            console.log("wwwwwwwww=", response)
            console.log("wwww=", response.data.status)
            if(response.data.status === 200){
                resdata = {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data,
                }
            }else{
                resdata = {
                    status: response.data.status,
                    message: response.data.message,
                }
            }
            
        } else {
            const user = await checkclientDetail(email, mobile);
            if (user != "" && user != null) {
                //console.log("user=", user)
                resdata = {
                    status: 400,
                    message: 'Email or mobile already exists !',
                    data: user,
                }
            } else {
                const response = await updateDetail(name, email, mobile,pass, utype, pan, leaderpan, relation, dob, address, pincode, city, state, country,iin_portfolio );
               // console.log("user blank=", user)
                resdata = {
                    status: 200,
                    message: 'Data found !',
                }
            }
        }
        res.json(resdata);
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function GetClientDetail(req, res) {
    try {
        if(req.body.name != undefined && req.body.pan!= undefined && req.body.gpan != undefined){
        const user = await getclientDetail(req.body.name, req.body.pan, req.body.gpan);
        console.log("fffuser=",user)
        if (user != "" && user != undefined) {
            console.log("user=",user)
            resdata = {
                status: 200,
                message: 'Data found !',
                data: user,
            }
            res.json(resdata);
        } else {
            resdata = {
                status: 400,
                message: 'Data not found !',
            }
            res.json(resdata);
        }
        
    }else{
        resdata = {
            status: 400,
            message: 'Key not found !',
        }
        res.json(resdata);
    }
    } catch (error) {
        res.status(500).json({ error: error })
    }
}



module.exports = { GetLoginDetail, RegistrationDetail, Updateuser, GetClientDetail  }