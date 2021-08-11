const db = require('../db');

const getProducts = async (req, res) => {

    const { user } = req;
    const {  categoria } = req.query;
    try {

        let query = 'select p.id, p.usuario_id, p.nome, p.estoque, p.categoria, p.preco, p.descricao, p.imagem from produtos p join usuarios u on p.usuario_id = u.id where u.id = $1'
        let array = []
        if(categoria){
            query += ' and p.categoria = $2';
            array = [user.id, categoria];
        }else {
            array = [user.id];
        }
        const products = await db.query(query, [...array]);
        res.status(200).json(products.rows);
        
    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);
    
    }

}

const getProductById = async (req, res) => {

    const { user } = req;
    const { id } = req.params;

    try {

        const query = 'select p.id, p.usuario_id, p.nome, p.estoque, p.categoria, p.preco, p.descricao, p.imagem from produtos p join usuarios u on p.usuario_id = u.id where p.id = $1 and u.id = $2';
        const products = await db.query(query, [id, user.id]);
        if(products.rowCount === 0){
            throw{
                status:404,
                message:'product not found'
            }
        }
        res.status(200).json(products.rows[0]);

        
    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);  
        
    }

}

const postProduct = async (req, res) => {
    
    const { user } = req;
    const { nome, estoque, categoria, preco, descricao, imagem } = req.body;
    const fields = { nome, estoque, preco, descricao };

    try {
        
        Object.entries(fields).map(([field, value]) => {
            if (!value) {
                throw {
                    status: 400,
                    message: `fill the field ${field}`
                }
            }
        })

        const query = 'insert into produtos (usuario_id, nome, estoque, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
        const productInsert = await db.query(query, [user.id, nome, estoque, categoria, preco, descricao, imagem]);
        if(productInsert.rows === 0){
            throw {
                status: 400,
                message: `the ${nome} product was not been registered`
            }
        }

        return res.status(200).json(`the ${nome} product has been registered`);
        
    } catch (error) {

        return res.status(error.status ? error.status : 400).json(error.message);
        
    }
}

const putProduct = async (req, res) => {

    const { user } = req;
    const { nome, estoque, categoria, preco, descricao, imagem } = req.body;
    const fields = { nome, estoque, preco, descricao };
    const { id } = req.params;

    try {

        Object.entries(fields).map(([field, value]) => {
            if (!value) {
                throw {
                    status: 400,
                    message: `fill the field ${field}`
                }
            }
        })

        const query = 'select p.id, p.usuario_id, p.nome, p.estoque, p.categoria, p.preco, p.descricao, p.imagem from produtos p join usuarios u on p.usuario_id = u.id where p.id = $1 and u.id = $2';
        const products = await db.query(query, [id, user.id]);
        if(products.rowCount === 0){
            throw{
                status:404,
                message:'product not found'
            }
        }

        const query2 = 'update produtos set nome = $1, estoque = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7';
        const productInsert = await db.query(query2, [nome, estoque, categoria, preco, descricao, imagem, id]);
        if(productInsert.rows === 0) {
            throw{
                status:400,
                message:`the ${nome} product was not been updated`
            }
        }
        return res.status(200).json(`the ${nome} product has been updated`);
        
    } catch (error) {
        
        return res.status(error.status ? error.status : 400).json(error.message);
        
    }

}

module.exports = {

    getProducts,
    getProductById,
    postProduct,
    putProduct

}