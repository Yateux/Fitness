import { FolderPlus, Plus } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ onAddCategory, onAddVideo }) => {
  return (
    <header className="header">
      <h1>Fitness Tracker</h1>
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onAddCategory}>
          <FolderPlus size={18} />
          Nouvelle catégorie
        </button>
        <button className="btn btn-primary" onClick={onAddVideo}>
          <Plus size={18} />
          Ajouter une vidéo
        </button>
      </div>
    </header>
  );
};

export default Header;
