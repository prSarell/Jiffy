// Path: /jiffy/shared/scripts/main.js
// Purpose: Manages category storage and rendering for the homepage.

function getCategories() {
  try {
    const categories = JSON.parse(localStorage.getItem('categories')) || ['General', 'Work', 'Home'];
    return categories;
  } catch (e) {
    console.error('getCategories: Failed to parse categories:', e);
    return ['General', 'Work', 'Home'];
  }
}

function saveCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
  console.log('saveCategories: Saved categories:', categories);
}

export { getCategories, saveCategories };