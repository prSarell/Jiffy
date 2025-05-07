// shared/scripts/categoryManagement.js
import { getColor } from './colorManagement.js';

const defaultCategories = [
  { name: 'Home', color: '#1666BA' },
  { name: 'Life', color: '#368CE7' },
  { name: 'Work', color: '#7AB3EF' },
  { name: 'School', color: '#BEDAF7' }
];

export function loadCategories(categoryRow, selectMode) {
  // Temporarily hardcode categories, ignoring localStorage
  const categories = defaultCategories;

  console.log('Categories loaded:', categories);

  categoryRow.innerHTML = '';

  categories.forEach(category => {
    if (!category.name || typeof category.name !== 'string' || category.name.trim() === '') {
      console.error(`Invalid category name: "${category.name}"`);
      return;
    }

    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    categoryDiv.draggable = true;
    const dynamicColor = getColor(category.name);
    categoryDiv.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${dynamicColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: ${selectMode ? 'block' : 'none'};">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${category.name}</span>
    `;
    categoryRow.appendChild(categoryDiv);
  });

  console.log(`Loaded ${categories.length} categories into DOM`);
}

export function saveCategories(categoryRow) {
  // Temporarily disable saving to localStorage
  console.log('Saving categories skipped (localStorage disabled temporarily)');
}

export function addCategory(categoryRow, categoryName, selectMode) {
  const defaultColor = getColor(categoryName);
  const newButton = document.createElement('div');
  newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
  newButton.draggable = true;
  newButton.innerHTML = `
    <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${defaultColor}; cursor: pointer; border: none; position: relative;">
      <span class="category-specific-button" style="display: ${selectMode ? 'block' : 'none'};">
        <span class="inner-circle"></span>
      </span>
    </button>
    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
  `;
  categoryRow.appendChild(newButton);
  saveCategories(categoryRow);
  console.log('Added category:', categoryName);
}