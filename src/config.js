import mongoose from 'mongoose';
const { Schema } = mongoose;

const connect = mongoose.connect("mongodb+srv://astrolix278:i6bCj8BfasQhl83R@democluster.7dbf7.mongodb.net/?retryWrites=true&w=majority&appName=demoCluster", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000 // Increase timeout to 60 seconds
});

// Check if database is connected
connect.then(() => {
    console.log('Database connected');
}).catch(() => {
    console.log("Database not connected");
});

// Create a schema
const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("demoCluster", loginSchema);

export default collection;