@echo off
echo ========================================
echo    Vercel Deployment Script
echo ========================================
echo.

echo [1/4] Checking if Vercel CLI is installed...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI. Please install manually.
        pause
        exit /b 1
    )
) else (
    echo Vercel CLI is already installed.
)

echo.
echo [2/4] Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo [3/4] Deploying to Vercel...
vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo [4/4] Deployment completed successfully!
echo.
echo Your app is now live on Vercel!
echo Check your Vercel dashboard for the deployment URL.
echo.
pause
