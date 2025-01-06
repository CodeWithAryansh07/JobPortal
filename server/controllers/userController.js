import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';
import Job from "../models/Job.js";

// Get User data

export const getUserData = async (req, res) => {
    
    const userId = req.auth.userId;

    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.json({success: false, message: 'User not found'})
        }

        res.json({success: true, user: user});

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}


// Apply for a job 

export const applyForJob = async (req, res) => {
    
    const { jobId } = req.body;

    const userId = req.auth.userId;

    try {
        
        const isAlreadyApplied = await JobApplication.findOne({userId, jobId});

        if (isAlreadyApplied) {
            return res.json({success: false, message: 'Already applied '});
        }

        const jobData = await Job.findById(jobId);

        if (!jobData) {
            return res.json({success: false, message: 'Job not found'})
        }

        const jobApplication = await JobApplication.create({
            companyId: jobData.companyId,
            userId, 
            jobId, 
            date: Date.now()
        });

        res.json({success: true, message: 'Application applied Successfully', jobApplication: jobApplication});

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}

// Get user applied application 

export const getUserJobApplication = async (req, res) => {
    try {

        const userId = req.auth.userId;

        const applications = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec();

        if (!applications) {
            return res.status(404).json({success: false, message: 'No application found'})
        }

        res.status(200).json({success: true, applications: applications});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

// Update user Profile (resume)

export const updateUserResume = async (req, res) => {
    try {
        
        const userId = req.auth.userId;

        const resumeFile = req.file;

        if (!resumeFile) {
            return res.json({success: false, message: 'Resume is required'})
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({success: false, message: 'User not found'})
        }

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);

            userData.resume = resumeUpload.secure_url;

            await userData.save();

            res.status(200).json({success: true, message: 'Resume updated successfully', resume: resumeUpload.secure_url});
        }

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}