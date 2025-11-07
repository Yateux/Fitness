/**
 * Nettoie toutes les données du localStorage
 * À utiliser une seule fois pour migrer vers Firebase
 */
export const clearAllLocalStorage = () => {
  try {
    // Sauvegarder les clés avant de les supprimer (pour debug)
    const keys = Object.keys(localStorage);
    console.log('🗑️  Nettoyage du localStorage...');
    console.log('Clés trouvées:', keys);

    // Supprimer toutes les données
    localStorage.clear();

    console.log('✅ localStorage nettoyé avec succès!');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
};

// Auto-exécution au chargement pour nettoyer une seule fois
if (typeof window !== 'undefined') {
  // Vérifier si c'est la première fois après migration
  const MIGRATION_KEY = 'firebase_migration_done';

  if (!localStorage.getItem(MIGRATION_KEY)) {
    clearAllLocalStorage();
    localStorage.setItem(MIGRATION_KEY, 'true');
    console.log('🎉 Migration vers Firebase terminée!');
  }
}
