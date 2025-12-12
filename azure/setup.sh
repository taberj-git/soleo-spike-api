#!/bin/bash
set -e

# Azure Setup Script for Soleo Spike API
# This script provisions all Azure resources for the application

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SUBSCRIPTION_ID="207d8a05-e061-4dcf-a5d6-912ecb68cd98"
RESOURCE_GROUP="soleo-spike-rg"
LOCATION="eastus"
APP_NAME="soleo-spike-api"
ENVIRONMENT="prod"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Azure Setup for Soleo Spike API${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login to Azure
echo -e "${YELLOW}Step 1: Azure Login${NC}"
az account show &> /dev/null || az login
az account set --subscription "$SUBSCRIPTION_ID"
echo -e "${GREEN}✓ Logged in to Azure${NC}"
echo ""

# Create resource group
echo -e "${YELLOW}Step 2: Creating Resource Group${NC}"
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none

echo -e "${GREEN}✓ Resource group created: $RESOURCE_GROUP${NC}"
echo ""

# Deploy infrastructure using Bicep
echo -e "${YELLOW}Step 3: Deploying Infrastructure (this may take 5-10 minutes)${NC}"
echo -e "${GREEN}Using simplified deployment (no RBAC role assignments)${NC}"
DEPLOYMENT_OUTPUT=$(az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file "$(dirname "$0")/main-no-rbac.bicep" \
  --parameters "$(dirname "$0")/parameters.json" \
  --query 'properties.outputs' \
  --output json)

echo -e "${GREEN}✓ Infrastructure deployed${NC}"
echo ""

# Extract outputs
ACR_LOGIN_SERVER=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.containerRegistryLoginServer.value')
ACR_NAME=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.containerRegistryName.value')
STORAGE_ACCOUNT=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.storageAccountName.value')
KEY_VAULT=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.keyVaultName.value')
APP_URL=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.containerAppUrl.value')
APP_INSIGHTS_KEY=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.appInsightsInstrumentationKey.value')
APP_INSIGHTS_CONN=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.appInsightsConnectionString.value')

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Container Registry: ${YELLOW}$ACR_LOGIN_SERVER${NC}"
echo -e "Storage Account: ${YELLOW}$STORAGE_ACCOUNT${NC}"
echo -e "Key Vault: ${YELLOW}$KEY_VAULT${NC}"
echo -e "Application URL: ${YELLOW}https://$APP_URL${NC}"
echo ""

# Get ACR credentials
echo -e "${YELLOW}Step 4: Getting Container Registry Credentials${NC}"
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query 'username' -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query 'passwords[0].value' -o tsv)

echo -e "${GREEN}✓ Retrieved ACR credentials${NC}"
echo ""

# Create service principal for GitHub Actions
echo -e "${YELLOW}Step 5: Creating Service Principal for GitHub Actions${NC}"
SP_NAME="$APP_NAME-github-sp"

SP_OUTPUT=$(az ad sp create-for-rbac \
  --name "$SP_NAME" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth)

AZURE_CLIENT_ID=$(echo "$SP_OUTPUT" | jq -r '.clientId')
AZURE_TENANT_ID=$(echo "$SP_OUTPUT" | jq -r '.tenantId')
AZURE_CLIENT_SECRET=$(echo "$SP_OUTPUT" | jq -r '.clientSecret')

echo -e "${GREEN}✓ Service principal created${NC}"
echo ""

# Display GitHub Secrets
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}GitHub Secrets Configuration${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Add these secrets to your GitHub repository:"
echo -e "(Settings → Secrets and variables → Actions → New repository secret)"
echo ""
echo -e "${YELLOW}AZURE_CREDENTIALS:${NC}"
echo "$SP_OUTPUT"
echo ""
echo -e "${YELLOW}ACR_USERNAME:${NC}"
echo "$ACR_USERNAME"
echo ""
echo -e "${YELLOW}ACR_PASSWORD:${NC}"
echo "$ACR_PASSWORD"
echo ""
echo -e "${GREEN}Note: AZURE_CREDENTIALS is the complete JSON output from service principal creation${NC}"
echo ""

# Save outputs to file
OUTPUT_FILE="$(dirname "$0")/deployment-outputs.json"
cat > "$OUTPUT_FILE" << EOF
{
  "resourceGroup": "$RESOURCE_GROUP",
  "location": "$LOCATION",
  "acrLoginServer": "$ACR_LOGIN_SERVER",
  "acrName": "$ACR_NAME",
  "storageAccount": "$STORAGE_ACCOUNT",
  "keyVault": "$KEY_VAULT",
  "appUrl": "https://$APP_URL",
  "appInsightsInstrumentationKey": "$APP_INSIGHTS_KEY",
  "appInsightsConnectionString": "$APP_INSIGHTS_CONN",
  "githubSecrets": {
    "AZURE_CLIENT_ID": "$AZURE_CLIENT_ID",
    "AZURE_TENANT_ID": "$AZURE_TENANT_ID",
    "ACR_USERNAME": "$ACR_USERNAME",
    "note": "AZURE_CLIENT_SECRET and ACR_PASSWORD not saved for security"
  }
}
EOF

echo -e "${GREEN}✓ Deployment outputs saved to: $OUTPUT_FILE${NC}"
echo ""

# Next steps
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Next Steps${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "1. Add the GitHub secrets shown above to your repository"
echo "2. Push code to the main branch to trigger deployment"
echo "3. Monitor deployment at: https://github.com/YOUR_USERNAME/soleo-spike-api/actions"
echo "4. Access your API at: https://$APP_URL"
echo ""
echo -e "${GREEN}Setup complete! 🎉${NC}"
