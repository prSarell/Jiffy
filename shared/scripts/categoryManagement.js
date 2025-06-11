// File: /shared/scripts/categoryManagement.js
// Purpose: Load, render, save, and delete categories for the homepage.
//          Includes support for category-specific select mode and master category protection.

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

function toggleCategorySelectionMode() {
  categorySelectionMode = !categorySelectionMode;
  selectedCategories = [];

  renderSelectModeButtons();
}

function getSelectedCategories() {
  return selectedCategories.slice(); // Return a copy
}

function renderSelectModeButtons() {
  document.querySelectorAll('.category-specific-button').forEach((button) => {
    button.style.display = categorySelectionMode ? 'inline-flex' : 'none';
    button.classList.remove('selected');
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
      <span class="category-label">${category.name}</span>
    `;

    const button = categoryDiv.querySelector('button.category-button');
    const selectButton = categoryDiv.querySelector('.category-specific-button');

    if (selectButton) {
      selectButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent category from opening
        const index = selectedCategories.indexOf(category.name);
        if (index >= 0) {
          selectedCategories.splice(index, 1);
          selectButton.classList.remove('selected');
        } else {
          selectedCategories.push(category.name);
          selectButton.classList.add('selected');
        }
      });
    }

    if (button) {
      button.addEventListener('click', () => {
        if (categorySelectionMode) return;
        localStorage.setItem('activeCategory', category.name);
        window.location.href = '/jiffy/pages/categories/userCategoryView/';
      });
    }

    categoryRow.appendChild(categoryDiv);
  });

  return categories;
}

function saveCategories(categoryRow) {
  const categoryDivs = categoryRow.querySelectorAll('div');
  const categories = Array.from(categoryDivs).map(div => {
    const span = div.querySelector('span:last-child');
    if (!span) return null;
    const name = span.textContent.trim();
    if (!name || name === '') return null;
    return { name };
  }).filter(category => category !== null);

  const data = { version: STORAGE_VERSION, categories };
  localStorage.setItem('categoryData', JSON.stringify(data));
  return categories;
}

function removeCategory(categoryName) {
  const masterCategories = ['Home', 'Life', 'Work', 'School'];

  if (masterCategories.includes(categoryName)) {
    console.warn(`Cannot delete master category: ${categoryName}`);
    return;
  }

  const storedData = JSON.parse(localStorage.getItem('categoryData'));
  if (!storedData || !Array.isArray(storedData.categories)) {
    return;
  }

  const updatedCategories = storedData.categories.filter(cat => cat.name !== categoryName);
  const updatedData = { version: STORAGE_VERSION, categories: updatedCategories };
  localStorage.setItem('categoryData', JSON.stringify(updatedData));
  localStorage.removeItem(`categoryColor-${categoryName}`);
}

export {
  loadCategories,
  saveCategories,
  removeCategory,
  toggleCategorySelectionMode,
  getSelectedCategories
};
