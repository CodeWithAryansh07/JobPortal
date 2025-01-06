
// Register a new company 

import Company from "../models/Company.js";
import bcrypt from 'bcrypt';
import {v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

export const registerCompany = async (req, res) => {
    const {name, email, password} = req.body;

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.status(400).json({success: false, message: 'All fields are required'});
    }

    try {
        
        const companyExists = await Company.findOne({email})

        if (companyExists) {
            return res.status(400).json({success: false, message: 'Company already exists'});
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        })

        res.json({success: true, message: 'Company registered successfully', company: {
            _id: company._id,
            name: company.name,
            email: company.email,
            image: company.image
        },        
        token: generateToken(company._id)
    })

    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }

}

// Company Login

export const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {

        const company = await Company.findOne({email});

        if (await bcrypt.compare(password, company.password)) {
            res.json({success: true, message: 'Company logged in successfully', company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },        
            token: generateToken(company._id)
        })
        } else {
            res.json({success: false, message: 'Invalid email or password'});
        }

    } catch(err) {
        res.json({success: false, message: err.message});
    }
}

// Get Company data

export const getCompanyData = async (req, res) => {
    
    try{
        
        const company = req.company;

        res.json({success: true, company: company})

    }catch(err) {
        res.json({success: false, message: err.message});
    }

}

// Post a new Job 
export const postJob = async (req, res) => {

    const { title, description, location, salary, level, category } = req.body;

    const companyId = req.company._id;

    // console.log(companyId,{title, description, location, salary})

    try {
        
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save();

        res.json({success: true, message: 'Job posted successfully', job: newJob})

    } catch (error) {
        res.json({success: false, message: error.message});
    }

}

// Get Company Jobs Applicants
export const getCompanyJobApplicants = async (req, res) => {

    try {
        
        const companyId = req.company._id;

        // Find job applications for the user and populate the data

        const applications = await JobApplication.find({companyId}).populate('userId', 'name image resume')
        .populate('jobId', 'title location category level salary')
        .exec();

        return res.json({success: true, applications})

    } catch (error) {
        res.json({error: error.message});
    }

}

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        
        const companyId = req.company._id;

        const jobs = await Job.find({ companyId });

        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({jobId: job._id});
            return {...job.toObject(), applicants: applicants.length}
        }))

        res.json({success: true, jobs: jobsData});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Change Job Application Status
export const changeJobApplicationStatus = async (req, res) => {

    try {
        
        const { id, status } = req.body;

        // Find Job application data and update status 

        await JobApplication.findOneAndUpdate({_id: id}, {status: status})

        res.json({success: true, message: 'Status Changed'})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Change Job Visibility
export const changeVisibility = async (req, res) => {

    try {
        
        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id);

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
        }

        await job.save();

        res.json({success: true, message: 'Job visibility changed successfully', job: job});

    }catch (err) {
        res.json({success: false, message: err.message});
    }

}