const db = require('../db');
const jwt = require('jsonwebtoken');
const secret = require('../jwtSecret');

const checkLogin = async (req, res, next) => {

    try {
    
        const { authorization } = req.headers;
        if(!authorization) {
            throw {
                status:400,
                message:'the authorization field is missing from the header'
            }
        }

        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, secret);
        const query = 'select * from usuarios where id = $1';
        const users = await db.query(query, [id]);
        if(users.rowCount === 0){
            throw{
                status:404,
                message:'user not found'
            }
        }

        const { senha, ...userReturn} = users.rows[0];
        req.user = userReturn;
        next();
        
    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);
        
    }
    

}

module.exports = checkLogin;