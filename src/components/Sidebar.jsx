import { useState } from 'react';
import { Folder, Clock, Trash2, Edit2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
import EditCategoryModal from './EditCategoryModal';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Sidebar.css';

// Composant pour un élément de catégorie draggable
const SortableCategoryItem = ({ category, selectedCategoryId, onSelectCategory, onEdit, onDelete, getCategoryVideos, getCategoryTotalTime }) => {
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
          <span className="video-count">{videoCount} vidéos</span>
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
          title="Modifier"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="btn-icon btn-danger"
          onClick={(e) => onDelete(e, category.id)}
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};

const Sidebar = ({ selectedCategoryId, onSelectCategory }) => {
  const { categories, getCategoryVideos, getCategoryTotalTime, deleteCategory, reorderCategories, isLoading } = useApp();
  const [editingCategory, setEditingCategory] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDelete = (e, categoryId) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie et toutes ses vidéos ?')) {
      deleteCategory(categoryId);
      if (selectedCategoryId === categoryId) {
        onSelectCategory(null);
      }
    }
  };

  const handleEdit = (e, category) => {
    e.stopPropagation();
    setEditingCategory(category);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      reorderCategories(newOrder);
    }
  };

  return (
    <aside className="sidebar">
      <h2>Catégories</h2>
      {isLoading ? (
        <LoadingSpinner size="medium" text="Chargement des catégories..." />
      ) : categories.length === 0 ? (
        <p className="empty-state">Aucune catégorie. Créez-en une !</p>
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
                  onSelectCategory={onSelectCategory}
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
  );
};

export default Sidebar;
