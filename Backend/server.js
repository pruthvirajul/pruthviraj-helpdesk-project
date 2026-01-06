// Import required modules
const express = require('express'); 
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3426;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL pool
const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'new_employee_db',
    password: 'admin321',
    port: 5432,
});

// Generate random VPPL ticket IDs (total 10 chars)
function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'VPPL';
    for (let i = 0; i < 6; i++) { // 4 + 6 = 10 chars
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.message, err.stack);
        process.exit(1);
    }
    console.log('Database connected successfully');
    release();
});

// Enable CORS for allowed origins
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://51.20.253.98:5500',
            'http://51.20.253.98:3426',
            'http://51.20.253.98:8049',
            'http://51.20.253.98:8050',
        ];
        if (!origin || allowedOrigins.includes(origin) || origin === "null") {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// Initialize database tables
const initializeDatabase = async () => {
    try {
        // Drop tables if schema mismatch
        const schemaCheck = await pool.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'tickets';
        `);

        const expected = {
            emp_id: { type: 'character varying', length: 20 },
            emp_name: { type: 'character varying', length: 100 },
            emp_email: { type: 'character varying', length: 100 },
            department: { type: 'character varying', length: 100 },
            priority: { type: 'character varying', length: 20 },
            issue_type: { type: 'character varying', length: 100 },
            description: { type: 'text', length: null },
            status: { type: 'character varying', length: 20 },
            ticket_id: { type: 'character varying', length: 10 },
            created_at: { type: 'timestamp without time zone', length: null },
            updated_at: { type: 'timestamp without time zone', length: null }
        };

        let invalidFields = [];
        schemaCheck.rows.forEach(row => {
            const expectedField = expected[row.column_name];
            if (expectedField && (row.data_type !== expectedField.type || row.character_maximum_length !== expectedField.length)) {
                invalidFields.push(row.column_name);
            }
        });

        if (invalidFields.length > 0) {
            await pool.query('DROP TABLE IF EXISTS comments CASCADE');
            await pool.query('DROP TABLE IF EXISTS tickets CASCADE');
        }

        // Tickets table
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

        // Comments table
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

// API to create a new ticket
app.post('/api/tickets', async (req, res) => {
    console.log('Received ticket data:', req.body);
    try {
        const { emp_id, emp_name, emp_email, department, priority, issue_type, description } = req.body;
        if (!emp_id || !emp_name || !emp_email || !department || !priority || !issue_type || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate VPPL Employee ID
        if (!/^VPPL(0[1-9]|[1-9][0-9])$/.test(emp_id)) {
            return res.status(400).json({ error: 'Invalid Employee ID format' });
        }

        // Validate venturebiz.in email
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

// API to get all tickets
// Get a single ticket by ticket_id
app.get('/api/tickets/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM tickets WHERE ticket_id = $1',
            [ticket_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching ticket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start server
const startServer = async () => {
    await initializeDatabase();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
