import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

// Render databases always need SSL
const config = {
    user: process.env.PGUSER,
    password: String(process.env.PGPASSWORD),
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE,
    ssl: {
        rejectUnauthorized: false
    }
}

export const pool = new pg.Pool(config)

// Function to check database connection
export const checkDatabaseConnection = async () => {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT NOW()')
        client.release()
        console.log('✅ Database connected successfully!')
        console.log('📅 Database time:', result.rows[0].now)
        return { success: true, timestamp: result.rows[0].now }
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        return { success: false, error: error.message }
    }
}