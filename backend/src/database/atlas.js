import mongoose from "mongoose";

// const username = "agromart-atlas";
// const password = "ilove100";
// const clusterName = "FarmToTable";

// For use with MongoDB Atlas

const uri = "mongodb+srv://agromart-atlas:ilove100@farmtotable.kqnztmn.mongodb.net/FarmToTable?retryWrites=true&w=majority&appName=FarmToTable";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.log("Failed to connect to MongoDB!", e);
        await mongoose.disconnect();
    } finally {
        // Ensures that the client will close when you finish/error
    }
}

export { run }