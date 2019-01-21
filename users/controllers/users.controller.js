const UserModel = require('../models/users.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    console.log('Request is' , req.body);
    req.body.password="1111";
    UserModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
            console.log("Check write status", result);
        });
};

exports.authenticate = (req, res) => {
    
    UserModel.findByEmail(req.body.email)
        .then((result) => {
            if(result[0].password === req.body.password){
                console.log("Authentication Successful")
                res.status(200).send(JSON.stringify(result));
            }
            else{
                
                res.status(401).send("Error"); 
            }
            console.log("Check write status", result);
        });
};

exports.list = (req, res) => {
    console.log("Still coming inside search all users");
    let limit =25;
    let page = 0;
    
    
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    console.log("Find By id is "+ req);
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};
