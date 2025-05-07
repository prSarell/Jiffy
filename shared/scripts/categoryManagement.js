// shared/scripts/categoryManagement.js
import { getColor } from './colorManagement.js';

const defaultCategories = [
  { name: 'Home', color: '#1A2A44' },
  { name: 'Life', color: '#3B5998' },
  { name: 'Work', color: '#6B7280' },
  { name: 'School', color: '#E0F2FE' }
];

export function loadCategories(categoryRow, selectMode) {
  const storedCategories = JSON.parse(localStorage.getItem('categories'));
  const categories = storedCategories && storedCategories.length > 0 ? storedCategories : defaultCategories;

  // Log the categories being loaded
  console.log('Categories loaded from localStorage or defaults:', categories);

  categoryRow.innerHTML = '';

  categories.forEach(category => {
    // Validate category name
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
  const categoryDivs = categoryRow.querySelectorAll('div[draggable="true"]');
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
    const color = div.querySelector('button').style.backgroundColor || defaultCategories.find(cat => cat.name === name)?.color || '#1A2A44';
    return { name, color };
  }).filter(category => category !== null); // Filter out invalid categories

  localStorage.setItem('categories', JSON.stringify(categories));
  console.log(`Saved ${categories.length} categories:`, categories);
}

export function addCategory(categoryRow, categoryName, selectMode) {
  const defaultColor = '#1A2A44'; // Default color for new categories
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
