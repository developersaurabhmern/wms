
var { uploadtransactionkarvy , uploadtransactioncams , uploadtransactioncams2a , uploadfoliocams , uploadfoliokarvy } = require('../model/upload.model')

async function UploadTransKarvy(req, res) {
    try {
        var hh = req.body;
        const user = await uploadtransactionkarvy(hh);
      //  console.log("fffuser=",user)
        if (user != "" && user != undefined) {
       //     console.log("user=",user)
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
        
   
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function UploadTransCams(req, res) {
    try {
        var hh = req.body;
        const user = await uploadtransactioncams(hh);
       // console.log("fffuser=",user)
        if (user != "" && user != undefined) {
       //     console.log("user=",user)
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
        
   
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function UploadTransCams2A(req, res) {
    try {
        var hh = req.body;
        const user = await uploadtransactioncams2a(hh);
      //  console.log("fffuser=",user)
        if (user != "" && user != undefined) {
        //    console.log("user=",user)
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
        
   
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function UploadFolioCams(req, res) {
    try {
        var hh = req.body;
        const user = await uploadfoliocams(hh);
       // console.log("fffuser=",user)
        if (user != "" && user != undefined) {
        //    console.log("user=",user)
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
        
   
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function UploadFolioKarvy(req, res) {
    try {
        var hh = req.body;
        const user = await uploadfoliokarvy(hh);
        if (user != "" && user != undefined) {
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
        
   
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

module.exports = { UploadTransKarvy , UploadTransCams , UploadTransCams2A , UploadFolioCams , UploadFolioKarvy }