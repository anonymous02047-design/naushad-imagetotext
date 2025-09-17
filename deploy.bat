@echo off
echo 🚀 Naushad ImageToText App Deployment Script
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

REM Build the app
echo 🔨 Building the app...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Export static files
echo 📤 Exporting static files...
npm run export
if %errorlevel% neq 0 (
    echo ❌ Export failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Export successful!
echo.
echo 🎉 Your app is ready for deployment!
echo.
echo 📁 Static files are in the 'out' directory
echo.
echo 🌐 Deployment Options:
echo 1. GitHub Pages: Upload 'out' folder to gh-pages branch
echo 2. Netlify: Drag 'out' folder to Netlify dashboard
echo 3. Vercel: Run 'vercel --prod' from project directory
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
