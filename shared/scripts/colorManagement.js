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
  let storedData = JSON.parse(localStorage.getItem('categoryData'));
  let categories = defaultCategories;

  if (storedData && storedData.version === STORAGE_VERSION) {
    categories = storedData.categories;
  } else {
    storedData = { version: STORAGE_VERSION, categories: defaultCategories };
    localStorage.setItem('categoryData', JSON.stringify(storedData));
  }

  categoryRow.innerHTML = ''; // Clear the category row
  categories.forEach((category, index) => {
    if (!category.name || typeof category.name !== 'string' || category.name.trim() === '') {
      console.error(`Invalid category name: "${category.name}"`);
      return;
    }
    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    const dynamicColor = getColor(category.name, index); // Pass the position (index)
    categoryDiv.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${dynamicColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: none;">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${category.name}</span>
    `;
    categoryRow.appendChild(categoryDiv);
  });

  return categories; // Return the loaded categories
}

export function saveCategories(categoryRow) {
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
  return categories; // Return the updated categories
}