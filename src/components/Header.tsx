import { FolderPlus, Plus } from 'lucide-react';
import '../styles/Header.css';

interface HeaderProps {
  onAddCategory: () => void;
  onAddVideo: () => void;
}

const Header = ({ onAddCategory, onAddVideo }: HeaderProps) => {
  return (
    <header className="header">
      <h1>Fitness Tracker</h1>
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onAddCategory}>
          <FolderPlus size={18} />
          New Category
        </button>
        <button className="btn btn-primary" onClick={onAddVideo}>
          <Plus size={18} />
          Add Video
        </button>
      </div>
    </header>
  );
};

export default Header;
