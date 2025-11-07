import { Folder, Video as VideoIcon, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';
import '../styles/Home.css';

const Home = () => {
  const { categories, videos, watchTime, getCategoryVideos } = useApp();
  const navigate = useNavigate();

  const totalWatchTime = Object.values(watchTime).reduce((sum, time) => sum + time, 0);

  const sortedCategories = [...categories].sort((a, b) => {
    const aTime = getCategoryVideos(a.id).reduce((sum, v) => sum + (watchTime[v.id] || 0), 0);
    const bTime = getCategoryVideos(b.id).reduce((sum, v) => sum + (watchTime[v.id] || 0), 0);
    return bTime - aTime;
  }).slice(0, 3);

  const recentVideos = [...videos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const avgTimePerVideo = videos.length > 0 ? totalWatchTime / videos.length : 0;

  return (
    <div className="home-page">
      <div className="welcome">
        <h2>Fitness Tracker</h2>
        <p>Your workout hub for gym sessions</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <VideoIcon size={28} />
          </div>
          <div className="stat-content">
            <h3>{videos.length}</h3>
            <p>Total Videos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Folder size={28} />
          </div>
          <div className="stat-content">
            <h3>{categories.length}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <h3>{formatTime(totalWatchTime)}</h3>
            <p>Total Time</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <h3>{formatTime(Math.floor(avgTimePerVideo))}</h3>
            <p>Avg per Video</p>
          </div>
        </div>
      </div>

      {sortedCategories.length > 0 && (
        <div className="top-categories-section">
          <h3>Top Categories by Watch Time</h3>
          <div className="top-categories">
            {sortedCategories.map((cat, index) => {
              const catTime = getCategoryVideos(cat.id).reduce((sum, v) => sum + (watchTime[v.id] || 0), 0);
              const videoCount = getCategoryVideos(cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="category-stat-card"
                  onClick={() => navigate(`/category/${cat.id}`)}
                >
                  <div className="rank">#{index + 1}</div>
                  <div className="category-stat-info">
                    <h4>{cat.name}</h4>
                    <div className="category-stat-meta">
                      <span>{videoCount} videos</span>
                      <span className="time">{formatTime(catTime)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentVideos.length > 0 && (
        <div className="recent-section">
          <h3>Recently Added</h3>
          <div className="recent-videos">
            {recentVideos.map(video => {
              const category = categories.find(c => c.id === video.categoryId);
              return (
                <div
                  key={video.id}
                  className="recent-video-card"
                  onClick={() => navigate(`/video/${video.id}`)}
                >
                  <Calendar size={16} />
                  <div className="recent-video-info">
                    <p className="video-title">{video.title}</p>
                    <p className="video-category">{category?.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {videos.length === 0 && (
        <div className="empty-state">
          <Folder size={64} />
          <p>No videos yet. Start by creating a category and adding your workout videos!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
