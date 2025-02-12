// server.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log request details
app.use((req, res, next) => {
    console.log(`\nRequest: ${req.method} ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    next();
});

// Load the OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, '../openapi/specification/petstore-api.yaml'));

// Serve the OpenAPI documentation using Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define API endpoints based on the OpenAPI specification
app.get('/pet/:petId', (req, res) => {
    const petId = parseInt(req.params.petId, 10); // Convert petId to an integer
    // Mock response for demonstration purposes
    const response = {
        id: petId,
        name: 'Pet',
        status: 'available',
        category: {
            id: 1,
            name: 'Test Category',
        },
        tags: [
            {
                id: 1,
                name: 'Test Tag',
            },
        ],
        photoUrls: [
            'http://example.com/photo1.jpg',
            'http://example.com/photo2.jpg'
        ],
    };
    console.log('Response:', response);
    res.json(response);
});

app.post('/pet', (req, res) => {
    const newPet = req.body;
    // Validate the request body
    if (!newPet.name || !newPet.status || !newPet.category || !newPet.tags || !newPet.photoUrls) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Mock response for demonstration purposes
    const response = {
        id: 10,
        name: newPet.name,
        status: newPet.status,
        category: newPet.category,
        tags: newPet.tags,
        photoUrls: newPet.photoUrls,
    };
    console.log('Response:', response);
    res.json(response);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`API documentation is available at http://localhost:${port}/api-docs`);
});