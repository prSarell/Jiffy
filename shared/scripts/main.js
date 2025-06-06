/**
 * Path: /jiffy/shared/scripts/main.js
 * Purpose: Manages user-created categories, ensuring they are associated with the selected master category.
 *          Prevents deletion or editing of master categories. Uses shared masterCategoryManagement.js to render tabs.
 */

import { renderMasterCategories } from './masterCategoryManagement.js';
import { getColor, setColor } from './colorManagement.js';

// Define master categories
const masterCategories = ['Home', 'Work', 'Life', 'School'];

// Initialize selected master category
let selectedMasterCategory = 'Home';

// Load user-created categories from localStorage
let userCategories = JSON.parse(localStorage.getItem('userCategories')) || [];

// Used for color editing
let currentEditIndex = null;

// Function to render user-created categories
function renderUserCategories() {
  const userCategoryRow = document.getElementById('user-category-row');
  userCategoryRow.innerHTML = '';

  const filteredCategories = userCategories.filter(
    (cat) => cat.masterCategory === selectedMasterCategory
  );

  filteredCategories.forEach((category, index) => {
    const globalIndex = userCategories.findIndex(
      (cat) =>
        cat.name === category.name &&
        cat.masterCategory === category.masterCategory
    );

    const wrapper = document.createElement('div');
    wrapper.className = 'category-item';

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'user-category';
    categoryDiv.style.backgroundColor = getColor(category.name, globalIndex);

    // Enable color editing on click
    categoryDiv.addEventListener('click', () => {
      currentEditIndex = globalIndex;
      document.getElementById('edit-color-popup').style.display = 'flex';
      document.getElementById('edit-color-popup-title').textContent =
        `Edit Color: ${category.name}`;
      document.getElementById('color-input').value =
        getColor(category.name, globalIndex);
    });

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'category-specific-button';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      userCategories.splice(globalIndex, 1);
      localStorage.setItem('userCategories', JSON.stringify(userCategories));
      renderUserCategories();
    });

    categoryDiv.appendChild(deleteButton);

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

  // Color picker popup buttons
  const yesButton = document.querySelector('#edit-color-popup [data-action="yes"]');
  const cancelButton = document.querySelector('#edit-color-popup [data-action="cancel"]');
  const popup = document.getElementById('edit-color-popup');

  yesButton.addEventListener('click', () => {
    const colorInput = document.getElementById('color-input');
    const newColor = colorInput.value;

    if (currentEditIndex !== null && userCategories[currentEditIndex]) {
      const categoryName = userCategories[currentEditIndex].name;
      setColor(categoryName, newColor);
      userCategories[currentEditIndex].color = newColor;
      localStorage.setItem('userCategories', JSON.stringify(userCategories));
      renderUserCategories();
      popup.style.display = 'none';
    }
  });

  cancelButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});
