const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3426;

const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'new_employee_db',
    password: 'admin321',
    port: 5432,
});

// Helper function to generate ATS ticket IDs
function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ATS';
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.message, err.stack);
        process.exit(1);
    }
    console.log('Database connected successfully');
    release();
});

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://51.20.253.98:5500',
            'http://51.20.253.98:5500',
            'http://51.20.253.98:3426',
            'http://51.20.253.98:8049',
            'http://51.20.253.98:8050',
        ];

        console.log('CORS request from origin:', origin);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else if (origin === "null") {
            console.warn("Allowing null origin for local testing.");
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'favicon.ico'), (err) => {
        if (err) {
            console.log('Favicon not found, sending 204');
            res.status(204).end();
        }
    });
});

const initializeDatabase = async () => {
    try {
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
            ticket_id: { type: 'character varying', length: 100 },
            created_at: { type: 'timestamp without time zone', length: null },
            updated_at: { type: 'timestamp without time zone', length: null }
        };

        let invalidFields = [];
        schemaCheck.rows.forEach(row => {
            const expectedField = expected[row.column_name];
            if (expectedField && (row.data_type !== expectedField.type || row.character_maximum_length !== expectedField.length)) {
                invalidFields.push({
                    field: row.column_name,
                    found: `${row.data_type}(${row.character_maximum_length})`,
                    expected: `${expectedField.type}(${expectedField.length || 'null'})`
                });
            }
        });

        if (invalidFields.length > 0) {
            console.warn('Schema mismatch:', invalidFields);
            await pool.query('DROP TABLE IF EXISTS tickets CASCADE');
            await pool.query('DROP TABLE IF EXISTS comments CASCADE');
        }

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
                ticket_id VARCHAR(10) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
                comment TEXT NOT NULL,
                author VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database schema initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err.message, err.stack);
        throw err;
    }
};

app.post('/api/tickets', async (req, res) => {
    try {
        console.log('Received ticket data:', req.body);
        const { emp_id, emp_name, emp_email, department, priority, issue_type, description } = req.body;

        if (!emp_id || !emp_name || !emp_email || !department || !priority || !issue_type || !description) {
            console.log('Validation failed: Missing fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (emp_id.length > 20 || emp_name.length > 100 || emp_email.length > 100 ||
            department.length > 100 || priority.length > 20 || issue_type.length > 100) {
            console.log('Validation failed: Field length exceeded');
            return res.status(400).json({ error: 'Field length exceeded' });
        }

        if (/^VPPL(0[1-9]|[1-9][0-9])$/.test(emp_id)) {
            console.log('Invalid emp_id:', emp_id);
            return res.status(400).json({ error: 'Invalid Employee ID' });
        }

        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*[a-zA-Z]@venturebiz\.in$/;
        if (!emailRegex.test(emp_email)) {
            console.log('Invalid email:', emp_email);
            return res.status(400).json({ error: 'Email must be from @venturebiz.in domain' });
        }

        if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(emp_name)) {
            console.log('Invalid emp_name:', emp_name);
            return res.status(400).json({ error: 'Invalid employee name' });
        }

        if (description.length < 10 || !/[a-zA-Z]/.test(description) || description !== description.trim() || description.includes('  ')) {
            console.log('Invalid description:', description);
            return res.status(400).json({ error: 'Invalid description' });
        }

        const validDepartments = ['IT', 'Human Resources', 'Finance', 'Operations', 'Marketing', 'Other'];
        if (!validDepartments.includes(department)) {
            console.log('Invalid department:', department);
            return res.status(400).json({ error: 'Invalid department' });
        }

        const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
        if (!validPriorities.includes(priority)) {
            console.log('Invalid priority:', priority);
            return res.status(400).json({ error: 'Invalid priority' });
        }

        const validIssueTypes = ['Technical', 'Hardware', 'Software', 'Access', 'Account', 'Other'];
        if (!validIssueTypes.includes(issue_type)) {
            console.log('Invalid issue_type:', issue_type);
            return res.status(400).json({ error: 'Invalid issue type' });
        }

        const ticket_id = generateTicketId();

        const result = await pool.query(
            'INSERT INTO tickets (ticket_id, emp_id, emp_name, emp_email, department, priority, issue_type, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [ticket_id, emp_id, emp_name, emp_email, department, priority, issue_type, description]
        );

        console.log('Ticket created:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating ticket:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.get('/api/tickets', async (req, res) => {
    try {
        console.log('GET /api/tickets query:', req.query);
        const { emp_id, status } = req.query;
        let query = 'SELECT * FROM tickets';
        const params = [];
        const conditions = [];

        if (emp_id) {
            params.push(emp_id);
            conditions.push(`emp_id = $${params.length}`);
        }
        if (status) {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        console.log('Tickets fetched:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tickets:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.get('/api/tickets/:id', async (req, res) => {
    try {
        console.log('GET /api/tickets/:id id:', req.params.id);
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM tickets WHERE ticket_id = $1', [id]);

        if (result.rows.length === 0) {
            console.log('Ticket not found:', id);
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching ticket:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.put('/api/tickets/:id/status', async (req, res) => {
    try {
        console.log('PUT /api/tickets/:id/status id:', req.params.id, 'body:', req.body);
        const { id } = req.params;
        const { status } = req.body;

        if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
            console.log('Invalid status:', status);
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(
            'UPDATE tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            console.log('Ticket not found:', id);
            return res.status(404).json({ error: 'Ticket not found' });
        }

        console.log('Ticket status updated:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating ticket status:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.get('/api/tickets/:id/comments', async (req, res) => {
    try {
        console.log('GET /api/tickets/:id/comments id:', req.params.id);
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at ASC',
            [id]
        );

        console.log('Comments fetched:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching comments:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.get('/api/tickets/stVPPL', async (req, res) => {
    try {
        console.log('GET /api/tickets/stats');
        const result = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM tickets
            GROUP BY status
        `);

        const stats = { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
        result.rows.forEach(row => {
            stats[row.status] = parseInt(row.count);
        });

        console.log('Stats fetched:', stats);
        res.json(stats);
    } catch (err) {
        console.error('Error fetching stats:', err.message, err.stack);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

const gracefulShutdown = async () => {
    console.log('Shutting down server...');
    try {
        await pool.end();
        console.log('Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err.message, err.stack);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        }).on('error', (err) => {
            console.error('Server startup error:', err.message, err.stack);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message, err.stack);
        process.exit(1);
    }
};

startServer();
