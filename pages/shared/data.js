// Load categories from local storage
window.loadCategories = function() {
  try {
    return JSON.parse(localStorage.getItem('jiffyCategories')) || null;
  } catch (error) {
    console.error('Error loading categories:', error);
    return null;
  }
};

// Save categories to local storage
window.saveCategories = function(categories) {
  try {
    localStorage.setItem('jiffyCategories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};
