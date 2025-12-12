# Azure Deployment Guide for Soleo Spike API

This directory contains all the necessary files and scripts to deploy the Soleo Spike API to Azure Container Apps.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Files in this Directory](#files-in-this-directory)
- [Detailed Setup](#detailed-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)
- [Cost Estimation](#cost-estimation)
- [Cleanup](#cleanup)

## Overview

This deployment uses the following Azure services:

- **Azure Container Apps** - Serverless container hosting
- **Azure Container Registry (ACR)** - Private Docker registry
- **Azure Blob Storage** - File storage for uploads
- **Azure Key Vault** - Secrets management
- **Azure Application Insights** - Monitoring and diagnostics
- **Log Analytics** - Centralized logging

## Prerequisites

### Required Tools

1. **Azure CLI** (version 2.50+)
   ```bash
   # Install
   # macOS
   brew install azure-cli

   # Windows
   winget install Microsoft.AzureCLI

   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **jq** (JSON processor)
   ```bash
   # macOS
   brew install jq

   # Linux
   sudo apt-get install jq
   ```

3. **Git**
4. **Docker** (for local testing)

### Azure Account

- Active Azure subscription (ID: `207d8a05-e061-4dcf-a5d6-912ecb68cd98`)
- Owner or Contributor role on the subscription

## Quick Start

### 1. Run the Setup Script

```bash
cd azure
chmod +x setup.sh
./setup.sh
```

This script will:
- ✅ Create all Azure resources
- ✅ Configure networking and security
- ✅ Set up Application Insights
- ✅ Create a service principal for GitHub Actions
- ✅ Display GitHub secrets to configure

### 2. Configure GitHub Secrets

After running setup.sh, add these secrets to your GitHub repository:

Go to: `Settings → Secrets and variables → Actions → New repository secret`

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `AZURE_CLIENT_ID` | Service principal client ID | Output from setup.sh |
| `AZURE_TENANT_ID` | Azure tenant ID | Output from setup.sh |
| `AZURE_CLIENT_SECRET` | Service principal password | Output from setup.sh |
| `ACR_USERNAME` | Container registry username | Output from setup.sh |
| `ACR_PASSWORD` | Container registry password | Output from setup.sh |

### 3. Deploy

Push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Add Azure deployment configuration"
git push origin main
```

Monitor deployment at: `https://github.com/YOUR_USERNAME/soleo-spike-api/actions`

### 4. Access Your API

Your API will be available at:
```
https://soleo-spike-api-prod-app.RANDOM_ID.eastus.azurecontainerapps.io
```

(The exact URL will be shown in the setup.sh output and GitHub Actions logs)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
         ┌─────────────────────────────┐
         │  Azure Container Apps       │
         │  (Auto-scaling, HTTPS)      │
         └─────────────┬───────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌──────────┐
    │  Blob   │  │   Key   │  │   App    │
    │ Storage │  │  Vault  │  │ Insights │
    └─────────┘  └─────────┘  └──────────┘
```

### Resource Naming Convention

| Resource Type | Name Pattern | Example |
|---------------|--------------|---------|
| Container Registry | `{app}-{env}acr` | `soleo-spike-apiprodacr` |
| Storage Account | `{app}-{env}stor` | `soleo-spike-apiprodstor` |
| Key Vault | `{app}-{env}-kv` | `soleo-spike-api-prod-kv` |
| Container App | `{app}-{env}-app` | `soleo-spike-api-prod-app` |
| App Insights | `{app}-{env}-insights` | `soleo-spike-api-prod-insights` |

## Files in this Directory

| File | Description |
|------|-------------|
| `main.bicep` | Infrastructure as Code (Bicep template) |
| `parameters.json` | Configuration parameters |
| `setup.sh` | One-command setup script |
| `.env.azure.example` | Example environment variables |
| `README.md` | This file |

## Detailed Setup

### Option 1: Automated Setup (Recommended)

Use the provided script:
```bash
./setup.sh
```

### Option 2: Manual Setup

#### Step 1: Login to Azure

```bash
az login
az account set --subscription 207d8a05-e061-4dcf-a5d6-912ecb68cd98
```

#### Step 2: Create Resource Group

```bash
az group create \
  --name soleo-spike-rg \
  --location eastus
```

#### Step 3: Deploy Infrastructure

```bash
az deployment group create \
  --resource-group soleo-spike-rg \
  --template-file main.bicep \
  --parameters parameters.json
```

#### Step 4: Get Deployment Outputs

```bash
az deployment group show \
  --resource-group soleo-spike-rg \
  --name main \
  --query 'properties.outputs'
```

#### Step 5: Create Service Principal

```bash
az ad sp create-for-rbac \
  --name soleo-spike-api-github-sp \
  --role contributor \
  --scopes /subscriptions/207d8a05-e061-4dcf-a5d6-912ecb68cd98/resourceGroups/soleo-spike-rg \
  --sdk-auth
```

#### Step 6: Get ACR Credentials

```bash
ACR_NAME=$(az acr list --resource-group soleo-spike-rg --query "[0].name" -o tsv)
az acr credential show --name $ACR_NAME
```

## CI/CD Pipeline

### How It Works

The GitHub Actions workflow (`.github/workflows/azure-deploy.yml`) automatically:

1. **Build**: Compiles TypeScript and builds Docker image
2. **Push**: Pushes image to Azure Container Registry
3. **Deploy**: Updates Container App with new image
4. **Health Check**: Verifies deployment succeeded

### Triggering Deployment

**Automatic**: Push to `main` branch
```bash
git push origin main
```

**Manual**: Trigger from GitHub UI
1. Go to Actions tab
2. Select "Azure Deployment"
3. Click "Run workflow"
4. Choose environment (dev/staging/prod)

### Monitoring Deployment

```bash
# Via GitHub CLI
gh run list --workflow=azure-deploy.yml
gh run watch

# Via Web
# https://github.com/YOUR_USERNAME/soleo-spike-api/actions
```

## Monitoring and Logs

### Application Insights

Access metrics and diagnostics:
```bash
# Get Application Insights URL
az monitor app-insights component show \
  --resource-group soleo-spike-rg \
  --app soleo-spike-api-prod-insights \
  --query 'appId' -o tsv
```

Then visit: `https://portal.azure.com/#@/resource/.../overview`

### Live Logs

```bash
# Container App logs
az containerapp logs show \
  --name soleo-spike-api-prod-app \
  --resource-group soleo-spike-rg \
  --follow
```

### Metrics

```bash
# Get metrics
az monitor metrics list \
  --resource /subscriptions/207d8a05-e061-4dcf-a5d6-912ecb68cd98/resourceGroups/soleo-spike-rg/providers/Microsoft.App/containerApps/soleo-spike-api-prod-app \
  --metric "Requests"
```

## Troubleshooting

### Deployment Fails

**Check deployment logs:**
```bash
az deployment group show \
  --resource-group soleo-spike-rg \
  --name main \
  --query 'properties.error'
```

**Common issues:**
- Invalid subscription ID → Verify in Azure Portal
- Resource name conflicts → Resources already exist, delete or rename
- Permission denied → Check you have Owner/Contributor role

### Container App Won't Start

**View logs:**
```bash
az containerapp logs show \
  --name soleo-spike-api-prod-app \
  --resource-group soleo-spike-rg \
  --tail 100
```

**Common issues:**
- Image pull failed → Check ACR credentials in secrets
- Port mismatch → Ensure Dockerfile EXPOSE 8001 and env PORT=8001
- Missing environment variables → Check container app configuration

### Health Check Fails

**Test endpoint directly:**
```bash
APP_URL=$(az containerapp show \
  --name soleo-spike-api-prod-app \
  --resource-group soleo-spike-rg \
  --query properties.configuration.ingress.fqdn -o tsv)

curl https://$APP_URL/health
```

**Expected response:**
```json
{"status":"ok","uptime":123.456}
```

### GitHub Actions Fails

**Check secrets:**
```bash
# In GitHub repository settings
Settings → Secrets and variables → Actions
```

Verify all 5 secrets are configured:
- ✅ AZURE_CLIENT_ID
- ✅ AZURE_TENANT_ID
- ✅ AZURE_CLIENT_SECRET
- ✅ ACR_USERNAME
- ✅ ACR_PASSWORD

## Cost Estimation

Monthly costs for production workload (approximate):

| Service | Tier | Estimated Cost |
|---------|------|----------------|
| Container Apps | 1 vCPU, 2GB RAM | $30-50 |
| Container Registry | Basic | $5 |
| Blob Storage | 10GB | $0.20 |
| Key Vault | Standard | $0.03 per 10k operations |
| Application Insights | 1GB data | Free tier |
| Log Analytics | 5GB/month | Free tier |
| **Total** | | **~$35-60/month** |

### Cost Optimization Tips

1. **Use auto-scaling min replicas = 0** (scale to zero when idle)
2. **Enable blob storage lifecycle policies** (delete old uploads)
3. **Set log retention** to 30 days instead of default 90
4. **Use reservation pricing** if running 24/7

## Cleanup

### Delete All Resources

```bash
az group delete \
  --name soleo-spike-rg \
  --yes --no-wait
```

### Delete Service Principal

```bash
# Get app ID
APP_ID=$(az ad sp list --display-name soleo-spike-api-github-sp --query "[0].appId" -o tsv)

# Delete
az ad sp delete --id $APP_ID
```

### Remove GitHub Secrets

```bash
# Via gh CLI
gh secret delete AZURE_CLIENT_ID
gh secret delete AZURE_TENANT_ID
gh secret delete AZURE_CLIENT_SECRET
gh secret delete ACR_USERNAME
gh secret delete ACR_PASSWORD
```

## Additional Resources

- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Bicep Documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Azure Portal activity logs
3. Check GitHub Actions workflow logs
4. Review Application Insights diagnostics
