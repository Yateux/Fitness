# Fitness Video Tracker

A modern web application for organizing and tracking your YouTube workout videos. Built with React and Firebase, featuring real-time synchronization, drag-and-drop organization, and automatic progress tracking.

## Features

- **Category Management** - Organize videos into custom workout categories
- **Drag & Drop** - Intuitive reordering of categories and videos
- **YouTube Integration** - Add videos with live preview and automatic title fetching
- **Video Player** - Built-in YouTube player with playback tracking
- **Progress Tracking** - Automatic time tracking for each video
- **Real-time Sync** - Firebase Firestore integration for instant data synchronization
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Modern UI** - Professional dark theme with smooth animations

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Firebase account (free tier available)
- YouTube Data API key (optional, for auto-fetching titles)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fitness-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Copy the example environment file:
```bash
cp .env.example .env
```

Add your Firebase configuration to `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Optional - Add YouTube API key for automatic title fetching:
```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

4. **Set up Firestore**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new Firestore database in production mode
   - Update security rules from `firestore.rules`

5. **Start development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

## Usage

1. **Create Categories** - Click "New Category" to organize your workouts
2. **Add Videos** - Use "Add Video" or click the dashed card in a category
3. **Organize** - Drag and drop to reorder categories and videos
4. **Track Progress** - Watch time is automatically recorded
5. **Edit Anytime** - Update titles, URLs, and categories as needed

## Tech Stack

- **React 19** - Modern UI framework
- **Vite 7** - Lightning-fast build tool
- **Firebase Firestore** - Real-time NoSQL database
- **React Router 7** - Client-side routing
- **@dnd-kit** - Drag and drop functionality
- **react-youtube** - YouTube player integration
- **lucide-react** - Icon library
- **CSS Variables** - Themeable design system

## Project Structure

```
fitness-tracker/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── VideoCard.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── YouTubePreview.jsx
│   │   └── ...Modal components
│   ├── pages/              # Application pages
│   │   ├── Home.jsx
│   │   ├── CategoryPage.jsx
│   │   └── VideoPlayer.jsx
│   ├── context/            # Global state management
│   │   └── AppContext.jsx
│   ├── services/           # External services
│   │   └── firebaseService.js
│   ├── config/             # Configuration
│   │   └── firebase.js
│   ├── utils/              # Helper functions
│   │   ├── youtube.js
│   │   └── time.js
│   └── styles/             # CSS modules
├── .env.example            # Environment template
├── firestore.rules         # Firestore security rules
└── vercel.json            # Deployment configuration
```

## Architecture

The application follows a modern React architecture:

- **Components** - Modular, reusable UI elements with drag-and-drop
- **Pages** - Route-based views using React Router
- **Context API** - Global state management
- **Firebase Service** - Abstracted database operations
- **Real-time Updates** - Firestore subscriptions for live data

### Data Flow

```
Firebase Firestore (Cloud)
    ↓ Real-time subscriptions
firebaseService.js
    ↓ CRUD operations
AppContext.jsx (Global State)
    ↓ Props & hooks
Components & Pages
    ↓ User interactions
firebaseService.js
    ↓ Write operations
Firebase Firestore (Cloud)
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables from `.env`
4. Deploy automatically

### Other Platforms

The app is a standard Vite React application and can be deployed to:
- Netlify
- Firebase Hosting
- AWS Amplify
- Cloudflare Pages

## Security Considerations

The default Firestore rules allow open access for development. For production:

1. Implement Firebase Authentication
2. Update Firestore rules to restrict access
3. Add server-side validation
4. Secure API keys

Example production rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review Firebase and Vite documentation

## Roadmap

Potential future enhancements:
- User authentication and profiles
- Workout plans and schedules
- Exercise statistics and analytics
- Social sharing features
- Offline support with PWA
- Multi-language support
