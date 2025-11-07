import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { X, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { getVideoById, watchTime, addWatchTime, setWatchTime, isLoading } = useApp();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [player, setPlayer] = useState<any>(null);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const sessionTimeRef = useRef<number>(0);

  const video = getVideoById(videoId);

  useEffect(() => {
    sessionTimeRef.current = sessionTime;
  }, [sessionTime]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (sessionTimeRef.current > 0 && videoId) {
        addWatchTime(videoId, sessionTimeRef.current);
      }
    };
  }, [videoId, addWatchTime]);

  if (isLoading) {
    return (
      <div className="video-player-page">
        <LoadingSpinner size="large" text="Loading video..." />
      </div>
    );
  }

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    setVideoLoading(false);
  };

  const handleStateChange = (event: YouTubeEvent) => {
    const playerState = event.data;
    console.log('YouTube state:', playerState);

    setIsPlaying(playerState === 1);
  };

  const handleStartStop = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleClose = () => {
    if (sessionTimeRef.current > 0 && videoId) {
      addWatchTime(videoId, sessionTimeRef.current);
    }
    navigate(-1);
  };

  const handleResetTime = () => {
    if (window.confirm('Do you really want to reset the time for this video?') && video) {
      setSessionTime(0);
      setWatchTime({
        ...watchTime,
        [video.id]: 0
      });
    }
  };

  if (!video) {
    return (
      <div className="video-player-page">
        <div className="error-message">
          <h2>Video not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <div className="video-container">
        <div className="video-header">
          <h2>{video.title}</h2>
          <button className="btn btn-secondary" onClick={handleClose}>
            <X size={18} />
            Close
          </button>
        </div>

        <div className="video-wrapper">
          {videoLoading && (
            <div className="video-loading-overlay">
              <LoadingSpinner size="medium" text="Loading YouTube player..." />
            </div>
          )}
          <YouTube
            videoId={video.videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 0,
              },
            }}
            onReady={handleReady}
            onStateChange={handleStateChange}
          />
        </div>

        <div className="video-controls">
          <button
            className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleStartStop}
          >
            {isPlaying ? 'Pause' : 'Start'}
          </button>
        </div>

        <div className="video-info">
          <span className="time-spent">
            <Clock size={18} />
            Time spent on this video: {formatTime((watchTime[video.id] || 0) + sessionTime)}
            {isPlaying && ' (playing)'}
            {!isPlaying && sessionTime > 0 && ' (paused)'}
          </span>
          {(watchTime[video.id] > 0 || sessionTime > 0) && (
            <button className="btn btn-secondary" onClick={handleResetTime}>
              Reset time
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
