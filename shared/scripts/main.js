/**
 * Path: /jiffy/shared/scripts/main.js
 * Purpose: Manages user-created categories, ensures they're associated with the selected master category.
 *          Prevents deletion or editing of master categories. Uses masterCategoryManagement.js to render tabs.
 * Update: Adds prompt display logic and automatic cycling
 */

import { renderMasterCategories } from './masterCategoryManagement.js';
import { getColor, setColor } from './colorManagement.js';
import { getPrompts } from '../../pages/prompts/promptManagement.js';

// Define master categories
const masterCategories = ['Home', 'Work', 'Life', 'School'];

// Initialize selected master category
let selectedMasterCategory = 'Home';

// Load user-created categories from localStorage
let userCategories = JSON.parse(localStorage.getItem('userCategories')) || [];

// Used for color editing
let currentEditIndex = null;

// === PROMPT DISPLAY ===
let currentPromptIndex = -1;

function displayPrompt() {
  const prompts = getPrompts();
  if (!prompts.length) return;

  const randomIndex = Math.floor(Math.random() * prompts.length);
  currentPromptIndex = randomIndex;

  const container = document.getElementById('prompt-container');
  if (container) {
    container.textContent = prompts[randomIndex].text;
  }
}

function cyclePrompts(interval = 15000) {
  const prompts = getPrompts();
  if (prompts.length <= 1) return;

  setInterval(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * prompts.length);
    } while (nextIndex === currentPromptIndex);

    currentPromptIndex = nextIndex;
    const container = document.getElementById('prompt-container');
    if (container) {
      container.textContent = prompts[nextIndex].text;
    }
  }, interval);
}

// === CATEGORY RENDERING ===
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
    categoryDiv.style.backgroundColor = getColor(category.name, index);

    categoryDiv.addEventListener('click', () => {
      currentEditIndex = globalIndex;
      document.getElementById('edit-color-popup').style.display = 'flex';
      document.getElementById('edit-color-popup-title').textContent =
        `Edit Color: ${category.name}`;
      document.getElementById('color-input').value =
        getColor(category.name, index);
    });

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

function addUserCategory(name, color) {
  userCategories.push({
    name,
    color,
    masterCategory: selectedMasterCategory,
  });
  localStorage.setItem('userCategories', JSON.stringify(userCategories));
  renderUserCategories();
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
  displayPrompt();
  cyclePrompts();

  renderMasterCategories(
    document.getElementById('master-category-row'),
    (category) => {
      selectedMasterCategory = category;
      renderUserCategories();
    }
  );

  renderUserCategories();

  const addButton = document.querySelector('[data-action="add"]');
  addButton.addEventListener('click', () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      const categoryColor = prompt('Enter category color (hex code):', '#004598');
      addUserCategory(categoryName, categoryColor);
    }
  });

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
