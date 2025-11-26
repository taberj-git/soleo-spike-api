# API v1 Documentation

This directory contains comprehensive documentation for all API v1 endpoints.

## Endpoint Documentation

### Authentication Endpoints

| Endpoint | Document | Description |
|----------|----------|-------------|
| `POST /api/v1/auth/login` | [login-workflow.md](./login-workflow.md) | User authentication with username/password |
| `POST /api/v1/auth/logout` | [logout-workflow.md](./logout-workflow.md) | Session termination and cleanup |
| `POST /api/v1/auth/authorize` | [authorize-workflow.md](./authorize-workflow.md) | Token validation and access verification |

## Documentation Structure

Each endpoint documentation includes:

1. **Endpoint Details**
   - URL and HTTP method
   - Purpose and description
   - Authentication requirements

2. **Request/Response Formats**
   - Required headers
   - Request body schema
   - Success response format
   - Error response format

3. **Workflow Diagrams**
   - Complete sequence diagram showing:
     - Client-server interaction
     - Layer-by-layer flow
     - Logger integration
     - Error handling paths

4. **Data Flow**
   - Step-by-step request processing
   - Middleware chain
   - Layer responsibilities
   - Response path

5. **Use Cases**
   - Common scenarios
   - Actor descriptions
   - Preconditions and postconditions
   - Flow steps

6. **Security Considerations**
   - Current implementation notes
   - Production requirements
   - Best practices
   - Vulnerability mitigation

7. **Testing**
   - Manual test commands
   - Expected responses
   - Test variations

8. **Code References**
   - Exact file paths and line numbers
   - Related components

9. **Future Enhancements**
   - Planned improvements
   - Production requirements

## Architecture Overview

```
Client Request
      ↓
Server (HTTP/HTTPS)
      ↓
Middleware Chain
  - CORS
  - JSON Parser
  - Logging
      ↓
Route Layer (auth.routes.ts)
  - URL matching
  - Request forwarding
  - Error wrapping
      ↓
Controller Layer (auth.controller.ts)
  - Request handling
  - Service orchestration
  - Response preparation
      ↓
Service Layer (auth.service.ts)
  - Business logic
  - Data extraction
  - Authenticator calls
      ↓
Authenticator Layer (azure-authenticator.ts)
  - Authentication logic
  - External service integration
  - Response generation
      ↓
Response Path (reverse flow)
```

## Layer Responsibilities

### Routes (`src/api/v1/routes/`)
- Define HTTP endpoints
- Map URLs to controller methods
- Handle HTTP-level errors
- Send HTTP responses

### Controllers (`src/api/v1/controllers/`)
- Receive HTTP requests
- Extract and validate input
- Call service methods
- Prepare HTTP responses
- Handle application errors

### Services (`src/api/v1/services/`)
- Implement business logic
- Process data
- Call authenticator/external services
- Return domain objects
- Handle business errors

### Authenticators (`src/api/v1/services/`)
- Implement authentication logic
- Integrate with external auth providers
- Validate credentials/tokens
- Return authentication results

## Logging Strategy

All layers implement comprehensive logging:

```typescript
// Entry point logging
logger.trace(`enter [Layer].[Method] with ${data}`);

// Business logic logging
logger.debug(`processing ${operation}`);

// Error logging
logger.error(`Exit [Layer].[Method] caught an error:`, error.message);

// Exit point logging
logger.trace(`exit [Layer].[Method]`);
```

## Error Handling Pattern

```typescript
try {
  // Operation
  const result = await service.method();
  return result;
} catch (error: unknown) {
  if (error instanceof Error) {
    logger.error('caught an error:', error.message);
    throw error;
  } else {
    logger.error(`unexpected error occurred: ${String(error)}`);
    throw new Error(`unexpected error occurred: ${String(error)}`);
  }
}
```

## Development vs Production

### Current Implementation (Development)
- Mock authentication (always succeeds)
- Hardcoded responses
- Minimal validation
- Verbose logging including sensitive data

### Production Requirements
Each endpoint document includes detailed production requirements:
- Real authentication integration
- Proper validation
- Security best practices
- Rate limiting
- Audit logging
- Error handling
- Token management

## Quick Reference

### Test All Endpoints
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Logout
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "user-id: 12345"

# Authorize
curl -X POST http://localhost:3000/api/v1/auth/authorize \
  -H "Authorization: Bearer mock-jwt-token" \
  -H "user-id: 12345"
```

## Contributing

When adding new endpoints:

1. Create a new `[endpoint-name]-workflow.md` file
2. Follow the existing documentation structure
3. Include complete sequence diagrams
4. Document all use cases
5. Add security considerations
6. Provide test examples
7. Update this README with links

## Viewing Diagrams

The Mermaid diagrams can be viewed:
- In GitHub (automatic rendering)
- In VS Code (with Mermaid extension)
- In any Markdown viewer with Mermaid support
- Online at [mermaid.live](https://mermaid.live)

## Related Documentation

- Main README: `../../README.md`
- Architecture Guide: (Coming soon)
- API Reference: (Coming soon)
- Deployment Guide: (Coming soon)
