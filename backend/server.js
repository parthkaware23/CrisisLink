require("dotenv").config();
const axios = require('axios');
const express = require("express");
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const LLM_KEY = process.env.LLM_KEY;
const cors = require("cors");
const OpenAI = require('openai');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Admin = require("./src/models/Admin");
const Responder = require("./src/models/Responder");
const User = require("./src/models/User");
const News = require("./src/models/News");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const BustRequest = require('./src/models/BustRequest');
const redisClient = require('./src/config/redis');
const auth1 = require("./src/middlewares/auth1");
require('./src/config/redis');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'], 
  exposedHeaders: ['x-auth-token']
}));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Crisis Intelligence API Running 🚀");
});

const countryMapping = {
  'in': 'IND',
  'us': 'USA',
  'gb': 'GBR',
  'ca': 'CAN'
};

app.post('/user/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, city, lat, lng } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Bhai, ye email pehle se registered hai!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      city,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });

    await user.save();
    
    // 4. Create Payload (Token mein kya data save karna hai)
    const payload = {
      user: {
        id: user.id,
        role: 'citizen' // Hum specify kar rahe hain ki ye ek citizen hai
      }
    };

    // 5. Sign the Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }, 
      (err, token) => {
        if (err) throw err;
        
        // 6. Return Success + Token
        res.status(201).json({ 
          msg: "User Initialized Successfully!",
          token,
          user: {
            id: user.id,
            name: user.name,
            role: 'citizen'
          }
        });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error during User Registration" });
  }
});


app.post('/responder/register', async (req, res) => {
    try {
        const { name, email, password, phoneNumber, organization, role, lat, lng } = req.body;

        // 1. Check if Responder already exists
        let responder = await Responder.findOne({ email });
        if (responder) {
            return res.status(400).json({ msg: "Bhai, ye Responder ID pehle se registered hai!" });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Role Validation (Enum Fix)
        // Agar frontend se 'responder' bhej rahe ho, toh use 'NGO' ya koi valid model enum pe map kar do
        const validRoles = ['Police', 'Medical', 'Fire', 'NGO', 'Disaster Management'];
        const finalRole = validRoles.includes(role) ? role : 'NGO'; 

        // 4. Create New Responder
        responder = new Responder({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            organization,
            role: finalRole, 
            location: {
                type: 'Point',
                coordinates: [lng, lat] 
            },
            isVerified: false, 
            status: 'Available'
        });

        await responder.save();

        // --- JWT LOGIC FOR RESPONDER ---
        const payload = {
            user: {
                id: responder.id,
                role: 'responder'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'CrisisLink_Secret_2026',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                
                res.status(201).json({ 
                    msg: "RESPONDER NODE INITIALIZED: Waiting for Admin Approval.",
                    token, // Token bhej diya
                    responder: {
                        id: responder.id,
                        role: finalRole,
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error: Responder registration failed!" });
    }
});


app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: "Bhai, ye User registered nahi hai!" });
    }
    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password galat hai!" });
    }
    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: 'citizen'
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            role: 'citizen'
          },
          msg: "User Login Successful!"
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error during User Login" });
  }
});

app.post('/responder/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const responder = await Responder.findOne({ email }).select('+password');
        
        if (!responder) {
            return res.status(400).json({ msg: "Bhai, ye Responder ID system mein nahi hai!" });
        }

        const isMatch = await bcrypt.compare(password, responder.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Security Key (Password) galat hai!" });
        }
        try {
            await redisClient.zAdd('responder_pool', {
              score: 0,
              value: responder.id.toString()
            });
            await redisClient.expire('responder_pool', 86400); 
            
            console.log(`UPLINK: Responder ${email} added to responder_pool.`);
        } catch (redisErr) {
            console.error("REDIS_Hajri_Error:", redisErr.message);
        }
        const payload = {
            user: {
                id: responder.id,
                role: 'responder'
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: responder.id,
                        role: 'responder',
                    },
                    msg: "RESPONDER AUTHENTICATED: Uplink Established."
                });
            }
        );

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error: Responder login failed!" });
    }
});

