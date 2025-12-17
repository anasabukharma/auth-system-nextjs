#!/bin/bash

# Cloudflare Deployment Script
# This script will deploy your project to Cloudflare automatically

set -e

echo "🚀 Starting Cloudflare Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi

echo -e "${BLUE}📋 Step 1: Login to Cloudflare${NC}"
echo "This will open a browser window for authentication..."
wrangler login

echo ""
echo -e "${BLUE}📋 Step 2: Create D1 Database${NC}"
echo "Creating database: auth-system-db"
DB_OUTPUT=$(wrangler d1 create auth-system-db 2>&1 || echo "EXISTS")

if [[ $DB_OUTPUT == *"already exists"* ]] || [[ $DB_OUTPUT == *"EXISTS"* ]]; then
    echo -e "${YELLOW}⚠️  Database already exists${NC}"
    # Get existing database ID
    DB_ID=$(wrangler d1 list | grep "auth-system-db" | awk '{print $2}' || echo "")
else
    # Extract database ID from output
    DB_ID=$(echo "$DB_OUTPUT" | grep "database_id" | cut -d'"' -f2)
    echo -e "${GREEN}✅ Database created!${NC}"
fi

if [ -z "$DB_ID" ]; then
    echo -e "${RED}❌ Could not get database ID${NC}"
    echo "Please create database manually and update wrangler.toml"
    exit 1
fi

echo "Database ID: $DB_ID"

echo ""
echo -e "${BLUE}📋 Step 3: Update wrangler.toml${NC}"
cd workers
sed -i "s/database_id = \"\"/database_id = \"$DB_ID\"/" wrangler.toml
echo -e "${GREEN}✅ wrangler.toml updated${NC}"

echo ""
echo -e "${BLUE}📋 Step 4: Initialize Database Schema${NC}"
wrangler d1 execute auth-system-db --file=schema.sql
echo -e "${GREEN}✅ Database schema initialized${NC}"

echo ""
echo -e "${BLUE}📋 Step 5: Deploy Worker${NC}"
wrangler deploy
echo -e "${GREEN}✅ Worker deployed!${NC}"

# Get worker URL
WORKER_URL=$(wrangler deployments list 2>&1 | grep "https://" | head -1 | awk '{print $1}' || echo "")

if [ -z "$WORKER_URL" ]; then
    echo -e "${YELLOW}⚠️  Could not automatically detect Worker URL${NC}"
    echo "Please check: https://dash.cloudflare.com"
else
    echo ""
    echo -e "${GREEN}🎉 Worker URL: $WORKER_URL${NC}"
fi

cd ..

echo ""
echo -e "${BLUE}📋 Step 6: Deploy Frontend to Pages${NC}"
echo ""
echo "⚠️  Frontend deployment needs to be done via Dashboard:"
echo ""
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Workers & Pages → Create application → Pages"
echo "3. Connect to Git → Select: auth-system-nextjs"
echo "4. Build settings:"
echo "   - Root directory: frontend"
echo "   - Build command: pnpm build"
echo "   - Build output directory: out"
echo "5. Environment variables:"
echo "   - NEXT_PUBLIC_API_URL = $WORKER_URL"
echo "6. Save and Deploy"
echo ""

echo -e "${GREEN}✅ Backend deployment complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Deploy Frontend via Dashboard (see instructions above)"
echo "2. Test your application"
echo ""
echo "🔗 Useful links:"
echo "   - Dashboard: https://dash.cloudflare.com"
echo "   - Worker URL: $WORKER_URL"
echo "   - GitHub: https://github.com/anasabukharma/auth-system-nextjs"
echo ""
echo "🎉 Done!"
