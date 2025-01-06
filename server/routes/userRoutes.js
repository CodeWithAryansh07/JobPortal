import express from 'express';
import { applyForJob, getUserData, getUserJobApplication, updateUserResume } from '../controllers/userController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Get user data

router.get('/user', getUserData);

// Apply for a job

router.post('/apply', applyForJob);

// Get Applied jobs data

router.get('/applications', getUserJobApplication);

// Update user profile (resume)

router.post('/update-resume', upload.single('resume'), updateUserResume);

export default router;