# SyncFlix - Synchronized Video Streaming Platform

SyncFlix is a web application that enables synchronized video playback across multiple users. Users can join streams and watch videos that are synchronized with a global timeline.

## Features

- 🎥 Synchronized video playback across users
- 🔄 Automatic video sequence management
- 🎮 Custom video controls (play/pause, volume, progress bar, fullscreen)
- 📱 Responsive design with modern UI
- 🎨 Stylish animations and transitions
- 🔒 Simple user authentication
- 📊 Real-time synchronization with server
- 🎬 Multiple quality level support (coming soon)

## Tech Stack

### Frontend
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

### Backend
- Node.js
- Express.js
- CORS enabled
- Custom logging system
- Error handling middleware

## Project Structure

```
SyncFlix/
├── backend/
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── stream.js
│   ├── utils/
│   │   └── logger.js
│   ├── config.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── videos/
    │       ├── video1.mp4
    │       ├── video2.mp4
    │       └── video3.mp4
    └── src/
        ├── app.js
        └── styles.css
```

## Setup Instructions

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd SyncFlix/backend
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will start on port 3001

4. Serve the frontend:
   ```bash
   cd ../frontend
   python3 -m http.server 8000
   ```
   The frontend will be available at http://localhost:8000/public

## Usage

1. Open http://localhost:8000/public in your browser
2. Enter a user ID (e.g., "user1" or "user2")
3. The video player will automatically sync with the global timeline
4. Videos will play in sequence according to the user's assigned playlist

## Available User IDs

- `user1`: Plays sequence [video1.mp4 → video2.mp4 → video3.mp4]
- `user2`: Plays sequence [video2.mp4 → video3.mp4 → video1.mp4]

## API Endpoints

- `GET /api/stream/position?userId={userId}`: Get current stream position for a user
- `GET /api/stream/health`: Check streaming service health

## Development

- Backend runs in development mode with nodemon for auto-reload
- Frontend uses Tailwind CSS via CDN for rapid styling
- Video files are served locally from the frontend/public/videos directory

## Author

Created by Harsh Bhatt

## License

MIT License