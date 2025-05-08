// shared/scripts/main.js
import { loadCategories } from './categoryManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  const categoryRow = document.querySelector('.category-row');

  if (!categoryRow) {
    console.error('Category row not found');
    return;
  }

  const selectMode = false; // No select mode functionality yet
  let categories = loadCategories(categoryRow, selectMode); // Load categories on startup
});