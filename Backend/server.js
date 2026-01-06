// =====================
// Backend: server.js
// =====================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3426;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Pool
const pool = new Pool({
    user: 'postgres',
    host: 'postgres', // your DB host
    database: 'new_employee_db',
    password: 'admin321',
    port: 5432,
});

// Generate random VPPL ticket IDs (VPPL + 6 random chars = 10)
function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'VPPL';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Test DB connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('Database connected successfully');
    release();
});

// CORS
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://51.20.253.98:5500',
            'http://51.20.253.98:3426',
            'http://51.20.253.98:8049',
            'http://51.20.253.98:8050', // frontend origin
        ];
        if (!origin || allowedOrigins.includes(origin) || origin === "null") {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
}));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../Frontend')));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'favicon.ico'), err => {
        if (err) res.status(204).end();
    });
});

// =====================
// Database Initialization
// =====================
const initializeDatabase = async () => {
    try {
        // Create tickets table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id SERIAL PRIMARY KEY,
                ticket_id VARCHAR(10) UNIQUE NOT NULL,
                emp_id VARCHAR(20) NOT NULL,
                emp_name VARCHAR(100) NOT NULL,
                emp_email VARCHAR(100) NOT NULL,
                department VARCHAR(100) NOT NULL,
                priority VARCHAR(20) NOT NULL,
                issue_type VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'Open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create comments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                ticket_id VARCHAR(10) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
                comment TEXT NOT NULL,
                author VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database schema initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }
};

// =====================
// API Routes
// =====================

// Create a new ticket
app.post('/api/tickets', async (req, res) => {
    try {
        const { emp_id, emp_name, emp_email, department, priority, issue_type, description } = req.body;
        if (!emp_id || !emp_name || !emp_email || !department || !priority || !issue_type || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Employee ID validation
        if (!/^VPPL(0[1-9]|[1-9][0-9])$/.test(emp_id)) {
            return res.status(400).json({ error: 'Invalid Employee ID format' });
        }

        // Email validation
        if (!/^[a-zA-Z][a-zA-Z0-9._-]*[a-zA-Z]@venturebiz\.in$/.test(emp_email)) {
            return res.status(400).json({ error: 'Email must be from @venturebiz.in domain' });
        }

        const ticket_id = generateTicketId();

        const result = await pool.query(
            `INSERT INTO tickets 
            (ticket_id, emp_id, emp_name, emp_email, department, priority, issue_type, description) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [ticket_id, emp_id, emp_name, emp_email, department, priority, issue_type, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch all tickets
app.get('/api/tickets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch single ticket by ticket_id
app.get('/api/tickets/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tickets WHERE ticket_id = $1', [ticket_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =====================
// PATCH: Update ticket status
// =====================
app.patch('/api/tickets/:ticket_id/status', async (req, res) => {
    const { ticket_id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const result = await pool.query(
            `UPDATE tickets 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE ticket_id = $2 
             RETURNING *`,
            [status, ticket_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating ticket status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =====================
// Start Server
// =====================
const startServer = async () => {
    await initializeDatabase();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
