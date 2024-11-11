const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const AccessRequest = require('./models/AccessRequest');
const NutritionPlan = require('./models/NutritionPlan');
const FitnessActivity = require('./models/FitnessActivity');
const Menstrual = require('./models/Menstrual');
const cors = require('cors');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/adolescent_health_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.get('/', (req, res) => {
    res.send('Welcome to the Adolescent Health Management API!');
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extracts the token after "Bearer "
    console.log("Received token:", token); // Log the token

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    try {
        const verified = jwt.verify(token, 'your_jwt_secret_key'); // Use the exact secret key
        console.log("Decoded token:", verified); // Log the decoded token
        req.user = verified; // Attach the decoded token data to the request
        next();
    } catch (error) {
        console.error("Token verification error:", error); // Log any verification errors
        res.status(400).json({ error: 'Invalid token' });
    }
};


app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed', details: error });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login request received for user:", username);

        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });
        console.log("Login successful, token generated:", token);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: 'Login failed', details: error });
    }
});




app.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming req.user.id contains the user's ObjectId
        res.json({
            healthData: user.healthData,
            userId: user._id,// Include ObjectId in response
            userName: user.username
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

app.get('/dashboard/update'), verifyToken, async (req, res) => {

}
app.post('/dashboard/update', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the token
        const { sleep, exercise, waterIntake, mood } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { healthData: { sleep, exercise, waterIntake, mood } },
            { new: true }
        ).select('healthData');

        res.json({ message: 'Health data updated successfully', healthData: user.healthData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update health data', details: error });
    }
});


app.post('/symptoms/check', verifyToken, async (req, res) => {
    try {
        const { symptoms } = req.body;

        let advice;

        if (symptoms.includes("fever")) {
            advice = "Consider resting and staying hydrated. Seek medical advice if it persists.";
        } else if (symptoms.includes("cough")) {
            advice = "Try using throat lozenges and stay hydrated. If it worsens, consult a healthcare provider.";
        } else if (symptoms.includes("headache")) {
            advice = "Rest in a dark, quiet room, and drink plenty of water. If headaches persist, see a doctor.";
        } else if (symptoms.includes("fatigue")) {
            advice = "Prioritize rest and limit strenuous activities. If fatigue continues, consider a medical evaluation.";
        } else if (symptoms.includes("sore throat")) {
            advice = "Gargle warm salt water and avoid irritants. Seek medical help if it becomes severe or lasts longer.";
        } else if (symptoms.includes("nausea")) {
            advice = "Try sipping ginger tea and avoid heavy meals. If nausea persists, consult with a doctor.";
        } else {
            advice = "Monitor symptoms, and maintain a balanced lifestyle.";
        }

        res.json({ message: "Symptoms checked successfully", advice });
    } catch (error) {
        res.status(500).json({ error: "Failed to check symptoms", details: error });
    }
});


app.get('/mentalhealth/resources', verifyToken, async (req, res) => {
    try {
        const resources = [
            { type: "article", title: "Managing Stress", link: "https://positivepsychology.com/stress-relief-techniques/" },
            { type: "video", title: "Meditation for Beginners", link: "https://youtu.be/Hzi3PDz1AWU?si=wu-FnyPRvBZ4ngYX" },
            { type: "tip", content: "HEALTH TIP - Take deep breaths to help calm your mind." }
        ];

        res.json({ message: "Mental health resources retrieved successfully", resources });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve resources", details: error });
    }
});

app.post('/mentalhealth/self-assessment', verifyToken, async (req, res) => {
    try {
        const { responses } = req.body;

        // Sample processing for a score (placeholder logic)
        const score = responses.reduce((acc, response) => acc + response.score, 0);
        const result = score > 5 ? "Consider speaking to a counselor for additional support." : "Keep up the good work with your mental health practices.";

        res.json({ message: "Self-assessment submitted successfully", score, result });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit self-assessment", details: error });
    }
});


app.post('/mentalhealth/book-session', verifyToken, async (req, res) => {
    try {
        const { date, time, counselorName } = req.body;

        // Mock session booking confirmation
        const bookingDetails = { date, time, counselorName, status: "Confirmed" };

        res.json({ message: "Session booked successfully", bookingDetails });
    } catch (error) {
        res.status(500).json({ error: "Failed to book session", details: error });
    }
});


app.get('/reproductive-health/articles', verifyToken, async (req, res) => {
    try {
        const articles = [
            { title: "Understanding Menstrual Health", link: "https://www.who.int/news/item/28-05-2023-menstrual-health-not-just-hygiene-the-path-toward-a-strong-cross-sectoral-response" },
            { title: "Safe Practices", link: "https://health.clevelandclinic.org/safe-sex" },
            { title: "Common Reproductive Health Myths", link: "https://nawathealth.com/11-common-myths-about-reproductive-health/" }
        ];

        res.json({ message: "Reproductive health articles retrieved successfully", articles });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve articles", details: error });
    }
});


app.post('/reproductive-health/menstrual-tracker', verifyToken, async (req, res) => {
    try {
        const { cycleStart, cycleEnd, symptoms } = req.body;

        // Simulate saving menstrual data
        const menstrualData = new Menstrual({ cycleStart, cycleEnd, symptoms });
        await menstrualData.save();
        res.json({ message: "Menstrual cycle data submitted successfully", menstrualData });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit menstrual cycle data", details: error });
    }
});


app.post('/reproductive-health/ask-question', verifyToken, async (req, res) => {
    try {
        const { question } = req.body;

        // Simulate saving the question to be reviewed by a healthcare professional
        const questionData = { question, status: "Submitted", response: "Pending" };

        res.json({ message: "Question submitted successfully", questionData });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit question", details: error });
    }
});


app.post('/appointments/book', verifyToken, async (req, res) => {
    try {
        const { date, time, providerName } = req.body;
        if (!date || !time || !providerName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const appointment = new Appointment({
            date,
            time,
            providerName,
            userId: req.user.id // This should work if req.user is set correctly
        });

        await appointment.save(); // Save the appointment to the database

        res.json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment', details: error.message });
    }
});



///////////////////////////////////////////////////////////////////////////////////////////////////

// Guardian access request endpoint

app.post('/guardian/access-request', async (req, res) => {
    const { adolescentId, guardianId } = req.body;

    try {
        const accessRequest = new AccessRequest({
            adolescentId,
            guardianId,
            status: 'Pending'
        });

        await accessRequest.save(); // Save to MongoDB
        res.status(201).json({
            message: 'Access request submitted successfully',
            accessDetails: {
                adolescentId,
                guardianId,
                status: accessRequest.status
            }
        });
    } catch (error) {
        res.status(400).json({
            error: 'Failed to submit access request',
            details: error
        });
    }
});



app.post('/guardian/access-request/:requestId/approve', async (req, res) => {
    const { requestId } = req.params;
    console.log("Received requestId:", requestId); // Log the request ID
    try {
        const accessRequest = await AccessRequest.findById(requestId);
        if (!accessRequest) {
            return res.status(404).json({ error: 'Access request not found' });
        }
        accessRequest.status = 'Approved';
        await accessRequest.save();
        res.json({ message: 'Access request approved successfully', accessDetails: accessRequest });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update access request', details: error.message });
    }
});

app.post('/guardian/access-request/:requestId/revoke', async (req, res) => {
    try {
        const { requestId } = req.params;
        const accessRequest = await AccessRequest.findById(requestId);

        if (!accessRequest) {
            return res.status(404).json({ error: 'Access request not found' });
        }

        accessRequest.status = 'Revoked';
        await accessRequest.save();

        res.json({
            message: 'Access request revoked successfully',
            accessDetails: accessRequest,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to revoke access request',
            details: error.message,
        });
    }
});



app.get('/guardian/access-requests', verifyToken, async (req, res) => {
    try {
        const guardianId = req.user.id; // Verify if req.user.id is correctly assigned
        console.log("Guardian ID:", guardianId); // Log guardian ID for debugging

        // Find all access requests by this guardian
        const accessRequests = await AccessRequest.find({ guardianId });

        if (accessRequests.length === 0) {
            return res.status(404).json({ message: 'No access requests found' });
        }

        res.status(200).json({
            message: 'Access requests retrieved successfully',
            accessRequests: accessRequests
        });
    } catch (error) {
        console.error("Error retrieving access requests:", error); // Log the error for troubleshooting
        res.status(500).json({ error: 'Failed to retrieve access requests', details: error });
    }
});


app.get('/guardian/:guardianId/adolescent/:adolescentId/health-data', async (req, res) => {
    const { guardianId, adolescentId } = req.params;

    try {
        const accessRequest = await AccessRequest.findOne({ guardianId, adolescentId, status: 'Approved' });
        if (!accessRequest) {
            return res.status(403).json({ error: 'Access denied or not approved' });
        }

        const adolescent = await User.findById(adolescentId).select('healthData');
        if (!adolescent) {
            return res.status(404).json({ error: 'Adolescent not found' });
        }

        res.json({
            message: 'Adolescent health data retrieved successfully',
            healthData: adolescent.healthData
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve adolescent health data', details: error.message });
    }
});


app.get('/guardian/:guardianId/adolescents', async (req, res) => {
    const { guardianId } = req.params;

    try {
        const approvedAccessRequests = await AccessRequest.find({ guardianId, status: 'Approved' }).select('adolescentId');

        if (approvedAccessRequests.length === 0) {
            return res.status(404).json({ message: 'No approved access requests found' });
        }

        const adolescentIds = approvedAccessRequests.map(request => request.adolescentId);
        const adolescents = await User.find({ _id: { $in: adolescentIds } }).select('username healthData');

        res.json({
            message: 'Approved adolescents retrieved successfully',
            adolescents
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve adolescents', details: error.message });
    }
});


app.delete('/guardian/access/:requestId', async (req, res) => {
    const { requestId } = req.params;

    try {
        const accessRequest = await AccessRequest.findById(requestId);

        if (!accessRequest || accessRequest.status !== 'Approved') {
            return res.status(404).json({ message: 'Approved access request not found' });
        }

        accessRequest.status = 'Revoked';
        await accessRequest.save();

        res.json({
            message: 'Access request revoked successfully',
            accessDetails: accessRequest
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to revoke access request', details: error.message });
    }
});


app.get('/guardian/pending-requests', verifyToken, async (req, res) => {
    const guardianId = req.user.id; // Ensure `req.user.id` contains the guardian's ID

    try {
        const pendingRequests = await AccessRequest.find({ guardianId, status: 'Pending' });

        res.json({
            message: 'Pending access requests retrieved successfully',
            pendingRequests
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve pending requests', details: error.message });
    }
});


app.get('/appointments/reminders', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from JWT
        const userReminders = await Appointment.find({ userId }); // Fetch reminders from DB
        res.status(200).json({ reminders: userReminders });
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ error: 'Failed to retrieve reminders' });
    }
});

// POST /nutrition/plan - Create a personalized nutrition plan
app.post('/nutrition/plan', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // EnSsure req.user is set by middleware
        const { dailyCalories, meals } = req.body;

        // Check if a nutrition plan already exists for the user
        let existingPlan = await NutritionPlan.findOne({ userId });
        if (existingPlan) {
            return res.status(400).json({ error: 'Nutrition plan already exists for this user' });
        }

        // Create a new nutrition plan
        const newPlan = new NutritionPlan({
            userId,
            dailyCalories,
            meals
        });

        await newPlan.save();
        res.status(201).json({ message: 'Nutrition plan created successfully', nutritionPlan: newPlan });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create nutrition plan', details: error.message });
    }
});


app.get('/nutrition/plan', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from JWT
        const personalizedNutritionPlan = await NutritionPlan.findOne({ userId }); // Fetch nutrition plan
        if (!personalizedNutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        res.status(200).json({ nutritionPlan: personalizedNutritionPlan });
    } catch (error) {
        console.error('Error fetching nutrition plan:', error);
        res.status(500).json({ error: 'Failed to retrieve nutrition plan' });
    }
});

app.put('/nutrition/plan', (req, res) => {
    // Update existing plan
    const updatedPlan = NutritionPlan(req.body);
    res.status(200).json({ message: 'Nutrition plan updated', nutritionPlan: updatedPlan });
});

// POST /fitness/tracker
app.post('/fitness/tracker', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { activity, duration } = req.body;

        const newActivity = new FitnessActivity({
            userId,
            activity,
            duration
        });

        await newActivity.save();
        res.status(201).json({ message: 'Fitness activity logged successfully', activity: newActivity });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log fitness activity', details: error.message });
    }
});


app.get('/fitness/tracker', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const userActivities = await FitnessActivity.find({ userId }).sort({ date: -1 });
        res.status(200).json({ message: 'Fitness activities retrieved successfully', activities: userActivities });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve fitness activities', details: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging

    // Set default status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Respond with error details
    res.status(status).json({
        error: message,
        details: err.details || {}
    });
});


app.post('/logout', (req, res) => {
    // Simulate logout by clearing the token client-side
    res.json({ message: "Logout successful" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
