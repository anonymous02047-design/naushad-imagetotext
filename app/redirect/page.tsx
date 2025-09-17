import { redirect } from 'next/navigation'

export default function RedirectPage() {
  // This page will handle redirects via client-side JavaScript
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin border-4 border-primary-600 border-t-transparent rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Processing Redirect
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please wait while we redirect you...
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full animate-pulse"></div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('Redirect script started');
                const urlParams = new URLSearchParams(window.location.search);
                const shortId = urlParams.get('id');
                console.log('Short ID:', shortId);
                
                if (!shortId) {
                  console.log('No short ID found');
                  document.body.innerHTML = '<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center"><div class="w-12 h-12 mx-auto mb-4 text-red-600">⚠️</div><h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Redirect Error</h1><p class="text-gray-600 dark:text-gray-400 mb-4">Invalid short URL</p><button onclick="window.location.href=\'/\'" class="bg-primary-600 text-white px-4 py-2 rounded-lg">Go to Homepage</button></div></div>';
                  return;
                }
                
                const urlHistory = localStorage.getItem('url-shortener-history');
                console.log('URL History:', urlHistory);
                
                if (!urlHistory) {
                  console.log('No URL history found');
                  document.body.innerHTML = '<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center"><div class="w-12 h-12 mx-auto mb-4 text-red-600">⚠️</div><h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Redirect Error</h1><p class="text-gray-600 dark:text-gray-400 mb-4">Short URL not found</p><button onclick="window.location.href=\'/\'" class="bg-primary-600 text-white px-4 py-2 rounded-lg">Go to Homepage</button></div></div>';
                  return;
                }
                
                try {
                  const urls = JSON.parse(urlHistory);
                  console.log('Parsed URLs:', urls);
                  
                  // Find URL by checking if the shortId is in the shortUrl
                  const urlData = urls.find(url => {
                    const urlId = url.shortUrl.split('id=')[1];
                    return urlId === shortId;
                  });
                  
                  console.log('Found URL data:', urlData);
                  
                  if (!urlData) {
                    console.log('URL data not found for short ID:', shortId);
                    document.body.innerHTML = '<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center"><div class="w-12 h-12 mx-auto mb-4 text-red-600">⚠️</div><h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Redirect Error</h1><p class="text-gray-600 dark:text-gray-400 mb-4">Short URL not found</p><button onclick="window.location.href=\'/\'" class="bg-primary-600 text-white px-4 py-2 rounded-lg">Go to Homepage</button></div></div>';
                    return;
                  }
                  
                  console.log('Redirecting to:', urlData.originalUrl);
                  
                  // Update click count
                  const updatedUrls = urls.map(url => 
                    url.id === urlData.id 
                      ? { ...url, clicks: (url.clicks || 0) + 1, lastAccessed: new Date().toISOString() }
                      : url
                  );
                  localStorage.setItem('url-shortener-history', JSON.stringify(updatedUrls));
                  
                  // Update the page to show redirecting status
                  document.querySelector('h1').textContent = 'Redirecting...';
                  document.querySelector('p').textContent = 'You are being redirected to: ' + urlData.originalUrl;
                  
                  // Redirect immediately
                  window.location.href = urlData.originalUrl;
                  
                } catch (error) {
                  console.error('Error processing redirect:', error);
                  document.body.innerHTML = '<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center"><div class="w-12 h-12 mx-auto mb-4 text-red-600">⚠️</div><h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Redirect Error</h1><p class="text-gray-600 dark:text-gray-400 mb-4">Failed to process redirect</p><button onclick="window.location.href=\'/\'" class="bg-primary-600 text-white px-4 py-2 rounded-lg">Go to Homepage</button></div></div>';
                }
              })();
            `
          }}
        />
      </div>
    </div>
  )
}
