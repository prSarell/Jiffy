// /jiffy/shared/scripts/categoryManagement.js
import { getColor } from './colorManagement.js';

export function loadCategories(categoryRow) {
  console.log('loadCategories: Starting category loading...');
  console.log('loadCategories: categoryRow element:', categoryRow);
  const storedData = localStorage.getItem('categoryData');
  console.log('loadCategories: Retrieved storedData from localStorage:', storedData);

  const defaultCategories = [
    { name: 'Home', position: 0 },
    { name: 'Life', position: 1 },
    { name: 'Work', position: 2 },
    { name: 'School', position: 3 }
  ];

  let categories = defaultCategories;

  // Validate stored data
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData && Array.isArray(parsedData)) {
        categories = parsedData;
        console.log('loadCategories: Using stored categories (array):', categories);
      } else if (parsedData && parsedData.categories && Array.isArray(parsedData.categories)) {
        categories = parsedData.categories;
        console.log('loadCategories: Using stored categories from parsedData.categories:', categories);
      } else {
        console.warn('loadCategories: Invalid stored data format, falling back to default categories');
        localStorage.removeItem('categoryData'); // Clear invalid data
      }
    } catch (e) {
      console.error('loadCategories: Failed to parse storedData, falling back to default categories:', e);
      localStorage.removeItem('categoryData'); // Clear invalid data
    }
  } else {
    console.log('loadCategories: No stored data, using default categories');
  }

  console.log('loadCategories: Categories to load:', categories);
  console.log('loadCategories: Cleared categoryRow.innerHTML');
  categoryRow.innerHTML = ''; // Clear existing categories

  categories.forEach((category, index) => {
    console.log(`loadCategories: Processing category at index ${index}:`, category);
    const color = getColor(category.name, index); // Get color for the category
    console.log(`loadCategories: Color for ${category.name}:`, color);
    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    categoryDiv.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${color}; cursor: pointer; border: none; position: relative;">
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
  return categories;
}

export function saveCategories(categoryRow) {
  console.log('saveCategories: Starting category saving...');
  console.log('saveCategories: categoryRow element:', categoryRow);
  const categoryDivs = categoryRow.querySelectorAll('div');
  console.log('saveCategories: Found categoryDivs:', categoryDivs);

  const categories = Array.from(categoryDivs).map((div, index) => {
    const span = div.querySelector('span:last-child');
    const categoryName = span ? span.textContent.trim() : null;
    if (!categoryName) {
      console.warn(`saveCategories: Invalid category name at index ${index}:`, categoryName);
      return null;
    }
    return { name: categoryName, position: index };
  }).filter(category => category !== null);

  console.log('saveCategories: Processed categories:', categories);
  if (categories.length === 0) {
    console.warn('saveCategories: No valid categories to save');
  } else {
    localStorage.setItem('categoryData', JSON.stringify(categories));
    console.log(`saveCategories: Saved ${categories.length} categories:`, categories);
  }
  return categories;
}
