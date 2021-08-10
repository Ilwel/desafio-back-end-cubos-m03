const db = require('../db');
const securePassword = require('secure-password');

const pwd = securePassword();

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
        const user = await db.query(query, [email]);
        if(user.rowCount > 0){
            throw {
                status:400,
                message: `the email ${email} already exists`
            }
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        const query2 = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const userInsert = await db.query(query2, [nome, nome_loja, email, hash]);
        if(userInsert.rowCount === 0){
            throw{
                status:400,
                message:'`the ${nome} user was not been registered`'
            }
        }
        res.status(200).json(`the ${nome} user has been registered`)
    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);

    }

}

const postUserLogin = async (req, res) => {


}

module.exports = {

    postUserRegistration,

}