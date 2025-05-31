// Path: /jiffy/shared/scripts/main.js
// Purpose: Manages category storage and rendering for the homepage.

function getCategories() {
  try {
    const categories = JSON.parse(localStorage.getItem('categories'));
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        { name: 'Home', color: '#87CEEB' },
        { name: 'Life', color: '#6495ED' },
        { name: 'Work', color: '#4682B4' },
        { name: 'School', color: '#4169E1' }
      ];
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    // Ensure all categories have colors
    const colorPalette = ['#87CEEB', '#6495ED', '#4682B4', '#4169E1', '#FFA07A', '#FF69B4', '#BA55D3', '#20B2AA', '#F4A460', '#9370DB'];
    return categories.map((cat, index) => ({
      name: cat.name,
      color: cat.color || colorPalette[index % colorPalette.length]
    }));
  } catch (e) {
    console.error('getCategories: Failed to parse categories:', e);
    const defaultCategories = [
      { name: 'Home', color: '#87CEEB' },
      { name: 'Life', color: '#6495ED' },
      { name: 'Work', color: '#4682B4' },
      { name: 'School', color: '#4169E1' }
    ];
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
    return defaultCategories;
  }
}

function saveCategories(categories) {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
    console.log('saveCategories: Saved categories:', categories);
  } catch (e) {
    console.error('saveCategories: Failed to save categories:', e);
  }
}

export { getCategories, saveCategories };