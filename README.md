# Image to Text Converter

A modern, advanced OCR (Optical Character Recognition) web application built with Next.js, TypeScript, and Tesseract.js. Extract text from images with support for multiple languages, image preprocessing, and intelligent text recognition.

## ✨ Features

### 🖼️ Image Processing
- **Drag & Drop Upload**: Intuitive file upload with drag and drop support
- **Multiple Formats**: Support for JPG, PNG, GIF, BMP, WebP, TIFF
- **Advanced Image Preprocessing**: Adjust brightness, contrast, rotation, and apply filters
- **Real-time Preview**: Live preview of uploaded and processed images
- **Fullscreen View**: Click to view images in fullscreen mode
- **Batch Processing**: Process multiple images simultaneously

### 🔤 Text Extraction
- **Multi-language Support**: Extract text in 100+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and more
- **Advanced OCR Engine**: Powered by Tesseract.js v5 for high accuracy
- **Customizable OCR Settings**: Adjust confidence threshold, page segmentation, and engine modes
- **Progress Tracking**: Real-time progress indicators during text extraction
- **Confidence Scoring**: Built-in confidence metrics for extracted text

### 📊 Text Analysis
- **Comprehensive Analytics**: Word count, character count, sentence analysis
- **Sentiment Analysis**: Detect positive, negative, or neutral sentiment
- **Language Detection**: Automatic language identification
- **Readability Scoring**: Flesch Reading Ease score calculation
- **Top Words Analysis**: Most frequent words identification
- **Reading Time Estimation**: Calculate estimated reading time

### ✏️ Text Management
- **Live Editing**: Edit extracted text directly in the interface
- **Search & Highlight**: Search within extracted text with highlighting
- **Text Statistics**: Comprehensive text metrics and analysis
- **Multiple Export Formats**: TXT, JSON, Markdown, HTML, PDF
- **Copy & Share**: Copy to clipboard, share, or email text
- **Format Preservation**: Maintains original text formatting

### 🎨 User Experience
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Dark/Light Theme**: Toggle between light and dark modes with persistence
- **Mobile Friendly**: Fully responsive design that works on all devices
- **Loading States**: Comprehensive loading indicators and progress bars
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance Optimized**: Lazy loading, memoization, and efficient rendering

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-to-text-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **OCR Engine**: Tesseract.js v5
- **Animations**: Framer Motion
- **File Handling**: React Dropzone
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📱 Usage

### Basic Workflow

1. **Upload Image**: Drag and drop an image or click to select
2. **Process Image** (Optional): Adjust brightness, contrast, or rotation
3. **Select Language**: Choose the language of the text in your image
4. **Extract Text**: Click "Extract Text" to start OCR processing
5. **Edit & Export**: Review, edit, and export the extracted text

### Tips for Best Results

- **Image Quality**: Use high-resolution images with clear, readable text
- **Contrast**: Ensure good contrast between text and background
- **Orientation**: Keep text horizontal and avoid excessive rotation
- **Language**: Select the correct language for better accuracy
- **Preprocessing**: Use the image processing tools to enhance clarity

## 🌍 Supported Languages

The application supports 100+ languages including:

- **European**: English, Spanish, French, German, Italian, Portuguese, Russian, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Serbian, Greek, Turkish
- **Asian**: Chinese (Simplified & Traditional), Japanese, Korean, Thai, Vietnamese, Hindi, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Punjabi, Urdu, Arabic, Hebrew, Persian
- **Others**: And many more...

## 🔧 Configuration

### Language Configuration
Languages are configured in `components/TextExtractor.tsx`. To add more languages:

```typescript
const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  // Add more languages here
]
```

### Image Processing Settings
Adjust image processing parameters in `components/ImageProcessor.tsx`:

```typescript
// Brightness range: 50-200%
// Contrast range: 50-200%
// Rotation: 0-360° in 90° increments
```

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── components/
│   ├── Header.tsx           # Application header
│   ├── ImageUploader.tsx    # File upload component
│   ├── ImagePreview.tsx     # Image preview and controls
│   ├── ImageProcessor.tsx   # Image preprocessing tools
│   ├── TextExtractor.tsx    # OCR text extraction
│   └── TextDisplay.tsx      # Text display and editing
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) for the powerful OCR engine
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include screenshots and error messages if applicable

---

**Made with ❤️ using Next.js and Tesseract.js**
