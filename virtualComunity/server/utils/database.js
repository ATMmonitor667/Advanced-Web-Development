import pg from 'pg'
const {Pool} = pg

import dotenv from 'dotenv'
dotenv.config()

const database = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
})

export default database