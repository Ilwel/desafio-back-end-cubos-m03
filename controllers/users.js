const db = require('../db');
const securePassword = require('secure-password');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const secret = require('../jwtSecret');

const pwd = securePassword();

const createHash = async (password) => (await pwd.hash(Buffer.from(password))).toString('hex');
const verifyHash = async (password, hash) => await pwd.verify(Buffer.from(password), Buffer.from(hash, 'hex'));
const verifyAndResult = async (password, user) => {

    const result = await verifyHash(password, user.senha);

    switch (result) {
        case securePassword.INVALID_UNRECOGNIZED_HASH:
        case securePassword.INVALID:
            throw{
                status:400,
                message:'incorrect email or password'
            }
        case securePassword.VALID:
            break
        case securePassword.VALID_NEEDS_REHASH:
            const hash = await createHash(password);
            const query = 'update usuarios set senha = $1 where email = $2';
            const userInsert = await db.query(query, [hash, user.email]);
            if(userInsert.rows === 0) console.log('hash failed');
            else console.log('hash updated');
    }
}

const verifyValidationUser = (req) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        for (error of errors.array()) {
            if (error.param === 'email') {
                throw {
                    status: 400,
                    message: "the 'email' field is invalid"
                }
            } else if (error.param === 'senha') {
                throw {
                    status: 400,
                    message: "the 'senha' field must have at least 8 characters"
                }
            }
        }
    }

}

const postUserRegistration = async (req, res) => {

    const { nome, email, senha, nome_loja } = req.body;
    const fields = { nome, nome_loja, email, senha };
    try {

        Object.entries(fields).map(([field, value]) => {
            if (!value) {
                throw {
                    status: 400,
                    message: `fill the field ${field}`
                }
            }
        })

        const query = 'select * from usuarios where email = $1';
        const users = await db.query(query, [email]);
        if (users.rowCount > 0) {
            throw {
                status: 400,
                message: `the email ${email} already exists`
            }
        }

        verifyValidationUser(req);

        const hash = await createHash(senha);
        const query2 = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const userInsert = await db.query(query2, [nome, nome_loja, email, hash]);
        if (userInsert.rowCount === 0) {
            throw {
                status: 400,
                message: `the ${nome} user was not been registered`
            }
        }

        return res.status(200).json(`the ${nome} user has been registered`);

    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);

    }
}

const postUserLogin = async (req, res) => {

    const { email, senha } = req.body;
    const fields = { email, senha };
    try {

        Object.entries(fields).map(([field, value]) => {
            if (!value) {
                throw {
                    status: 400,
                    message: `fill the field ${field}`
                }
            }
        })

        const query = 'select * from usuarios where email = $1';
        const users = await db.query(query, [email]);
        if (users.rowCount === 0) {
            throw {
                status: 400,
                message: `incorrect email or password`
            }
        }

        const user = users.rows[0];
        await verifyAndResult(senha, user);
        const { senha:password, ...userReturn} = user;
        const token = jwt.sign( user , secret)

        res.status(200).json({
            usuario:userReturn,
            token:token
        });


    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);

    }
}

const getProfile = async (req, res) => {

    const { user } = req;
    res.status(200).json(user);

}

const putProfile = async (req, res) => {

    const { user } =  req;
    const { nome, email, senha, nome_loja } = req.body;
    const fields = { nome, email, senha, nome_loja };
    try {

        Object.entries(fields).map(([field, value]) => {
            if (!value) {
                throw {
                    status: 400,
                    message: `fill the field ${field}`
                }
            }
        })

        if(email !== user.email){

            const users = await db.query(query, [email])
            if(users.rowCount > 0){
                throw{
                    status:400,
                    message:`the email ${email} already exists`
                }
            }

        }
        const query = 'select * from usuarios where email = $1';

        verifyValidationUser(req);

        const hash = await createHash(senha);
        const query2 = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
        const userInsert = await db.query(query2, [nome, email, hash, nome_loja, user.id]);
        if(userInsert.rowCount === 0){
            throw{
                status:400,
                message:`the ${nome} user was not been updated`
            }
        } 
        return res.status(200).json(`the ${nome} user has been updated`);
        
    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);
        
    }

}

module.exports = {

    postUserRegistration,
    postUserLogin,
    getProfile,
    putProfile

}