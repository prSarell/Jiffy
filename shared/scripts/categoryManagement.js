// File Path: /jiffy/shared/scripts/categoryManagement.js
// Description: Manages category data, including adding, deleting, and persisting categories in localStorage
let categories = JSON.parse(localStorage.getItem('categories')) || [];

// Add a new category
function addCategory(name) {
  if (name && !categories.includes(name)) {
    categories.push(name);
    localStorage.setItem('categories', JSON.stringify(categories));
  }
}

// Delete a category by name
function deleteCategory(name) {
  const index = categories.indexOf(name);
  if (index > -1) {
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
  }
}

// Get the current list of categories
function getCategories() {
  return categories;
}

// Get the number of categories (for Swiper)
function getCategoryCount() {
  return categories.length;
}

// Initialize with default categories if none exist
if (categories.length === 0) {
  const defaultCategories = [
    "Home", "Life", "School", "Work",
    "Dreams", "Hobbies", "Goals", "Events",
    "Projects", "Ideas", "Plans", "Chores",
    "Errands", "Habits", "Routines", "Adventures",
    "Memories", "Skills", "Wishlist", "Inspiration"
  ];
  defaultCategories.forEach(category => addCategory(category));
}
