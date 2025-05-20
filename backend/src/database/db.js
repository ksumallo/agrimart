import mongoose from 'mongoose';


// For use with MongoDB Compass
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/FarmToMarket')

        console.log("MongoDB connected successfully");
    } catch (e) {
        console.log("MongoDB connection error", e);
    }
}

export { connectDB };