// File: /shared/scripts/main.js
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
let selectedUserCategories = [];

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
    categoryDiv.style.backgroundColor = getColor(category.name, index);
    categoryDiv.style.width = '40px';
    categoryDiv.style.height = '40px';
    categoryDiv.style.borderRadius = '50%';
    categoryDiv.style.cursor = 'pointer';
    categoryDiv.style.position = 'relative';
    categoryDiv.style.display = 'flex';
    categoryDiv.style.justifyContent = 'center';
    categoryDiv.style.alignItems = 'center';

    categoryDiv.addEventListener('click', () => {
      if (isSelectMode) return;
      localStorage.setItem('activeCategory', category.name);
      window.location.href = '/jiffy/pages/categories/userCategoryView/';
    });

    // Select toggle button (inner-circle)
    const selectButton = document.createElement('span');
    selectButton.className = 'category-specific-button select-mode';
    selectButton.style.display = isSelectMode ? 'inline-flex' : 'none';

    const innerCircle = document.createElement('span');
    innerCircle.className = 'inner-circle';

    selectButton.appendChild(innerCircle);

    selectButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = selectedUserCategories.indexOf(category.name);
      if (index >= 0) {
        selectedUserCategories.splice(index, 1);
        selectButton.classList.remove('selected');
      } else {
        selectedUserCategories.push(category.name);
        selectButton.classList.add('selected');
      }
    });

    categoryDiv.appendChild(selectButton);

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
  const filteredCategories = userCategories.filter(
    (cat) => cat.masterCategory === selectedMasterCategory
  );
  const position = filteredCategories.length;
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

function setupSelectModeControls() {
  const selectBtn = document.getElementById('select-button');
  const deleteBtn = document.getElementById('delete-button');
  const cancelBtn = document.getElementById('cancel-button');

  selectBtn.addEventListener('click', () => {
    isSelectMode = true;
    selectedUserCategories = [];

    selectBtn.style.display = 'none';
    deleteBtn.style.display = 'inline';
    cancelBtn.style.display = 'inline';

    renderUserCategories();
  });

  cancelBtn.addEventListener('click', () => {
    isSelectMode = false;
    selectedUserCategories = [];

    selectBtn.style.display = 'inline';
    deleteBtn.style.display = 'none';
    cancelBtn.style.display = 'none';

    renderUserCategories();
  });

  deleteBtn.addEventListener('click', () => {
    if (selectedUserCategories.length === 0) return;

    selectedUserCategories.forEach((categoryName) => {
      userCategories = userCategories.filter(
        (cat) => !(cat.name === categoryName && cat.masterCategory === selectedMasterCategory)
      );
    });

    localStorage.setItem('userCategories', JSON.stringify(userCategories));
    selectedUserCategories = [];

    renderUserCategories();
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
  setupSelectModeControls();

  const addButton = document.querySelector('[data-action="add"]');
  addButton.addEventListener('click', () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      addUserCategory(categoryName);
    }
  });
});