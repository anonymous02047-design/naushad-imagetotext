#!/bin/bash

echo "========================================"
echo "    Vercel Deployment Script"
echo "========================================"
echo

echo "[1/4] Checking if Vercel CLI is installed..."
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "Failed to install Vercel CLI. Please install manually."
        exit 1
    fi
else
    echo "Vercel CLI is already installed."
fi

echo
echo "[2/4] Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed. Please check the errors above."
    exit 1
fi

echo
echo "[3/4] Deploying to Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "Deployment failed. Please check the errors above."
    exit 1
fi

echo
echo "[4/4] Deployment completed successfully!"
echo
echo "Your app is now live on Vercel!"
echo "Check your Vercel dashboard for the deployment URL."
echo
