const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:mypassword@cluster0.gm9xm52.mongodb.net/production?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();


// Create Community Model
const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo_src: {
        type: String,
        required: true
    },
    banner_src: {
        type: String,
        required: true
    }
});

const CommunityModel = mongoose.model('Community', communitySchema);





const createExampleCommunity = async () => {
    const exempelCommunity = new CommunityModel();

    exempelCommunity.name = 'Programmering Sverige LIVE';
    exempelCommunity.logo_src = 'www.img.com/logo';
    exempelCommunity.banner_src = 'www.img.com/banner';

    try {
        await exempelCommunity.save();
        console.log("Community Created!")
    } catch (err) {
        console.error("Failed to create community")
    }
}

createExampleCommunity();

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


