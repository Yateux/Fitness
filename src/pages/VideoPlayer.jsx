import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { X, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { getVideoById, watchTime, addWatchTime, setWatchTime, isLoading } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [player, setPlayer] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const sessionTimeRef = useRef(0);

  const video = getVideoById(videoId);

  if (isLoading) {
    return (
      <div className="video-player-page">
        <LoadingSpinner size="large" text="Chargement de la vidéo..." />
      </div>
    );
  }

  // Garder la ref à jour
  useEffect(() => {
    sessionTimeRef.current = sessionTime;
  }, [sessionTime]);

  // Timer simple : juste un compteur qui s'incrémente chaque seconde
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sauvegarder le temps uniquement au démontage du composant (quand on quitte la page)
  useEffect(() => {
    return () => {
      if (sessionTimeRef.current > 0) {
        addWatchTime(videoId, sessionTimeRef.current);
      }
    };
  }, [videoId, addWatchTime]);

  const handleReady = (event) => {
    setPlayer(event.target);
    setVideoLoading(false);
  };

  const handleStateChange = (event) => {
    const playerState = event.data;
    console.log('YouTube state:', playerState);

    // 1 = playing, 2 = paused
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
    if (sessionTimeRef.current > 0) {
      addWatchTime(videoId, sessionTimeRef.current);
    }
    navigate(-1);
  };

  const handleResetTime = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser le temps pour cette vidéo ?')) {
      setSessionTime(0);
      setWatchTime(prev => ({
        ...prev,
        [video.id]: 0
      }));
    }
  };

  if (!video) {
    return (
      <div className="video-player-page">
        <div className="error-message">
          <h2>Vidéo introuvable</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Retour à l'accueil
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
            Fermer
          </button>
        </div>

        <div className="video-wrapper">
          {videoLoading && (
            <div className="video-loading-overlay">
              <LoadingSpinner size="medium" text="Chargement du lecteur YouTube..." />
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
            {isPlaying ? 'Pause' : 'Démarrer'}
          </button>
        </div>

        <div className="video-info">
          <span className="time-spent">
            <Clock size={18} />
            Temps passé sur cette vidéo: {formatTime((watchTime[video.id] || 0) + sessionTime)}
            {isPlaying && ' (en lecture)'}
            {!isPlaying && sessionTime > 0 && ' (en pause)'}
          </span>
          {(watchTime[video.id] > 0 || sessionTime > 0) && (
            <button className="btn btn-secondary" onClick={handleResetTime}>
              Réinitialiser le temps
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
