import { pool } from './database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resetDatabase = async () => {
    try {
        // Read the init.sql file
        const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8')

        // Execute the SQL
        await pool.query(initSQL)

        console.log('✅ Database reset successfully!')
        console.log('📊 Tables created and seeded with sample data')

        pool.end()
    } catch (error) {
        console.error('❌ Error resetting database:', error.message)
        pool.end()
    }
}

resetDatabase()
