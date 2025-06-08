// File: /shared/scripts/categoryManagement.js
// Purpose: Load, render, save, and delete categories for the homepage with select mode support.

import { getColor } from './colorManagement.js';

const defaultCategories = [
  { name: 'Home' },
  { name: 'Life' },
  { name: 'Work' },
  { name: 'School' }
];

const STORAGE_VERSION = 1;
let categorySelectionMode = false;
let selectedCategories = [];

function toggleCategorySelectionMode(active) {
  categorySelectionMode = active;
  selectedCategories = [];
  renderAllCategorySelectButtons();
}

function getSelectedCategories() {
  return [...selectedCategories];
}

function renderAllCategorySelectButtons() {
  document.querySelectorAll('.category-specific-button.select-mode').forEach(btn => {
    btn.style.display = categorySelectionMode ? 'inline-flex' : 'none';
    btn.classList.remove('selected');
  });
}

function loadCategories(categoryRow) {
  let storedData = JSON.parse(localStorage.getItem('categoryData'));
  let categories = defaultCategories;

  if (
    storedData &&
    storedData.version === STORAGE_VERSION &&
    Array.isArray(storedData.categories) &&
    storedData.categories.length > 0
  ) {
    categories = storedData.categories;
  } else {
    storedData = { version: STORAGE_VERSION, categories: defaultCategories };
    localStorage.setItem('categoryData', JSON.stringify(storedData));
  }

  categoryRow.innerHTML = '';
  categories.forEach((category, index) => {
    if (!category.name || typeof category.name !== 'string' || category.name.trim() === '') {
      console.error(`Invalid category name: "${category.name}"`);
      return;
    }

    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';

    const dynamicColor = getColor(category.name, index);

    categoryDiv.innerHTML = `
      <button class="category-button" style="width: 40px; height: 40px; border-radius: 50%; background-color: ${dynamicColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button select-mode" style="display: ${categorySelectionMode ? 'inline-flex' : 'none'};">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 8px;
        margin-top: 5px;
        text-align: center;
        white-space: normal;
        display: block;
        max-width: 60px;
        line-height: 1.1;
 