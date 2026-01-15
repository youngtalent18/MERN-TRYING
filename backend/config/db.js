import mongoose from "mongoose"

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB connected at ${conn.connection.host}`);
    }catch(error){
        console.log("Error connecting to database", error);
    }
}

export default connectDB;