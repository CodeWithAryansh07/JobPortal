import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    // if (!process.env.MONGODB_URI) {
    //     console.error("MongoDB URI is not defined in environment variables");
    //     process.exit(1);
    // }

    // try {
    //     await mongoose.connect(process.env.MONGODB_URI);
    //     console.log("Connected to MongoDB");
    // } catch (err) {
    //     console.error("Error connecting to MongoDB:", err);
    //     process.exit(1);
    // }

    mongoose.connection.on('connected', () => console.log("Database Connected"));

    await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;