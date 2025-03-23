// Constants
const API_BASE_URL = 'http://localhost:3000/api/stream';

// API call with error handling
async function fetchStreamPosition(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/position?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching stream position:', error);
        throw error;
    }
}

// DOM Elements
const loginSection = document.getElementById('loginSection');
const playerSection = document.getElementById('playerSection');
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');
const username = document.getElementById('username');
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const timeDisplay = document.getElementById('timeDisplay');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const qualityBtn = document.getElementById('qualityBtn');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');

// State
let currentUserId = null;
let streamUpdateInterval = null;
let isPlaying = false;

// Helper Functions
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const updateProgress = () => {
    const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progress.style.width = `${percentage}%`;
    timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
};

const togglePlay = () => {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
};

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        playerSection.requestFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
};

// Stream Management
const updateStream = async () => {
    try {
        const { data } = await fetchStreamPosition(currentUserId);
        
        // Update video source if it's different
        if (videoPlayer.src !== data.videoUrl) {
            // Create animated canvas video
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 360;
            const ctx = canvas.getContext('2d');
            
            let animationFrame;
            const animate = (time) => {
                // Create gradient background with moving colors
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, `hsl(${time/50 % 360}, 50%, 15%)`);
                gradient.addColorStop(1, `hsl(${(time/50 + 180) % 360}, 50%, 20%)`);
                
                // Fill background
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add animated text
                ctx.fillStyle = '#fff';
                ctx.font = '30px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(`Playing: ${data.videoUrl.split('/').pop()}`, canvas.width/2, canvas.height/2);
                
                // Add progress bar
                const progress = (time/5000) % 1;
                ctx.fillStyle = '#fff';
                ctx.fillRect(100, canvas.height - 50, (canvas.width - 200) * progress, 4);
                
                animationFrame = requestAnimationFrame(animate);
            };
            
            // Start animation
            animate(0);
            
            // Convert canvas to video stream
            const stream = canvas.captureStream();
            if (videoPlayer.srcObject) {
                // Clean up old animation if exists
                cancelAnimationFrame(animationFrame);
            }
            videoPlayer.srcObject = stream;
            videoTitle.textContent = `Now Playing: Video ${data.videoUrl.split('/').pop()}`;
            videoDescription.textContent = `Next up: Video ${data.nextVideoId}`;
        }

        // Sync video position if difference is more than 2 seconds
        const timeDiff = Math.abs(videoPlayer.currentTime - data.offset);
        if (timeDiff > 2) {
            videoPlayer.currentTime = data.offset;
        }

        // Start playing if not already playing
        if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

    } catch (error) {
        console.error('Error updating stream:', error);
        videoDescription.textContent = 'Error syncing with server. Retrying...';
    }
};

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    
    if (!userId) return;

    currentUserId = userId;
    username.textContent = userId;
    
    loginSection.classList.add('hidden');
    playerSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');

    // Start stream updates
    await updateStream();
    streamUpdateInterval = setInterval(updateStream, 5000);
});

videoPlayer.addEventListener('timeupdate', updateProgress);
playPauseBtn.addEventListener('click', togglePlay);
fullscreenBtn.addEventListener('click', toggleFullscreen);
volumeSlider.addEventListener('input', (e) => {
    videoPlayer.volume = e.target.value;
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
    videoPlayer.currentTime = pos * videoPlayer.duration;
});

// Quality selection
qualityBtn.addEventListener('click', () => {
    // In a real implementation, this would show a quality selection menu
    alert('Quality selection coming soon!');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (streamUpdateInterval) {
        clearInterval(streamUpdateInterval);
    }
});