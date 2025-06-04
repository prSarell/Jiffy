// shared/scripts/categoryManagement.js
import { getColor } from './colorManagement.js';

/*
  File: /shared/scripts/categoryManagement.js
  Purpose: Load and save categories to localStorage, render category buttons with dynamic colors.
           Buttons now include class="category-button" to support active styling.
*/

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

  console.log('loadCategories: Stored data from localStorage:', storedData);
  if (storedData && storedData.version === STORAGE_VERSION && Array.isArray(storedData.categories) && storedData.categories.length > 0) {
    categories = storedData.categories;
  } else {
    console.log('loadCategories: Using default categories due to invalid or empty stored data');
    storedData = { version: STORAGE_VERSION, categories: defaultCategories };
    localStorage.setItem('categoryData', JSON.stringify(storedData));
  }

  console.log('Categories loaded from localStorage or defaults:', categories);

  categoryRow.innerHTML = '';
  categories.forEach((category, index) => {
    if (!category.name || typeof category.name !== 'string' || category.name.trim() === '') {
      console.error(`Invalid category name: "${category.name}"`);
      return;
    }
    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    const dynamicColor = getColor(category.name, index);
    console.log(`loadCategories: Assigning color ${dynamicColor} to category ${category.name} at index ${index}`);
    categoryDiv.innerHTML = `
      <button class="category-button" style="width: 40px; height: 40px; border-radius: 50%; background-color: ${dynamicColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: none;">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${category.name}</span>
    `;
    categoryRow.appendChild(categoryDiv);
  });

  console.log(`Loaded ${categories.length} categories into DOM`);
  return categories;
}

function saveCategories(categoryRow) {
  const categoryDivs = categoryRow.querySelectorAll('div');
  const categories = Array.from(categoryDivs).map(div => {
    const span = div.querySelector('span:last-child');
    if (!span) {
      console.error('No span found for category div:', div);
      return null;
    }
    const name = span.textContent.trim();
    if (!name || name === '') {
      console.error('Invalid category name found:', name);
      return null;
    }
    return { name };
  }).filter(category => category !== null);

  const data = { version: STORAGE_VERSION, categories };
  localStorage.setItem('categoryData', JSON.stringify(data));
  console.log(`Saved ${categories.length} categories:`, categories);
  return categories;
}

function removeCategory(categoryName) {
  const masterCategories = ['Home', 'Life', 'Work', 'School'];

  // Prevent deletion of master categories
  if (masterCategories.includes(categoryName)) {
    console.warn(`Cannot delete master category: ${categoryName}`);
    return;
  }

  // Load existing categories
  const storedData = JSON.parse(localStorage.getItem('categoryData'));
  if (!storedData || !Array.isArray(storedData.categories)) {
    console.error('No valid category data to remove from');
    return;
  }

  const updatedCategories = storedData.categories.filter(cat => cat.name !== categoryName);
  const updatedData = { version: STORAGE_VERSION, categories: updatedCategories };

  // Save updated list
  localStorage.setItem('categoryData', JSON.stringify(updatedData));
  console.log(`Removed category "${categoryName}". Remaining:`, updatedCategories);

  // Remove color assignment
  localStorage.removeItem(`categoryColor-${categoryName}`);
}