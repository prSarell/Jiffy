// /jiffy/shared/scripts/categoryActions.js
import { getColor } from './colorManagement.js';
import { saveCategories, getCategories } from './categoryManagement.js';

export function addCategory(categoryName) {
  console.log(`addCategory: Adding category: ${categoryName}`);
  if (!categoryName) {
    console.error("addCategory: Category name is required");
    return;
  }
  const categories = getCategories();
  const position = categories.length;
  const color = getColor(categoryName, position);
  const newCategory = { id: categories.length + 1, name: categoryName, color };
  categories.push(newCategory);
  saveCategories(categories);

  const categoryContainer = document.getElementById("category-container");
  if (!categoryContainer) {
    console.error("addCategory: Category container not found");
    return;
  }
  const categoryDiv = document.createElement("div");
  categoryDiv.className = "category-item";
  categoryDiv.dataset.id = newCategory.id;
  categoryDiv.innerHTML = `
    <button class="category-button" style="background-color: ${color};">
      <span class="category-specific-button">
        <span class="inner-circle"></span>
      </span>
    </button>
    <span class="category-label">${categoryName}</span>
  `;
  categoryContainer.appendChild(categoryDiv);
  console.log(`addCategory: Added ${categoryName} with color ${color}`);
}