app.post('/admin/login', async (req, res) => {
    const { email, password, secretKey } = req.body;

    try {
        // 1. Admin search karo aur password & secretKey dono mangwao
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(400).json({ msg: "Admin user not found!" });
        }

        // 2. Secret Key match karo (Sabke liye same hai)
        if (secretKey !== admin.adminSecretKey) {
            return res.status(403).json({ msg: "Invalid Admin Secret Key!" });
        }

        // 3. Password match karo (Agar bcrypt use kar raha hai toh compare use kar)
        const isMatch = (password === admin.password); // Replace with bcrypt.compare if hashed
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Password!" });
        }

        // 4. Token Generate karo
        const token = jwt.sign({ id: admin._id, role: 'admin' }, 'Your_Secret_Key');
        res.json({ token, user: { name: admin.name, role: 'admin' } });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.get('/citizen/news', async (req, res) => {
  try {
    const { country } = req.query; 
    let filter = {};

    if (country) {
      // Agar frontend se 'India' bheja, toh ye /India/i ban jayega
      filter.country = { $regex: new RegExp(`^${country}$`, 'i') }; 
    }

    const allNews = await News.find(filter).sort({ createdAt: -1 });
    res.status(200).json(allNews);
  } catch (error) {
    res.status(500).json({ message: "Gaya data tel lene!" });
  }
});

// app.get('/citizen/news', async (req, res) => {
//   try {
//     const allNews = await News.find().sort({ createdAt: -1 });
    
//     res.status(200).json(allNews);
//   } catch (error) {
//     console.error("Backend Error:", error);
//     res.status(500).json({ message: "Data nahi mil raha bhai!" });
//   }
// });

app.get('/citizen/news/:id', async (req, res) => {
  try {
    const singleNews = await News.findById(req.params.id);
    res.json(singleNews);
  } catch (error) {
    res.status(500).json({ message: "News not found!" });
  }
});

app.get('/all-news', async (req, res) => {
    try {
        const allNews = await News.find().sort({ createdAt: -1 });
        res.status(200).json(allNews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching all news", error: err });
    }
});

const syncNewsFromAPI = async (countryCode2) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${countryCode2}&apiKey=${NEWS_API_KEY}`);
    
    const articles = response.data.articles;
    const iso3 = countryMapping[countryCode2]; 

    const bulkOps = articles.map(art => ({
      updateOne: {
        filter: { title: art.title }, 
        update: {
          title: art.title,
          description: art.description || 'No description available',
          category: 'Global_Watch',
          countryCode: iso3, 
          createdAt: new Date(art.publishedAt)
        },
        upsert: true
      }
    }));

    await News.bulkWrite(bulkOps);
    console.log(`Synced ${articles.length} news for ${iso3}`);
  } catch (err) {
    console.error("API Sync Failed:", err);
  }
};


app.get('/sync-news', async (req, res) => {
    try {
        
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`);
        
        const articles = response.data.articles;

        const newsData = articles.map(article => ({
            title: article.title,
            description: article.description,
            category: "API_NEWS",
            countryCode: "IND", 
            createdAt: new Date()
        }));

        await News.insertMany(newsData);
        res.status(200).send("News Synced Successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// app.get('/citizen/external-news', async (req, res) => {
//   try {
//     const { countryCode } = req.query; 
 
//     const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
//       params: {
//         country: countryCode || 'in', // Default 'in' (India)
//         apiKey: NEWS_API_KEY,
//         category: 'technology' 
//       }
//     });

//     // Data ko frontend ke format mein transform karo
//     const articles = response.data.articles.map((article, index) => ({
//       _id: `news-${index}-${Date.now()}`, // Unique temporary ID
//       title: article.title,
//       description: article.description,
//       locationName: article.source.name || 'Global News',
//       countryCode: countryCode ? countryCode.toUpperCase() : 'IN',
//       imageUrl: article.urlToImage || 'https://via.placeholder.com/400',
//       createdAt: article.publishedAt
//     }));

//     res.status(200).json(articles);

//   } catch (error) {
//     console.error("NewsAPI Error:", error.response?.data || error.message);
//     res.status(500).json({ message: "Backend se NewsAPI connect nahi ho pa raha!" });
//   }
// });

// 1. Cloud Configuration

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.LLM_KEY, 
});

