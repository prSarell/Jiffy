// File: /jiffy/shared/scripts/main.js
// Purpose: Manages user-created categories, master category tab logic, prompt cycling, and reintroduces Select/Delete functionality.

import { renderMasterCategories } from './masterCategoryManagement.js';
import { getColor, setColor } from './colorManagement.js';
import { getPrompts } from '../../pages/prompts/promptManagement.js';

const masterCategories = ['Home', 'Work', 'Life', 'School'];
let selectedMasterCategory = 'Home';
let userCategories = JSON.parse(localStorage.getItem('userCategories')) || [];
let currentPromptIndex = -1;
let isSelectMode = false;
let selectedCategoryName = null;

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

function renderUserCategories() {
  const userCategoryRow = document.getElementById('user-category-row');
  userCategoryRow.innerHTML = '';

  const filteredCategories = userCategories.filter(
    (cat) => cat.masterCategory === selectedMasterCategory
  );

  filteredCategories.forEach((category, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'category-item';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.width = '40px';
    wrapper.style.position = 'relative';

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'user-category';
    categoryDiv.style.backgroundColor = getColor(category.name, index + 4); // +4 to offset master categories
    categoryDiv.style.width = '40px';
    categoryDiv.style.height = '40px';
    categoryDiv.style.borderRadius = '50%';
    categoryDiv.style.cursor = 'pointer';
    categoryDiv.style.position = 'relative';
    categoryDiv.style.display = 'flex';
    categoryDiv.style.justifyContent = 'center';
    categoryDiv.style.alignItems = 'center';

    categoryDiv.addEventListener('click', () => {
      if (isSelectMode) return; // Don’t open the page in select mode
      localStorage.setItem('activeCategory', category.name);
      window.location.href = '/jiffy/pages/categories/userCategoryView/';
    });

    const deleteButton = document.createElement('span');
    deleteButton.className = 'category-specific-button';
    deleteButton.textContent = '×';
    deleteButton.style.position = 'absolute';
    deleteButton.style.top = '-5px';
    deleteButton.style.right = '-5px';
    deleteButton.style.background = '#FF4444';
    deleteButton.style.borderRadius = '50%';
    deleteButton.style.color = '#fff';
    deleteButton.style.fontSize = '12px';
    deleteButton.style.padding = '2px 6px';
    deleteButton.style.display = isSelectMode ? 'inline-block' : 'none';
    deleteButton.style.cursor = 'pointer';

    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedCategoryName = category.name;

      const popup = document.getElementById('delete-popup');
      const message = document.getElementById('delete-popup-message');
      message.textContent = `Delete "${category.name}"?`;
      popup.style.display = 'flex';
    });

    categoryDiv.appendChild(deleteButton);

    const label = document.createElement('span');
    label.className = 'user-category-label';
    label.textContent = category.name;
    label.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    label.style.fontSize = "8px";
    label.style.marginTop = "5px";
    label.style.textAlign = "center";
    label.style.whiteSpace = "normal";
    label.style.display = "block";
    label.style.maxWidth = "70px";
    label.style.lineHeight = "1.1";
    label.style.wordWrap = "break-word";

    wrapper.appendChild(categoryDiv);
    wrapper.appendChild(label);
    userCategoryRow.appendChild(wrapper);
  });
}

function addUserCategory(name) {
  const position = userCategories.length + 4;
  const color = getColor(name, position);

  userCategories.push({
    name,
    color,
    masterCategory: selectedMasterCategory,
  });

  localStorage.setItem('userCategories', JSON.stringify(userCategories));
  renderUserCategories();
}

function setupDeletePopup() {
  const popup = document.getElementById('delete-popup');
  const cancelBtn = document.getElementById('delete-popup-cancel');
  const deleteBtn = document.getElementById('delete-popup-delete');

  cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    selectedCategoryName = null;
  });

  deleteBtn.addEventListener('click', () => {
    if (selectedCategoryName) {
      userCategories = userCategories.filter(
        (cat) => !(cat.name === selectedCategoryName && cat.masterCategory === selectedMasterCategory)
      );
      localStorage.setItem('userCategories', JSON.stringify(userCategories));
      renderUserCategories();
    }
    popup.style.display = 'none';
    selectedCategoryName = null;
  });
}

function setupSelectModeToggle() {
  const selectButton = document.getElementById('select-button');
  selectButton.addEventListener('click', () => {
    isSelectMode = !isSelectMode;
    renderUserCategories(); // rerender to show/hide delete buttons
  });
}

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
  setupDeletePopup();
  setupSelectModeToggle();

  const addButton = document.querySelector('[data-action="add"]');
  addButton.addEventListener('click', () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      addUserCategory(categoryName);
    }
  });
});
