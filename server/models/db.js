const Pool = require("pg").Pool


const pool = new Pool({
    user:"postgres",
    password:"password",
    database:"ekart",
    port:5432,
    host:"localhost"
})

module.exports = pool