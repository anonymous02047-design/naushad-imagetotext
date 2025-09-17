#!/bin/bash

# Naushad ImageToText App Deployment Script
# This script helps you deploy your app to various platforms

echo "🚀 Naushad ImageToText App Deployment Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building the app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Export static files
echo "📤 Exporting static files..."
npm run export

if [ $? -eq 0 ]; then
    echo "✅ Export successful!"
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "📁 Static files are in the 'out' directory"
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. GitHub Pages: Upload 'out' folder to gh-pages branch"
    echo "2. Netlify: Drag 'out' folder to Netlify dashboard"
    echo "3. Vercel: Run 'vercel --prod' from project directory"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
else
    echo "❌ Export failed. Please check the errors above."
    exit 1
fi
