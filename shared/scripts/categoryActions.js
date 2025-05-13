// /jiffy/shared/scripts/categoryActions.js
import { getColor, setColor } from './colorManagement.js';
import { saveCategories, getCategories } from './categoryManagement.js';

export function addCategory(categoryName, appContext) {
  console.log(`addCategory: Adding category: ${categoryName}`);
  if (!categoryName) {
    console.error("addCategory: Category name is required");
    return;
  }
  const { categoryRow, setCategories } = appContext;
  if (!categoryRow) {
    console.error("addCategory: categoryRow is null");
    return;
  }
  const position = categoryRow.querySelectorAll('div').length;
  const color = getColor(categoryName, position);
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category-item';
  categoryDiv.innerHTML = `
    <button class="category-button" style="background-color: ${color};">
      <span class="category-specific-button">
        <span class="inner-circle"></span>
      </span>
    </button>
    <span class="category-label">${categoryName}</span>
  `;
  categoryRow.appendChild(categoryDiv);

  // Update categories
  const categories = getCategories();
  const newCategory = { id: categories.length + 1, name: categoryName, color };
  categories.push(newCategory);
  setColor(categoryName, color);
  const success = saveCategories(categories);
  setCategories(success ? categories : getCategories());
}