# SOLEO SPIKE API

## Project Set-Up
```shell
npm install
```

## Configuration

### Environment Variables
Copy the example environment file and configure as needed:
```shell
cp .env.example .env
```

Edit `.env` to configure your server settings.

### HTTP vs HTTPS Configuration

The API supports both HTTP (development) and HTTPS (production/testing).

#### HTTP Mode (Default - Development)
By default, the server runs in HTTP mode. No additional configuration needed.

```shell
# In .env or environment
USE_HTTPS=false
# or simply omit USE_HTTPS
```

#### HTTPS Mode (Production/Testing)

**Step 1: Place Your Certificates**

You mentioned you have a certificate created. Place your certificate files in the `certs/` directory:
```
certs/
├── server.key   # Your private key
├── server.cert  # Your certificate
```

**Step 2: Configure Environment Variables**

Set these in your `.env` file:
```shell
USE_HTTPS=true
SSL_KEY_PATH=./certs/server.key
SSL_CERT_PATH=./certs/server.cert
```

**Step 3: Update CORS Origins (if needed)**

Update CORS to allow HTTPS origins:
```shell
CORS_ALLOWED_ORIGINS=https://localhost:5173
```

**Step 4: Start the Server**

```shell
npm run dev
```

The server will now run with HTTPS on `https://localhost:3000`

#### Generate Self-Signed Certificate (Testing Only)

If you need to generate a self-signed certificate for testing:

```shell
cd certs
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

**Note**: Self-signed certificates will show security warnings in browsers. For production, use certificates from a trusted Certificate Authority.

## Build Server on the Command Line

### Development Mode (with auto-reload)
```shell
npm run dev
```

### Production Build
```shell
npm run build
npm start
```

## Connect to the Server
- **HTTP**: [http://localhost:3000](http://localhost:3000)
- **HTTPS**: [https://localhost:3000](https://localhost:3000)

## Testing - Endpoints

### Test Login Endpoint
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "mock-jwt-token",
  "userId": "12345",
  "userType": "patient"
}
```

### Test Logout Endpoint
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "user-id: 12345"
```

**Expected Response:**
```json
{
  "success": true,
  "userId": "12345"
}
```

### Test Authorize Endpoint
```bash
curl -X POST http://localhost:3000/api/v1/auth/authorize \
  -H "Authorization: Bearer mock-jwt-token" \
  -H "user-id: 12345"
```

**Expected Response:**
```json
{
  "success": true,
  "userId": "12345"
}
```

### Test All Endpoints (Formatted Output)
```bash
# Login
echo "=== Testing Login ==="
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' | python3 -m json.tool

# Logout
echo -e "\n=== Testing Logout ==="
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "user-id: 12345" | python3 -m json.tool

# Authorize
echo -e "\n=== Testing Authorize ==="
curl -X POST http://localhost:3000/api/v1/auth/authorize \
  -H "Authorization: Bearer mock-jwt-token" \
  -H "user-id: 12345" | python3 -m json.tool
```

# SOFTWARE DEVELOPMENT KIT
## Definitions
### Routes
Defines the specific URL paths and HTTP methods (GET, POST, PUT, DELETE, etc.) that the server listens to. It acts as the entry point for incoming requests, mapping them to the appropriate handler.
### Middleware
Functions that have access to the request (req), response (res) objects, and the next middleware function in the application's request-response cycle. They can execute code, modify request and response objects, end the request-response cycle, or call the next middleware. Common uses include authentication, logging, parsing request bodies, and handling CORS. 
### Controllers
Handles incoming requests from the routes. It orchestrates the flow of data, validating input, invoking services to perform business logic, and preparing the response to be sent back to the client. Controllers should primarily focus on request/response handling and delegate complex operations.
### Services
Encapsulates the core business logic of the application. Services perform specific tasks, interact with data sources (e.g., databases via repositories), and contain the rules and operations that define the application's functionality. They promote reusability and separation of concerns.