const askGroq = async (headline, description) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', 
      messages: [
        {
          role: 'system',
          content: 'You are a news analyzer. Return ONLY a valid JSON object. No markdown, no prose.'
        },
        {
          role: 'user',
          content: `Analyze this news and return JSON:
          Headline: ${headline}
          Description: ${description}
          
          Required JSON Format:
          {
            "country": "Full Name of Country (detected from content)",
            "locationName": "Specific city or region name, or 'Global'",
            "mediaType": "image" 
          }`
        }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("Groq Galti:", err.message);
    return null;
  }
};

app.post('/api/responder/check-in', auth1, async (req, res) => {
  try {
    const responderId = req.user.id;
    await redisClient.zAdd('responder_pool', {
      score: 0,
      value: responderId.toString()
    });
    res.json({ success: true, msg: "RESPONDER_ONLINE" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/citizen/sync-news', async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.API_KEY;
    
    // 1. Fetching News
    const newsRes = await axios.get(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${NEWS_API_KEY}`);
    const articles = newsRes.data.articles.slice(0, 10); // Top 10 headlines

    let savedCount = 0;

    // 2. Processing with AI
    for (let art of articles) {
      try {
        if (!art.description || !art.title) continue;

        const aiData = await askGroq(art.title, art.description);

        if (aiData) {
        await News.create({
          title: art.title,
          description: art.description || "No description available",
          mediaUrl: art.urlToImage || 'https://via.placeholder.com/400',
          mediaType: 'image', 
          locationName: aiData.locationName || art.source.name || "Global",
          country: aiData.country || "Global",
          createdAt: art.publishedAt || new Date()
        });
        savedCount++;
      }
      } catch (innerErr) {
        console.error(`Skipping one article due to error: ${innerErr.message}`);
        continue; 
      }
    }

    res.json({ 
      message: "Success! AI Pipeline complete.", 
      articlesProcessed: savedCount 
    });

  } catch (error) {
    res.status(500).json({ error: "Major breakdown: " + error.message });
  }
});

const submitNewsRequest = async (req, res) => {
  try {
    const { query, evidenceLinks, priority } = req.body;
    const citizenId = req.user.id; 

    // 1. Redis se responder nikalo
    // Note: Node-Redis v4+ mein format thoda alag hota hai
    const bestResponders = await redisClient.zRangeWithScores('responder_pool', 0, 0);

    // AGAR POOL KHALI HAI
    if (!bestResponders || bestResponders.length === 0) {
      return res.status(503).json({ 
        success: false, 
        message: "STATIONS_BUSY: No responders online." 
      });
    }

    const assignedResponderId = bestResponders[0].value || bestResponders[0].member;

    if (!assignedResponderId) {
        throw new Error("CANNOT_EXTRACT_RESPONDER_ID");
    }
    const cleanedEvidence = evidenceLinks.map(link => ({
      ...link,
      // Agar 'image/jpeg' jaisa kuch hai toh usse sirf 'IMAGE' kar do
      fileType: link.fileType.startsWith('image/') ? 'IMAGE' : link.fileType.toUpperCase()
    }));
    const newRequest = await BustRequest.create({
      citizenId,
      query,
      evidenceLinks: cleanedEvidence,
      assignedTo: assignedResponderId,
      assignedAt: new Date(),
      status: 'PENDING'
    });
    await redisClient.zIncrBy('responder_pool', 1, assignedResponderId.toString());

    res.status(201).json({ 
      success: true, 
      assignedTo: assignedResponderId, 
      requestId: newRequest._id 
    });

  } catch (err) {
    console.error("CRITICAL_SUBMISSION_ERROR:", err); 
    res.status(500).json({ success: false, message: "INTERNAL_UPLINK_ERROR" });
  }
};

app.post('/bust-news/submit',auth1, submitNewsRequest);

// --- BACKEND: Responder ki queue dikhane ka logic ---
app.get('/api/responder/queue', auth1, async (req, res) => {
  try {
    // 1. Sirf wahi requests uthao jo 'PENDING' hain 
    // 2. Aur jo is specific responder ko assign hui hain
    const myQueue = await BustRequest.find({ 
      assignedTo: req.user.id, 
      status: 'PENDING' 
    }).sort({ createdAt: -1 }); // Newest first
    
    res.json(myQueue);
  } catch (err) {
    res.status(500).json({ msg: "Queue fetch failed" });
  }
});

app.get('/my-tasks', async (req, res) => {
  try {
    // Maan ke chal raha hoon req.user.id auth middleware se aa rahi hai
    const responderId = req.user.id; 
    
    const tasks = await BustRequest.find({ 
      assignedTo: responderId,
      status: { $in: ['PENDING', 'IN_PROGRESS'] } // Sirf adhure kaam dikhao
    }).sort({ createdAt: -1 }); // Nayi news sabse upar
    
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "FETCH_ERROR" });
  }
});

app.patch('/update-status/:requestId', async (req, res) => {
  try {
        const { status, resolutionNote } = req.body; // status: 'VERIFIED' or 'DEBUNKED'
        const { requestId } = req.params;
        const responderId = req.user.id;
        
        // 1. MongoDB mein status update karo
        const updatedTask = await BustRequest.findOneAndUpdate(
          { _id: requestId, assignedTo: responderId },
          { status, resolutionNote },
            { new: true }
          );

        if (!updatedTask) return res.status(404).json({ msg: "Task not found" });

        // 2. REDIS LOAD RELEASE: Kyunki kaam khatam ho gaya, load -1 karo
        const redisClient = require('../config/redis');
        await redisClient.zIncrBy('responder_pool', -1, responderId.toString());
        
        res.json({ success: true, message: "STATUS_UPDATED_LOAD_RELEASED" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.patch('/api/responder/claim/:id', auth1, async (req, res) => {
    try {
        const request = await BustRequest.findById(req.params.id);
        
        if (!request) return res.status(404).json({ msg: "Request not found" });

        // Update status to IN_PROGRESS
        request.status = 'IN_PROGRESS';
        request.responderId = req.user.id; // Taaki pata chale kisne claim kiya
        await request.save();

        res.json({ msg: "Task Claimed Successfully", request });
    } catch (err) {
        console.error(err);
        res.status(500).send("Claim Error");
    }
});

// --- BACKEND: Resolve/Verify the News ---
app.post('/api/responder/resolve/:id', auth1, async (req, res) => {
    try {
        const { status, resolutionNote } = req.body;
        const request = await BustRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ msg: "Request not found" });

        request.status = status; // 'VERIFIED' ya 'DEBUNKED'
        request.resolutionNote = resolutionNote;
        request.resolvedAt = new Date();
        await request.save();

        // --- OPTIONAL: Redis se responder ka load kam karo ---
        await redisClient.zIncrBy('responder_pool', -1, req.user.id.toString());

        res.json({ msg: "Resolution Broadcasted!", request });
    } catch (err) {
        console.error(err);
        res.status(500).send("Resolution Error");
    }
});

// server.js mein ye hona chahiye
app.get('/api/responder/request/:id', auth1, async (req, res) => {
    try {
        const request = await BustRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: "Request not found" });
        res.json(request);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});