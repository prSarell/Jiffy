// shared/scripts/categoryManagement.js
import { getColor } from './colorManagement.js';

const defaultCategories = [
  { name: 'Home' },
  { name: 'Life' },
  { name: 'Work' },
  { name: 'School' }
];

const STORAGE_VERSION = 1;

export function loadCategories(categoryRow) {
  console.log('loadCategories: Starting category loading...');
  console.log('loadCategories: categoryRow element:', categoryRow);
  if (!categoryRow) {
    console.error('loadCategories: categoryRow element not found!');
    return [];
  }

  let storedData = JSON.parse(localStorage.getItem('categoryData'));
  console.log('loadCategories: Retrieved storedData from localStorage:', storedData);
  let categories = defaultCategories;

  if (storedData && storedData.version === STORAGE_VERSION) {
    console.log('loadCategories: Using stored categories');
    categories = storedData.categories;
  } else {
    console.log('loadCategories: Using default categories');
    storedData = { version: STORAGE_VERSION, categories: defaultCategories };
    localStorage.setItem('categoryData', JSON.stringify(storedData));
  }

  console.log('loadCategories: Categories to load:', categories);

  categoryRow.innerHTML = ''; // Clear the category row
  console.log('loadCategories: Cleared categoryRow.innerHTML');

  categories.forEach((category, index) => {
    console.log(`loadCategories: Processing category at index ${index}:`, category);
    if (!category.name || typeof category.name !== 'string' || category.name.trim() === '') {
      console.error(`loadCategories: Invalid category name at index ${index}: "${category.name}"`);
      return;
    }
    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    console.log(`loadCategories: Getting color for ${category.name} at position ${index}`);
    const dynamicColor = getColor(category.name, index); // Pass the position (index)
    console.log(`loadCategories: Color for ${category.name}: ${dynamicColor}`);
    categoryDiv.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${dynamicColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: none;">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${category.name}</span>
    `;
    console.log(`loadCategories: Created categoryDiv for ${category.name}:`, categoryDiv);
    categoryRow.appendChild(categoryDiv);
    console.log(`loadCategories: Appended ${category.name} to categoryRow`);
  });

  console.log(`loadCategories: Loaded ${categories.length} categories into DOM`);
  console.log('loadCategories: categoryRow.innerHTML after loading:', categoryRow.innerHTML);
  return categories; // Return the loaded categories
}

export function saveCategories(categoryRow) {
  console.log('saveCategories: Starting category saving...');
  console.log('saveCategories: categoryRow element:', categoryRow);
  if (!categoryRow) {
    console.error('saveCategories: categoryRow element not found!');
    return [];
  }

  const categoryDivs = categoryRow.querySelectorAll('div');
  console.log('saveCategories: Found categoryDivs:', categoryDivs);
  const categories = Array.from(categoryDivs).map(div => {
    const span = div.querySelector('span:last-child');
    if (!span) {
      console.error('saveCategories: No span found for category div:', div);
      return null;
    }
    const name = span.textContent.trim();
    if (!name || name === '') {
      console.error('saveCategories: Invalid category name found:', name);
      return null;
    }
    return { name };
  }).filter(category => category !== null);

  const data = { version: STORAGE_VERSION, categories };
  localStorage.setItem('categoryData', JSON.stringify(data));
  console.log(`saveCategories: Saved ${categories.length} categories:`, categories);
  return categories; // Return the updated categories
}