const { Pool } = require('pg')
// const pool = new Pool({

//     user:'postgres',
//     host:'localhost',
//     database:'market_cubos',
//     password:'viana1920',
//     port: 5432

// });

//heroku config
const pool = new Pool({

  user: 'rhhsgcwvllivtc',
  host: 'ec2-44-195-16-34.compute-1.amazonaws.com',
  database: 'dfq25tim3ja2gl',
  password: '7f8bc9910ae38d8b4e8b59dd156c92502c507f2149ca25126c34e345ed6eb0a8',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }

})

const query = (text, param) => pool.query(text, param);

module.exports = {

  query

}


