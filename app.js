const express = require('express');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const app = express();

// Behövdes lägga till för att frontenden skulle kunna skicka requests
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

function generateMockPost() {
    return {
        title: faker.lorem.words(),
        richText: faker.lorem.paragraphs(),
        pinned: {
            isPinned: faker.datatype.boolean(),
            pinnedAt: faker.date.recent(),
        },
        poll: {
            choices: [
                {
                    choiceText: faker.lorem.words(),
                    votes: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => faker.string.uuid()),
                },
                {
                    choiceText: faker.lorem.words(),
                    votes: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => faker.string.uuid()),
                }
            ]
        },
        likes: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => faker.string.uuid()),
        comments: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
            authorId: faker.string.uuid(),
            text: faker.lorem.sentence(),
            likes: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.string.uuid()),
            images: [faker.image.url()],
            createdAt: faker.date.recent()
        })),
        images: [faker.image.url(), faker.image.url()],
        createdAt: faker.date.recent(),
    };
}

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


/**
 *  EXAMPLE COMMUNITY CREATE 
 */
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


/**
 *  POSTS: CREATE & READ
 */
const postSchema = new mongoose.Schema({
    title: String,
    richText: String,
    pinned: {
        isPinned: Boolean,
        pinnedAt: Date,
    },
    poll: {
        choices: Array
    },
    likes: Array,
    comments: Array,
    images: Array,
    createdAt: Date,
});

const PostModel = mongoose.model('Post', postSchema);


const createExamplePost = async () => {
    const exempelPost = new PostModel();
    const randomizedPost = generateMockPost();

    Object.assign(exempelPost, randomizedPost);

    try {
        await exempelPost.save();
        console.log("New POST Created!")
    } catch (err) {
        console.error("Failed to create community")
    }
}

createExamplePost();


/**
 *  ENDPOINTS: CREATE/READ (POST/GET)
 */

// Endpoint to retrieve all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Endpoint to create a new post
app.post('/api/posts', async (req, res) => {
    const newPost = new PostModel(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


