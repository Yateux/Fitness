import { FolderPlus, Plus, Menu } from 'lucide-react';
import '../styles/Header.css';

interface HeaderProps {
  onAddCategory: () => void;
  onAddVideo: () => void;
  onToggleSidebar?: () => void;
}

const Header = ({ onAddCategory, onAddVideo, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-left">
        {onToggleSidebar && (
          <button className="btn-icon hamburger-menu" onClick={onToggleSidebar} title="Toggle Menu">
            <Menu size={24} />
          </button>
        )}
        <h1>Fitness Tracker</h1>
      </div>
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onAddCategory} title="New Category">
          <FolderPlus size={18} />
          <span>New Category</span>
        </button>
        <button className="btn btn-primary" onClick={onAddVideo} title="Add Video">
          <Plus size={18} />
          <span>Add Video</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
