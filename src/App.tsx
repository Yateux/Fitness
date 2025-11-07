import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AddCategoryModal from './components/AddCategoryModal';
import AddVideoModal from './components/AddVideoModal';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import VideoPlayer from './pages/VideoPlayer';
import './styles/App.css';

const AppLayout = () => {
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [showAddVideo, setShowAddVideo] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentCategoryId: string | null = location.pathname.startsWith('/category/')
    ? location.pathname.split('/category/')[1]
    : null;

  const handleSelectCategory = (categoryId: string | null) => {
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="app">
      <Header
        onAddCategory={() => setShowAddCategory(true)}
        onAddVideo={() => setShowAddVideo(true)}
      />

      <div className="container">
        <Sidebar
          selectedCategoryId={currentCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/video/:videoId" element={<VideoPlayer />} />
          </Routes>
        </main>
      </div>

      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
      />

      <AddVideoModal
        isOpen={showAddVideo}
        onClose={() => setShowAddVideo(false)}
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
