import { useState, MouseEvent, useEffect } from 'react';
import { Folder, Clock, Trash2, Edit2, GripVertical, X, Calendar, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';
import { Category, Video } from '../types';
import EditCategoryModal from './EditCategoryModal';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Sidebar.css';

interface SortableCategoryItemProps {
  category: Category;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onEdit: (e: MouseEvent<HTMLButtonElement>, category: Category) => void;
  onDelete: (e: MouseEvent<HTMLButtonElement>, categoryId: string) => void;
  getCategoryVideos: (categoryId: string) => Video[];
  getCategoryTotalTime: (categoryId: string) => number;
}

const SortableCategoryItem = ({
  category,
  selectedCategoryId,
  onSelectCategory,
  onEdit,
  onDelete,
  getCategoryVideos,
  getCategoryTotalTime
}: SortableCategoryItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const videoCount = getCategoryVideos(category.id).length;
  const totalTime = getCategoryTotalTime(category.id);
  const isActive = selectedCategoryId === category.id;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`category-item ${isActive ? 'active' : ''}`}
    >
      <div className="category-drag-handle" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <div
        className="category-content"
        onClick={() => onSelectCategory(category.id)}
      >
        <div className="category-info">
          <Folder size={18} />
          <span>{category.name}</span>
        </div>
        <div className="category-meta">
          <span className="video-count">{videoCount} videos</span>
          <span className="time-badge">
            <Clock size={14} />
            {formatTime(totalTime)}
          </span>
        </div>
      </div>
      <div className="category-actions">
        <button
          className="btn-icon"
          onClick={(e) => onEdit(e, category)}
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="btn-icon btn-danger"
          onClick={(e) => onDelete(e, category.id)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};

interface SidebarProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ selectedCategoryId, onSelectCategory, isOpen = true, onClose }: SidebarProps) => {
  const { categories, getCategoryVideos, getCategoryTotalTime, deleteCategory, reorderCategories, isLoading } = useApp();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>, categoryId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category and all its videos?')) {
      deleteCategory(categoryId);
      if (selectedCategoryId === categoryId) {
        onSelectCategory(null);
      }
    }
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, category: Category) => {
    e.stopPropagation();
    setEditingCategory(category);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      reorderCategories(newOrder);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    if (onClose) {
      onClose();
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && onClose && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          {onClose && (
            <button className="btn-icon sidebar-close" onClick={onClose}>
              <X size={24} />
            </button>
          )}
        </div>

        <div className="sidebar-nav">
          <button
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => handleNavClick('/')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            className={`nav-item ${location.pathname === '/planning' ? 'active' : ''}`}
            onClick={() => handleNavClick('/planning')}
          >
            <Calendar size={20} />
            <span>Schedule</span>
          </button>
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-section-header">
          <h3>Categories</h3>
        </div>

      {isLoading ? (
        <LoadingSpinner size="medium" text="Loading categories..." />
      ) : categories.length === 0 ? (
        <p className="empty-state">No categories. Create one!</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="category-list">
              {categories.map(category => (
                <SortableCategoryItem
                  key={category.id}
                  category={category}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={handleCategoryClick}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryVideos={getCategoryVideos}
                  getCategoryTotalTime={getCategoryTotalTime}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

        {editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )}
      </aside>
    </>
  );
};

export default Sidebar;
