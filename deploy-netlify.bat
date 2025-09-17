@echo off
echo 🚀 Deploying Naushad ImageToText App to Netlify
echo ================================================

echo 📦 Building the app...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!

echo 📁 Static files are ready in the 'out' directory
echo.
echo 🌐 Netlify Deployment Options:
echo.
echo Method 1 - Drag & Drop (Easiest):
echo 1. Go to https://app.netlify.com
echo 2. Drag the 'out' folder to the deploy area
echo 3. Your site will be live instantly!
echo.
echo Method 2 - Git Integration:
echo 1. Push your code to GitHub
echo 2. Connect your GitHub repo to Netlify
echo 3. Set build command: npm run build
echo 4. Set publish directory: out
echo.
echo Method 3 - Netlify CLI:
echo 1. Install: npm install -g netlify-cli
echo 2. Login: netlify login
echo 3. Deploy: netlify deploy --prod --dir=out
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
echo 🎉 Your app is ready for deployment!
echo.
pause
