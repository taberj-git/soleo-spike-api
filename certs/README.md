# SSL Certificates Directory

This directory should contain your SSL certificates for HTTPS support.

## Required Files

- `server.key` - Private key file
- `server.cert` - Certificate file (or `server.crt`)

## For Development/Testing

You can generate self-signed certificates for local development:

```bash
# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

## For Production

Place your production SSL certificates in this directory:
- Obtain certificates from a Certificate Authority (CA)
- Or use Let's Encrypt certificates
- Ensure proper file permissions (private key should be read-only)

## Security Note

**IMPORTANT**: Never commit actual certificate files to version control!
- The `certs/` directory is added to `.gitignore`
- Only this README should be committed
- Store production certificates securely
