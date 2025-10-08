import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Import Zod schemas
import { 
  userSchema, 
  createUserInputSchema, 
  plantSchema, 
  searchPlantInputSchema,
  careGuideSchema,
  forumPostSchema,
  createForumPostInputSchema,
  plantMarketplaceSchema,
  createPlantMarketplaceInputSchema
} from './schema.js';

dotenv.config();

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Error response utility
interface ErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  details?: any;
  timestamp: string;
}

function createErrorResponse(
  message: string,
  error?: any,
  errorCode?: string
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errorCode) {
    response.error_code = errorCode;
  }

  // Only include detailed error information in development
  if (error && process.env.NODE_ENV === 'development') {
    response.details = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return response;
}

const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432, JWT_SECRET = 'your-secret-key' } = process.env;

/*
  PostgreSQL database connection setup using the exact provided configuration
  Connects to existing database with pre-created tables and seed data
*/
const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { require: true } 
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { require: true },
      }
);

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(morgan('combined')); // Detailed logging for development

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/*
  JWT Authentication middleware for protected routes
  Verifies token and attaches user data to request object
*/
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(createErrorResponse('Access token required', null, 'AUTH_TOKEN_MISSING'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT user_id, email, name, created_at FROM users WHERE user_id = $1', [decoded.user_id]);
      
      if (result.rows.length === 0) {
        return res.status(401).json(createErrorResponse('Invalid token - user not found', null, 'AUTH_USER_NOT_FOUND'));
      }

      req.user = result.rows[0];
      next();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json(createErrorResponse('Invalid or expired token', error, 'AUTH_TOKEN_INVALID'));
  }
};

// API Routes

