const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {

    try {
        const authHeader = req.header('Authorization');
    
        const token = authHeader && authHeader.split(' ')[1];
    
        if(!token){
            return res.send({
                message: "Access Denied!"
            });
        };
        
        const SECRET_KEY = "p3rc4y4l4hsygb3rp1s4h1tumud4h"

        const verified = jwt.verify(token, SECRET_KEY);

        req.user = verified;

        next();

    } catch (error) {
      res.send({
          message: "Invalid Token!"
      });  
    };
};