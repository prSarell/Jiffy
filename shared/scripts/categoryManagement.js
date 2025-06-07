// File: /shared/scripts/categoryManagement.js
// Purpose: Load, render, save, and delete categories for the homepage.
//          Clicking a category opens userCategoryView/index.html.
//          Master categories are protected from deletion.

import { getColor } from './colorManagement.js';

const defaultCategories = [
  { name: 'Home' },
  { name: 'Life' },
  { name: 'Work' },
  { name: 'School' }
];

const STORAGE_VERSION = 1;

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
        <span class="category-specific-button" style="display: none;">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${category.name}</span>
    `;

    const button = categoryDiv.querySelector('button.category-button');
    if (button) {
      button.addEventListener('click', () => {
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

export { loadCategories, saveCategories, removeCategory };