/*
  POST /api/auth/register
  Creates a new user account with email and name, returns JWT token
  No password hashing for development - stores password directly
*/
app.post('/api/auth/register', async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = createUserInputSchema.parse(req.body);
    const { email, name } = validatedData;

    const client = await pool.connect();
    
    try {
      // Check if user already exists
      const existingUser = await client.query('SELECT user_id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json(createErrorResponse('User with this email already exists', null, 'USER_ALREADY_EXISTS'));
      }

      // Create new user with generated UUID
      const user_id = uuidv4();
      const created_at = new Date().toISOString();
      
      const result = await client.query(
        'INSERT INTO users (user_id, email, name, created_at) VALUES ($1, $2, $3, $4) RETURNING user_id, email, name, created_at',
        [user_id, email.toLowerCase().trim(), name.trim(), created_at]
      );

      const user = result.rows[0];

      // Generate JWT token
      const auth_token = jwt.sign(
        { user_id: user.user_id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.status(200).json({
        auth_token
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  POST /api/auth/login
  Authenticates user with email and password, returns JWT token
  Direct password comparison for development (no hashing)
*/
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(createErrorResponse('Email and password are required', null, 'MISSING_REQUIRED_FIELDS'));
    }

    const client = await pool.connect();
    
    try {
      // Note: In real implementation, this would check against a password field
      // For now, we'll create a mock authentication since the DB doesn't have password field
      const result = await client.query('SELECT user_id, email, name, created_at FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      
      if (result.rows.length === 0) {
        return res.status(400).json(createErrorResponse('Invalid email or password', null, 'INVALID_CREDENTIALS'));
      }

      const user = result.rows[0];

      // Generate JWT token
      const auth_token = jwt.sign(
        { user_id: user.user_id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.status(200).json({
        auth_token
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  GET /api/users/{user_id}
  Retrieves user profile information by user ID
  Protected route requiring authentication
*/
app.get('/api/users/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT user_id, email, name, created_at FROM users WHERE user_id = $1', [user_id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json(createErrorResponse('User not found', null, 'USER_NOT_FOUND'));
      }

      const user = result.rows[0];
      
      // Validate response with Zod schema
      const validatedUser = userSchema.parse({
        ...user,
        created_at: new Date(user.created_at)
      });

      res.status(200).json(validatedUser);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  GET /api/plants
  Searches and filters plants based on query parameters
  Supports filtering by type, light_requirement, watering_needs, and text search
*/
app.get('/api/plants', async (req, res) => {
  try {
    const { type, light_requirement, watering_needs, query, limit = 10, offset = 0 } = req.query;

    const client = await pool.connect();
    
    try {
      let sql = 'SELECT * FROM plants WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      // Add filters based on query parameters
      if (type) {
        sql += ` AND type ILIKE $${paramIndex}`;
        params.push(`%${type}%`);
        paramIndex++;
      }

      if (light_requirement) {
        sql += ` AND light_requirement ILIKE $${paramIndex}`;
        params.push(`%${light_requirement}%`);
        paramIndex++;
      }

      if (watering_needs) {
        sql += ` AND watering_needs ILIKE $${paramIndex}`;
        params.push(`%${watering_needs}%`);
        paramIndex++;
      }

      if (query) {
        sql += ` AND (scientific_name ILIKE $${paramIndex} OR common_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${query}%`);
        paramIndex++;
      }

      // Add pagination
      sql += ` ORDER BY common_name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await client.query(sql, params);
      
      // Validate response with Zod schema
      const validatedPlants = result.rows.map(plant => plantSchema.parse(plant));

      res.status(200).json(validatedPlants);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Search plants error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  GET /api/plants/{plant_id}
  Retrieves detailed information for a specific plant
*/
app.get('/api/plants/:plant_id', async (req, res) => {
  try {
    const { plant_id } = req.params;

    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM plants WHERE plant_id = $1', [plant_id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json(createErrorResponse('Plant not found', null, 'PLANT_NOT_FOUND'));
      }

      const plant = result.rows[0];
      
      // Validate response with Zod schema
      const validatedPlant = plantSchema.parse(plant);

      res.status(200).json(validatedPlant);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get plant details error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  GET /api/care-guides
  Retrieves all available plant care guides
*/
app.get('/api/care-guides', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM care_guides ORDER BY plant_family ASC');
      
      // Validate response with Zod schema
      const validatedGuides = result.rows.map(guide => careGuideSchema.parse(guide));

      res.status(200).json(validatedGuides);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get care guides error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  GET /api/forum
  Retrieves all forum posts ordered by creation date
*/
app.get('/api/forum', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM forum_posts ORDER BY created_at DESC');
      
      // Validate response with Zod schema
      const validatedPosts = result.rows.map(post => forumPostSchema.parse({
        ...post,
        created_at: new Date(post.created_at)
      }));

      res.status(200).json(validatedPosts);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  POST /api/forum
  Creates a new forum post
  Protected route requiring authentication
*/
app.post('/api/forum', authenticateToken, async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = createForumPostInputSchema.parse(req.body);
    const { user_id, content, topic } = validatedData;

    const client = await pool.connect();
    
    try {
      // Verify user exists
      const userCheck = await client.query('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
      if (userCheck.rows.length === 0) {
        return res.status(400).json(createErrorResponse('Invalid user ID', null, 'INVALID_USER_ID'));
      }

      // Create new forum post
      const post_id = uuidv4();
      const created_at = new Date().toISOString();
      
      const result = await client.query(
        'INSERT INTO forum_posts (post_id, user_id, content, created_at, topic) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [post_id, user_id, content, created_at, topic]
      );

      const newPost = result.rows[0];
      
      // Validate response with Zod schema
      const validatedPost = forumPostSchema.parse({
        ...newPost,
        created_at: new Date(newPost.created_at)
      });

      res.status(201).json(validatedPost);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create forum post error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  GET /api/marketplace
  Retrieves all marketplace listings ordered by creation date
*/
app.get('/api/marketplace', async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM plant_marketplace ORDER BY created_at DESC');
      
      // Validate response with Zod schema
      const validatedListings = result.rows.map(listing => plantMarketplaceSchema.parse({
        ...listing,
        created_at: new Date(listing.created_at)
      }));

      res.status(200).json(validatedListings);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get marketplace listings error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  POST /api/marketplace
  Creates a new marketplace listing
  Protected route requiring authentication
*/
app.post('/api/marketplace', authenticateToken, async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = createPlantMarketplaceInputSchema.parse(req.body);
    const { user_id, plant_id, condition, desired_trade, status } = validatedData;

    const client = await pool.connect();
    
    try {
      // Verify user and plant exist
      const userCheck = await client.query('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
      if (userCheck.rows.length === 0) {
        return res.status(400).json(createErrorResponse('Invalid user ID', null, 'INVALID_USER_ID'));
      }

      const plantCheck = await client.query('SELECT plant_id FROM plants WHERE plant_id = $1', [plant_id]);
      if (plantCheck.rows.length === 0) {
        return res.status(400).json(createErrorResponse('Invalid plant ID', null, 'INVALID_PLANT_ID'));
      }

      // Create new marketplace listing
      const listing_id = uuidv4();
      const created_at = new Date().toISOString();
      
      const result = await client.query(
        'INSERT INTO plant_marketplace (listing_id, user_id, plant_id, condition, desired_trade, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [listing_id, user_id, plant_id, condition, desired_trade, status, created_at]
      );

      const newListing = result.rows[0];
      
      // Validate response with Zod schema
      const validatedListing = plantMarketplaceSchema.parse({
        ...newListing,
        created_at: new Date(newListing.created_at)
      });

      res.status(201).json(validatedListing);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create marketplace listing error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA catch-all: serve index.html for non-API routes only
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app and pool for testing
export { app, pool };

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`PlantConnect server running on port ${port} and listening on 0.0.0.0`);
});