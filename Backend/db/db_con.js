const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_OWNER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
})

async function connectDb(){
    try{
        await pool.query("SELECT NOW ();");
        console.log("Successfully Connected the database");
    }catch(err){
        console.error("Failed to connect to the database");
        console.error(`Error details: ${err.message}`);
    }
}
module.exports = { pool, connectDb };