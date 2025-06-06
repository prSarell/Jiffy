/**
 * Path: /jiffy/shared/scripts/main.js
 * Purpose: Manages user-created categories, ensuring they are associated with the selected master category.
 *          Prevents deletion or editing of master categories. Uses shared masterCategoryManagement.js to render tabs.
 */

import { renderMasterCategories } from './masterCategoryManagement.js';

// Define master categories
const masterCategories = ['Home', 'Work', 'Life', 'School'];

// Initialize selected master category
let selectedMasterCategory = 'Home';

// Load user-created categories from localStorage
let userCategories = JSON.parse(localStorage.getItem('userCategories')) || [];

// Function to render user-created categories
function renderUserCategories() {
  const userCategoryRow = document.getElementById('user-category-row');
  userCategoryRow.innerHTML = '';

  const filteredCategories = userCategories.filter(
    (cat) => cat.masterCategory === selectedMasterCategory
  );

  filteredCategories.forEach((category, index) => {
    // Create container
    const wrapper = document.createElement('div');
    wrapper.className = 'category-item';

    // Create the circle button
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'user-category';
    categoryDiv.style.backgroundColor = category.color || '#004598';

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'category-specific-button';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => {
      userCategories.splice(index, 1);
      localStorage.setItem('userCategories', JSON.stringify(userCategories));
      renderUserCategories();
    });

    categoryDiv.appendChild(deleteButton);

    // Create label below the button
    const label = document.createElement('span');
    label.className = 'user-category-label';
    label.textContent = category.name;

    wrapper.appendChild(categoryDiv);
    wrapper.appendChild(label);
    userCategoryRow.appendChild(wrapper);
  });
}

// Function to add a new user-created category
function addUserCategory(name, color) {
  userCategories.push({
    name,
    color,
    masterCategory: selectedMasterCategory,
  });
  localStorage.setItem('userCategories', JSON.stringify(userCategories));
  renderUserCategories();
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderMasterCategories(
    document.getElementById('master-category-row'),
    (category) => {
      selectedMasterCategory = category;
      renderUserCategories();
    }
  );
  renderUserCategories();

  // Add Category Button
  const addButton = document.querySelector('[data-action="add"]');
  addButton.addEventListener('click', () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      const categoryColor = prompt('Enter category color (hex code):', '#004598');
      addUserCategory(categoryName, categoryColor);
    }
  });
});
