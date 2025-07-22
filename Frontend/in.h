<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ATS Help Desk</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --secondary: #3f37c9;
            --accent: #4895ef;
            --light: #f8f9fa;
            --dark: #212529;
            --success: #4cc9f0;
            --warning: #f8961e;
            --danger: #f72585;
            --gray: #6c757d;
            --open: #4cc9f0;
            --in-progress: #f8961e;
            --resolved: #4ad66d;
            --closed: #6c757d;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: white;
            min-height: 100vh;
            color: var(--dark);
        }

        .banner {
            background: linear-gradient(to right, var(--primary), var(--secondary));
            color: white;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        .banner h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            animation: slideInDown 0.8s ease;
        }

        .banner p {
            font-size: 1.1rem;
            opacity: 0.9;
            animation: slideInUp 0.8s ease;
        }

        .banner::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 Q50,80 0,100 Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: 100% 100%;
            opacity: 0.2;
        }

        header {
            position: relative;
            text-align: center;
            height: 140px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #fff;
            border-radius: 15px;
            overflow: hidden;
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }

        header h1 {
            margin: 0;
            font-size: 2.5rem;
            color: white;
            font-weight: 700;
            letter-spacing: 1px;
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        header p {
            font-weight: 300;
            font-size: 1.1rem;
            margin-top: 10px;
            opacity: 0.9;
        }

        @keyframes moveCircles {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-50%) translateX(-50%); }
            100% { transform: translateY(0) translateX(0); }
        }

        .banner-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
        }

        .circle {
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: moveCircles 15s infinite linear;
        }

        .circle:nth-child(1) {
            top: 10%;
            left: 20%;
            animation-duration: 15s;
        }

        .circle:nth-child(2) {
            top: 50%;
            left: 70%;
            animation-duration: 20s;
            animation-direction: reverse;
        }

        .circle:nth-child(3) {
            top: 80%;
            left: 40%;
            animation-duration: 25s;
        }

        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            margin-bottom: 2rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeIn 0.8s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card h2 {
            color: var(--primary);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--dark);
        }

        #description {
            height: 140px;
            resize: none;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }

        .invalid-feedback {
            color: var(--danger);
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: none;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--secondary);
            transform: translateY(-2px);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .form-actions {
            text-align: center;
            margin-top: 2rem;
        }

        .ticket-preview {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(67, 97, 238, 0.05);
            border-left: 4px solid var(--primary);
            border-radius: 0 6px 6px 0;
            display: none;
        }

        .ticket-preview h3 {
            margin-bottom: 1rem;
            color: var(--primary);
        }

        .ticket-preview p {
            margin-bottom: 0.5rem;
        }

        .ticket-preview strong {
            color: var(--dark);
        }

        /* My Tickets Section */
        .tickets-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        .tickets-table th,
        .tickets-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        .tickets-table th {
            background: rgba(67, 97, 238, 0.05);
            font-weight: 600;
            color: var(--primary);
        }

        .tickets-table tr:hover {
            background: rgba(67, 97, 238, 0.03);
        }

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .status-open {
            background: rgba(76, 201, 240, 0.1);
            color: var(--open);
        }

        .status-in-progress {
            background: rgba(248, 150, 30, 0.1);
            color: var(--in-progress);
        }

        .status-resolved {
            background: rgba(74, 214, 109, 0.1);
            color: var(--resolved);
        }

        .status-closed {
            background: rgba(108, 117, 125, 0.1);
            color: var(--closed);
        }

        .priority-high {
            color: var(--danger);
            font-weight: 600;
        }

        .priority-critical {
            color: var(--danger);
            font-weight: 600;
            animation: pulse 1.5s infinite;
        }

        .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            margin: 0 0.25rem;
            transition: transform 0.2s ease;
        }

        .action-btn:hover {
            transform: scale(1.2);
        }

        .btn-view {
            color: var(--accent);
        }

        .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .filter-group {
            flex: 1;
            min-width: 200px;
        }

        .filter-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--dark);
        }

        .filter-control {
            width: 100%;
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
        }

        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            padding: 2rem;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            text-align: center;
        }

        .modal.active .modal-content {
            transform: translateY(0);
        }

        .modal-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            color: var(--success);
        }

        .modal h3 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .modal p {
            margin-bottom: 2rem;
            color: var(--gray);
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideInDown {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slideInUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }

        .bounce {
            animation: bounce 1s;
        }

        /* No Data State */
        .no-data {
            text-align: center;
            padding: 2rem;
        }

        .no-data img {
            width: 100px;
            height: 100px;
            opacity: 0.5;
        }

        .no-data p {
            font-size: 0.9rem;
            color: var(--gray);
            margin-top: 10px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .banner h1 {
                font-size: 2rem;
            }

            .card {
                padding: 1.5rem;
            }

            .tickets-table {
                display: block;
                overflow-x: auto;
            }

            .filters {
                flex-direction: column;
                gap: 1rem;
            }

            .filter-group {
                min-width: 100%;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="banner-background">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
        <h1><i class="fas fa-headset"></i> ATS Help Desk</h1>
        <p>Submit your queries and issues here. Our team will get back to you shortly.</p>
    </header>

    <div class="container">
        <div class="card">
            <h2><i class="fas fa-ticket-alt"></i> Create New Ticket</h2>

            <form id="ticketForm">
                <div class="form-group">
                    <label for="empId">Employee ID</label>
                    <input type="text" id="empId" class="form-control" placeholder="ATS0xxx" pattern="^[ATS]{3}0(?!000)[0-9]{3}$" minlength="7" maxlength="7" required>
                    <div class="invalid-feedback">Please enter a valid Employee ID (ATS0 followed by 3 digits, not all zeros)</div>
                </div>

                <div class="form-group">
                    <label for="empName">Full Name</label>
                    <input type="text" id="empName" class="form-control" placeholder="Employee Name" 
                           pattern="^[A-Za-z]+(?: [A-Za-z]+)*$" 
                           title="Only alphabets and single spaces between words, no leading/trailing spaces" 
                           required minlength="3" maxlength="40">
                    <div class="invalid-feedback">Please enter a valid name (only alphabets and single spaces between words, no leading/trailing spaces)</div>
                </div>

                <div class="form-group">
                    <label for="empEmail">Email Address</label>
                    <input type="email" id="empEmail" class="form-control" 
                           placeholder="Employee Email" 
                           pattern="^[a-zA-Z][a-zA-Z0-9._-]*@(?:gmail\.com|outlook\.com|[\w-]+\.(?:co|in|org))$" 
                           required minlength="8" maxlength="50">
                    <div class="invalid-feedback">Email must start with a letter, contain at least 3 alphabets, and have a domain of gmail.com, outlook.com, or *.co/in/org</div>
                </div>

                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" class="form-control" required>
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Other">Other</option>
                    </select>
                    <div class="invalid-feedback">Please select a department</div>
                </div>

                <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority" class="form-control" required>
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                    <div class="invalid-feedback">Please select a priority level</div>
                </div>

                <div class="form-group">
                    <label for="issueType">Issue Type</label>
                    <select id="issueType" class="form-control" required>
                        <option value="">Select Issue Type</option>
                        <option value="Technical">Technical Issue</option>
                        <option value="Hardware">Hardware Problem</option>
                        <option value="Software">Software Problem</option>
                        <option value="Access">Access Request</option>
                        <option value="Account">Account Issue</option>
                        <option value="Other">Other</option>
                    </select>
                    <div class="invalid-feedback">Please select an issue type</div>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" class="form-control" rows="5" placeholder="Describe your issue in detail..." 
                              minlength="10" 
                              maxlength="200"
                              title="Minimum 10 characters with letters, no leading/trailing spaces, no consecutive spaces" 
                              required></textarea>
                    <div class="invalid-feedback">Please provide a valid description (min 10 chars with letters, no leading/trailing spaces, no consecutive spaces)</div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Submit Ticket
                    </button>
                </div>
            </form>

            <div id="ticketPreview" class="ticket-preview">
                <h3><i class="fas fa-eye"></i> Ticket Preview</h3>
                <p><strong>Ticket ID:</strong> <span id="previewTicketId"></span></p>
                <p><strong>Employee ID:</strong> <span id="previewEmpId"></span></p>
                <p><strong>Name:</strong> <span id="previewEmpName"></span></p>
                <p><strong>Department:</strong> <span id="previewDepartment"></span></p>
                <p><strong>Priority:</strong> <span id="previewPriority"></span></p>
                <p><strong>Issue Type:</strong> <span id="previewIssueType"></span></p>
                <p><strong>Description:</strong> <span id="previewDescription"></span></p>
            </div>
        </div>

        <div class="card" id="myTicketsCard" style="display: none;">
            <h2><i class="fas fa-ticket-alt"></i> My Tickets</h2>
            <div class="filters">
                <div class="filter-group">
                    <label for="filterStatusEmp">Status</label>
                    <select id="filterStatusEmp" class="filter-control">
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>
            <table class="tickets-table">
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Department</th>
                        <th>Issue Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="myTicketsBody">
                    <!-- Employee's tickets will be loaded here -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="modal">
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle bounce"></i>
            </div>
            <h3>Ticket Submitted Successfully!</h3>
            <p>Your ticket has been created and assigned a reference number. Our team will get back to you shortly.</p>
            <button class="btn btn-primary" onclick="closeModal()">
                <i class="fas fa-thumbs-up"></i> Got it!
            </button>
        </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div id="ticketModal" class="modal">
        <div class="modal-content" style="max-width: 700px; text-align: left;">
            <div class="modal-header">
                <h3><i class="fas fa-ticket-alt"></i> <span id="modalTicketId"></span></h3>
                <button class="modal-close" onclick="closeTicketModal()">×</button>
            </div>

            <div class="ticket-details">
                <p><strong>Status:</strong> <span id="modalStatus"></span></p>
                <p><strong>Priority:</strong> <span id="modalPriority"></span></p>
                <p><strong>Department:</strong> <span id="modalDepartment"></span></p>
                <p><strong>Issue Type:</strong> <span id="modalIssueType"></span></p>
                <p><strong>Created:</strong> <span id="modalCreated"></span></p>
                <p><strong>Description:</strong></p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-top: 0.5rem;">
                    <span id="modalDescription"></span>
                </div>
            </div>

            <div style="margin-top: 2rem;">
                <h4><i class="fas fa-comments"></i> Comments</h4>
                <div id="commentsContainer" style="margin-top: 1rem;">
                    <!-- Comments will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentEmpId = null;
        let currentTicketId = null;

        // Custom validation for employee name
        function validateEmpName(name) {
            // Check for leading/trailing spaces
            if (name !== name.trim()) {
                return false;
            }

            // Check for consecutive spaces
            if (name.includes('  ')) {
                return false;
            }

            // Check if it contains only letters and single spaces
            return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name);
        }

        // Custom validation for email
        function validateEmail(email) {
            // Check pattern: starts with letter, followed by any allowed chars, then @domain
            const regex = /^[a-zA-Z][a-zA-Z0-9._-]*@(?:gmail\.com|outlook\.com|[\w-]+\.(?:co|in|org))$/;
            if (!regex.test(email)) {
                return false;
            }

            // Count alphabetic characters in local part
            const localPart = email.split('@')[0];
            const alphaCount = (localPart.match(/[a-zA-Z]/g) || []).length;
            return alphaCount >= 3;
        }

        // Custom validation for description
        function validateDescription(desc) {
            // Check for leading/trailing spaces
            if (desc !== desc.trim()) {
                return false;
            }

            // Check for consecutive spaces
            if (desc.includes('  ')) {
                return false;
            }

            // Check minimum length
            if (desc.length < 10) {
                return false;
            }

            // Check if it contains at least some letters (not all numbers/symbols)
            if (!/[a-zA-Z]/.test(desc)) {
                return false;
            }

            // Check if it's not all numbers
            if (/^\d+$/.test(desc.replace(/\s/g, ''))) {
                return false;
            }

            return true;
        }

        // Real-time validation function
        function validateField(field) {
            const feedback = field.nextElementSibling;

            if (field.id === 'empName') {
                if (!validateEmpName(field.value)) {
                    field.classList.add('is-invalid');
                    feedback.style.display = 'block';
                    return false;
                }
            } else if (field.id === 'empEmail') {
                if (!validateEmail(field.value)) {
                    field.classList.add('is-invalid');
                    feedback.style.display = 'block';
                    return false;
                }
            } else if (field.id === 'description') {
                if (!validateDescription(field.value)) {
                    field.classList.add('is-invalid');
                    feedback.style.display = 'block';
                    return false;
                }
            } else if (!field.checkValidity()) {
                field.classList.add('is-invalid');
                feedback.style.display = 'block';
                return false;
            }

            field.classList.remove('is-invalid');
            feedback.style.display = 'none';
            return true;
        }

        // Add real-time validation listeners
        document.addEventListener('DOMContentLoaded', function() {
            const formControls = document.querySelectorAll('.form-control');
            formControls.forEach(control => {
                // Use 'input' for text inputs and textarea, 'change' for select
                const eventType = control.tagName === 'SELECT' ? 'change' : 'input';
                control.addEventListener(eventType, () => validateField(control));
            });
        });

        // Form validation and submission
        document.getElementById('ticketForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form
            let isValid = true;
            const formControls = document.querySelectorAll('.form-control');

            formControls.forEach(control => {
                if (!validateField(control)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            try {
                // Clean inputs by trimming whitespace
                const empName = document.getElementById('empName').value.trim();
                const description = document.getElementById('description').value.trim();

                const ticketData = {
                    empId: document.getElementById('empId').value.trim(),
                    empName: empName,
                    empEmail: document.getElementById('empEmail').value.trim(),
                    department: document.getElementById('department').value,
                    priority: document.getElementById('priority').value,
                    issueType: document.getElementById('issueType').value,
                    description: description
                };

                const response = await fetch('http://16.170.208.88:3025/api/tickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        emp_id: ticketData.empId,
                        emp_name: ticketData.empName,
                        emp_email: ticketData.empEmail,
                        department: ticketData.department,
                        priority: ticketData.priority,
                        issue_type: ticketData.issueType,
                        description: ticketData.description
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to submit ticket');
                }

                const result = await response.json();

                // Show preview
                document.getElementById('previewTicketId').textContent = result.ticket_id;
                document.getElementById('previewEmpId').textContent = result.emp_id;
                document.getElementById('previewEmpName').textContent = result.emp_name;
                document.getElementById('previewDepartment').textContent = result.department;
                document.getElementById('previewPriority').textContent = result.priority;
                document.getElementById('previewIssueType').textContent = result.issue_type;
                document.getElementById('previewDescription').textContent = result.description;

                document.getElementById('ticketPreview').style.display = 'block';

                // Show success modal
                document.getElementById('successModal').classList.add('active');

                // Load the updated ticket list
                if (currentEmpId === result.emp_id) {
                    await loadMyTickets();
                }

                // Reset form
                this.reset();
                // Clear validation states after reset
                formControls.forEach(control => {
                    control.classList.remove('is-invalid');
                    control.nextElementSibling.style.display = 'none';
                });
            } catch (error) {
                console.error('Error:', error);
                // Show error in the email feedback instead of alert
                const emailField = document.getElementById('empEmail');
                const emailFeedback = emailField.nextElementSibling;
                emailFeedback.textContent = error.message || 'Error submitting ticket';
                emailField.classList.add('is-invalid');
                emailFeedback.style.display = 'block';
            }
        });

        // When emp_id field changes, load their tickets
        document.getElementById('empId').addEventListener('change', async function() {
            currentEmpId = this.value.trim();
            if (/^[ATS]{3}0(?!000)[0-9]{3}$/.test(currentEmpId) && currentEmpId !== 'ATS0000') {
                document.getElementById('myTicketsCard').style.display = 'block';
                await loadMyTickets();
            } else {
                document.getElementById('myTicketsCard').style.display = 'none';
            }
        });

        // Filter employee tickets
        document.getElementById('filterStatusEmp').addEventListener('change', loadMyTickets);

        // Load employee's tickets
        async function loadMyTickets() {
            if (!currentEmpId) return;

            try {
                const statusFilter = document.getElementById('filterStatusEmp').value;
                const params = new URLSearchParams();
                params.append('emp_id', currentEmpId);
                if (statusFilter) params.append('status', statusFilter);

                const response = await fetch(`http://16.170.208.88:3025/api/tickets?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch tickets');

                const tickets = await response.json();
                const ticketsBody = document.getElementById('myTicketsBody');
                ticketsBody.innerHTML = '';

                if (tickets.length === 0) {
                    ticketsBody.innerHTML = `
                        <tr>
                            <td colspan="7">
                                <div class="no-data">
                                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No Data">
                                    <p>No tickets found</p>
                                </div>
                            </td>
                        </tr>
                    `;
                    return;
                }

                tickets.forEach(ticket => {
                    const row = document.createElement('tr');

                    // Format date
                    const createdDate = new Date(ticket.created_at);
                    const formattedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();

                    // Priority class
                    let priorityClass = '';
                    if (ticket.priority === 'High') priorityClass = 'priority-high';
                    if (ticket.priority === 'Critical') priorityClass = 'priority-critical';

                    // Status badge
                    let statusBadge = '';
                    if (ticket.status === 'Open') statusBadge = 'status-open';
                    if (ticket.status === 'In Progress') statusBadge = 'status-in-progress';
                    if (ticket.status === 'Resolved') statusBadge = 'status-resolved';
                    if (ticket.status === 'Closed') statusBadge = 'status-closed';

                    row.innerHTML = `
                        <td>${ticket.ticket_id}</td>
                        <td>${ticket.department}</td>
                        <td>${ticket.issue_type}</td>
                        <td class="${priorityClass}">${ticket.priority}</td>
                        <td><span class="status-badge ${statusBadge}">${ticket.status}</span></td>
                        <td>${formattedDate}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewTicket('${ticket.ticket_id}')" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    `;

                    ticketsBody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading tickets:', error);
                const ticketsBody = document.getElementById('myTicketsBody');
                ticketsBody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="no-data">
                                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No Data">
                                <p>Error loading tickets</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }

        // View ticket details
        async function viewTicket(ticketId) {
            try {
                const response = await fetch(`http://16.170.208.88:3025/api/tickets/${ticketId}`);
                if (!response.ok) throw new Error('Failed to fetch ticket');

                const ticket = await response.json();
                currentTicketId = ticket.ticket_id;

                // Format date
                const createdDate = new Date(ticket.created_at);
                const formattedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();

                document.getElementById('modalTicketId').textContent = ticket.ticket_id;
                document.getElementById('modalStatus').textContent = ticket.status;
                document.getElementById('modalPriority').textContent = ticket.priority;
                document.getElementById('modalDepartment').textContent = ticket.department;
                document.getElementById('modalIssueType').textContent = ticket.issue_type;
                document.getElementById('modalCreated').textContent = formattedDate;
                document.getElementById('modalDescription').textContent = ticket.description;

                // Load comments
                await loadComments(ticketId);

                document.getElementById('ticketModal').classList.add('active');
            } catch (error) {
                console.error('Error viewing ticket:', error);
                // Show error in the email feedback instead of alert
                const emailField = document.getElementById('empEmail');
                const emailFeedback = emailField.nextElementSibling;
                emailFeedback.textContent = error.message || 'Error loading ticket details';
                emailField.classList.add('is-invalid');
                emailFeedback.style.display = 'block';
            }
        }

        // Load comments for a ticket
        async function loadComments(ticketId) {
            try {
                const response = await fetch(`http://16.170.208.88:3025/api/tickets/${ticketId}/comments`);
                if (!response.ok) throw new Error('Failed to fetch comments');

                const comments = await response.json();
                const commentsContainer = document.getElementById('commentsContainer');
                commentsContainer.innerHTML = '';

                if (comments.length === 0) {
                    commentsContainer.innerHTML = '<p>No comments yet</p>';
                    return;
                }

                comments.forEach(comment => {
                    const commentDate = new Date(comment.created_at);
                    const formattedDate = commentDate.toLocaleDateString() + ' ' + commentDate.toLocaleTimeString();

                    const commentDiv = document.createElement('div');
                    commentDiv.style.padding = '1rem';
                    commentDiv.style.marginBottom = '1rem';
                    commentDiv.style.background = '#f8f9fa';
                    commentDiv.style.borderRadius = '6px';

                    commentDiv.innerHTML = `
                        <p><strong>${comment.author}</strong> <small>${formattedDate}</small></p>
                        <p>${comment.comment}</p>
                    `;

                    commentsContainer.appendChild(commentDiv);
                });
            } catch (error) {
                console.error('Error loading comments:', error);
                document.getElementById('commentsContainer').innerHTML = '<p>Error loading comments</p>';
            }
        }

        // Close modals
        function closeModal() {
            document.getElementById('successModal').classList.remove('active');
        }

        function closeTicketModal() {
            document.getElementById('ticketModal').classList.remove('active');
            currentTicketId = null;
        }
    </script>
</body>
</html>
