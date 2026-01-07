// =====================
// Backend: server.js (FIXED)
// =====================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3426;

// =====================
// Middleware
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// PostgreSQL Pool
// =====================
const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'new_employee_db',
    password: 'admin321',
    port: 5432,
});

// =====================
// Ticket ID Generator (VPPLxxxxxx)
// =====================
function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'VPPL';
    for (let i = 0; i < 6; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// =====================
// DB Connection Test
// =====================
pool.connect((err, client, release) => {
    if (err) {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    }
    console.log('Database connected successfully');
    release();
});

// =====================
// CORS
// =====================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

// =====================
// Serve Frontend
// =====================
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/favicon.ico', (req, res) => res.status(204).end());

// =====================
// DB Initialization
// =====================
const initializeDatabase = async () => {
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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
            comment TEXT NOT NULL,
            author VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized');
};

// =====================
// API ROUTES
// =====================

// 🔹 Create Ticket
app.post('/api/tickets', async (req, res) => {
    const { emp_id, emp_name, emp_email, department, priority, issue_type, description } = req.body;

    if (!emp_id || !emp_name || !emp_email || !department || !priority || !issue_type || !description) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const ticket_id = generateTicketId();

    const result = await pool.query(
        `INSERT INTO tickets
         (ticket_id, emp_id, emp_name, emp_email, department, priority, issue_type, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [ticket_id, emp_id, emp_name, emp_email, department, priority, issue_type, description]
    );

    res.status(201).json(result.rows[0]);
});

// 🔹 Get All Tickets
app.get('/api/tickets', async (req, res) => {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json(result.rows);
});

// 🔹 Get Ticket by NUMERIC ID ✅ (FIX)
app.get('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM tickets WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(result.rows[0]);
});

// 🔹 Update Ticket Status ✅ (MATCHES FRONTEND)
app.put('/api/tickets/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status required' });
    }

    const result = await pool.query(
        `UPDATE tickets
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(result.rows[0]);
});

// 🔹 Add Comment
app.post('/api/tickets/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { comment, author } = req.body;

    if (!comment || !author) {
        return res.status(400).json({ error: 'Comment & author required' });
    }

    await pool.query(
        `INSERT INTO comments (ticket_id, comment, author)
         VALUES ($1,$2,$3)`,
        [id, comment, author]
    );

    res.json({ message: 'Comment added' });
});

// =====================
// START SERVER
// =====================
const startServer = async () => {
    await initializeDatabase();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
