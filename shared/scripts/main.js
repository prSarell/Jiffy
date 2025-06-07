// File: /jiffy/shared/scripts/main.js
// Purpose: Manages user-created categories, ensures they're associated with the selected master category.
//          Prevents deletion or editing of master categories. Uses masterCategoryManagement.js to render tabs.
// Update: Removed manual color prompt — uses getColor() with correct position offset.

import { renderMasterCategories } from './masterCategoryManagement.js';
import { getColor, setColor } from './colorManagement.js';
import { getPrompts } from '../../pages/prompts/promptManagement.js';

const masterCategories = ['Home', 'Work', 'Life', 'School'];
let selectedMasterCategory = 'Home';
let userCategories = JSON.parse(localStorage.getItem('userCategories')) || [];
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

    categoryDiv.addEventListener('click', () => {
      console.log("✅ Redirecting to user category view:", category.name);
      localStorage.setItem('activeCategory', category.name);
      window.location.href = '/jiffy/pages/categories/userCategoryView/';
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'category-specific-button';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      userCategories = userCategories.filter(
        (cat) => !(cat.name === category.name && cat.masterCategory === category.masterCategory)
      );
      localStorage.setItem('userCategories', JSON.stringify(userCategories));
      renderUserCategories();
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
  const position = userCategories.length + 4; // Offset master categories
  const color = getColor(name, position);

  userCategories.push({
    name,
    color,
    masterCategory: selectedMasterCategory,
  });
  localStorage.setItem('userCategories', JSON.stringify(userCategories));
  renderUserCategories();
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

  const addButton = document.querySelector('[data-action="add"]');
  addButton.addEventListener('click', () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      addUserCategory(categoryName);
    }
  });
});
