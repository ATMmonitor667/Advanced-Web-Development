import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import cors from 'cors'
import { checkDatabaseConnection } from './database.js'
import customItemsRouter from './routes/customItems.js'
import optionsRouter from './routes/options.js'


dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors())

// API routes
app.use('/api/custom-items', customItemsRouter)
app.use('/api/options', optionsRouter)

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'lightning.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'lightning.png')))
    app.use(express.static('public'))
}

// specify the api path for the server to use


if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

// Check database connection on startup
checkDatabaseConnection()

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})