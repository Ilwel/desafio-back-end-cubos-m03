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

module.exports = {

    getProducts,
    getProductById,

}