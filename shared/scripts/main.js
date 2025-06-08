// Path: /jiffy/shared/scripts/main.js
import { renderMasterCategories } from './masterCategoryManagement.js';
import { getColor } from './colorManagement.js';
import { getPrompts } from '../../pages/prompts/promptManagement.js';

let userCategories = JSON.parse(localStorage.getItem('userCategories')) || [];
let selectedMasterCategory = 'Home';
let selectedUserCategories = [];
let isSelectMode = false;

function displayPrompt() {
  const prompts = getPrompts();
  if (!prompts.length) return;
  const randomIndex = Math.floor(Math.random() * prompts.length);
  document.getElementById('prompt-container').textContent = prompts[randomIndex].text;
}

function renderUserCategories() {
  const row = document.getElementById('user-category-row');
  row.innerHTML = '';
  userCategories
    .filter(cat => cat.masterCategory === selectedMasterCategory)
    .forEach((cat, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'category-item';
      wrapper.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';

      const button = document.createElement('button');
      button.className = 'user-category';
      button.style.backgroundColor = getColor(cat.name, i);
      button.addEventListener('click', () => {
        if (!isSelectMode) {
          localStorage.setItem('activeCategory', cat.name);
          window.location.href = '/jiffy/pages/categories/userCategoryView/';
        }
      });

      const selectBtn = document.createElement('span');
      selectBtn.className = 'category-specific-button select-mode';
      selectBtn.style.display = isSelectMode ? 'inline-flex' : 'none';

      const inner = document.createElement('span');
      inner.className = 'inner-circle';
      selectBtn.appendChild(inner);

      selectBtn.addEventListener('click', e => {
        e.stopPropagation();
        const index = selectedUserCategories.indexOf(cat.name);
        if (index >= 0) {
          selectedUserCategories.splice(index, 1);
          selectBtn.classList.remove('selected');
        } else {
          selectedUserCategories.push(cat.name);
          selectBtn.classList.add('selected');
        }
      });

      button.appendChild(selectBtn);
      wrapper.appendChild(button);

      const label = document.createElement('span');
      label.className = 'user-category-label';
      label.textContent = cat.name;
      wrapper.appendChild(label);

      row.appendChild(wrapper);
    });
}

function setupSelectModeControls() {
  const select = document.getElementById('select-button');
  const deleteBtn = document.getElementById('delete-button');
  const cancel = document.getElementById('cancel-button');
  const popup = document.getElementById('delete-popup');
  const confirm = document.getElementById('delete-popup-delete');
  const popupCancel = document.getElementById('delete-popup-cancel');

  select.addEventListener('click', () => {
    isSelectMode = true;
    selectedUserCategories = [];
    select.style.display = 'none';
    deleteBtn.style.display = 'inline';
    cancel.style.display = 'inline';
    renderUserCategories();
  });

  cancel.addEventListener('click', () => {
    isSelectMode = false;
    selectedUserCategories = [];
    select.style.display = 'inline';
    deleteBtn.style.display = 'none';
    cancel.style.display = 'none';
    renderUserCategories();
  });

  deleteBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
    document.getElementById('delete-popup-message').textContent = 'Delete selected?';
  });

  confirm.addEventListener('click', () => {
    userCategories = userCategories.filter(
      cat => !selectedUserCategories.includes(cat.name)
    );
    localStorage.setItem('userCategories', JSON.stringify(userCategories));
    isSelectMode = false;
    selectedUserCategories = [];
    popup.style.display = 'none';
    select.style.display = 'inline';
    deleteBtn.style.display = 'none';
    cancel.style.display = 'none';
    renderUserCategories();
  });

  popupCancel.addEventListener('click', () => {
    popup.style.display = 'none';
  });
}

function setupAddCategoryPopup() {
  const addBtn = document.querySelector('[data-action="add"]');
  const popup = document.getElementById('popup');
  const input = document.getElementById('category-input');
  const confirmBtn = popup.querySelector('[data-action="confirm"]');
  const cancelBtn = popup.querySelector('[data-action="cancel"]');

  addBtn.addEventListener('click', () => {
    input.value = '';
    popup.style.display = 'flex';
    input.focus();
  });

  confirmBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) {
      userCategories.push({ name, masterCategory: selectedMasterCategory });
      localStorage.setItem('userCategories', JSON.stringify(userCategories));
      renderUserCategories();
    }
    popup.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayPrompt();
  renderMasterCategories(document.getElementById('master-category-row'), (category) => {
    selectedMasterCategory = category;
    renderUserCategories();
  });
  renderUserCategories();
  setupSelectModeControls();
  setupAddCategoryPopup();
});