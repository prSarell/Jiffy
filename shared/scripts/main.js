// File: /jiffy/shared/scripts/main.js
// Purpose: Core app logic for loading, saving, displaying, and deleting categories.
// Handles popup behavior, selection mode, color editing, and protects master categories from deletion.

import { getColor, setColor } from './colorManagement.js';
import { loadCategories, saveCategories, removeCategory } from './categoryManagement.js';

function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
  let attempts = 0;
  const intervalId = setInterval(() => {
    const element = document.querySelector(selector);
    attempts++;
    if (element) {
      clearInterval(intervalId);
      callback(element);
    } else if (attempts >= maxAttempts) {
      clearInterval(intervalId);
      console.error(`waitForElement: Failed to find ${selector} after ${maxAttempts} attempts`);
    }
  }, interval);
}

function initializeApp() {
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  const editColorPopup = document.getElementById('edit-color-popup');
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');

  if (!popup || !deletePopup || !editColorPopup || !selectContainer || !categoryRow) {
    console.error('initializeApp: Required DOM elements not found');
    return;
  }

  popup.style.display = 'none';
  deletePopup.style.display = 'none';
  editColorPopup.style.display = 'none';

  const addButton = document.querySelector('.action-button[data-action="add"]');
  if (addButton) {
    addButton.addEventListener('click', showAddPopup);
  }

  let selectMode = false;
  const selectedCategories = new Set();
  let categories = loadCategories(categoryRow);
  let editingCategoryDiv = null;

  function showAddPopup() {
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    if (!title || !input) return;
    title.textContent = 'Add Category';
    input.value = '';
    popup.style.display = 'flex';
  }

  function closePopup() {
    const input = document.getElementById('category-input');
    if (!input) return;
    input.value = '';
    popup.style.display = 'none';
  }

  function addCategory(categoryName) {
    const categoryDivs = categoryRow.querySelectorAll('div');
    const position = categoryDivs.length;
    const newColor = getColor(categoryName, position);
    const newButton = document.createElement('div');
    newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    newButton.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${newColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: ${selectMode ? 'block' : 'none'};">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
    `;
    categoryRow.appendChild(newButton);
    categories = saveCategories(categoryRow);
  }

  function showEditColorPopup(categoryDiv) {
    const title = document.getElementById('edit-color-popup-title');
    const input = document.getElementById('color-input');
    if (!title || !input) return;
    const span = categoryDiv.querySelector('span:last-child');
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    title.textContent = `Edit Color for ${categoryName}`;
    const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(categoryDiv);
    const currentColor = getColor(categoryName, position);
    input.value = currentColor;
    editingCategoryDiv = categoryDiv;
    editColorPopup.style.display = 'flex';
    input.click();
  }

  function closeEditColorPopup() {
    const input = document.getElementById('color-input');
    if (!input) return;
    input.value = '';
    editingCategoryDiv = null;
    editColorPopup.style.display = 'none';
  }

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      if (action === 'add') showAddPopup();
      return;
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      if (popupButton.closest('#popup')) {
        const input = document.getElementById('category-input');
        if (action === 'confirm' && input && input.value.trim()) {
          addCategory(input.value.trim());
          closePopup();
        } else if (action === 'cancel') {
          closePopup();
        }
      } else if (popupButton.closest('#edit-color-popup')) {
        const input = document.getElementById('color-input');
        if (action === 'yes' && input && editingCategoryDiv) {
          const span = editingCategoryDiv.querySelector('span:last-child');
          const categoryName = span ? span.textContent.trim() : 'Unknown';
          const newColor = input.value;
          setColor(categoryName, newColor);
          const button = editingCategoryDiv.querySelector('button');
          if (button) button.style.backgroundColor = newColor;
          closeEditColorPopup();
        } else if (action === 'no') {
          closeEditColorPopup();
        }
      }
      return;
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      if (action === 'select-button') {
        selectMode = true;
        selectContainer.innerHTML = `
          <span id="edit-button" style="font-size: 8px; margin-left: 5px; cursor: pointer;">Edit</span>
          <span id="delete-button" style="font-size: 8px; margin-left: 5px; cursor: pointer;">Delete</span>
          <span id="cancel-button" style="font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
        `;
        document.querySelectorAll('.category-row > div').forEach(categoryDiv => {
          const span = categoryDiv.querySelector('span:last-child');
          const categoryName = span ? span.textContent.trim() : '';
          const isMaster = ['Home', 'Life', 'Work', 'School'].includes(categoryName);
          const button = categoryDiv.querySelector('.category-specific-button');
          if (button) button.style.display = isMaster ? 'none' : 'block';
        });
      } else if (action === 'cancel-button') {
        selectMode = false;
        selectedCategories.clear();
        selectContainer.innerHTML = '<span id="select-button" style="font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.style.display = 'none';
          const innerCircle = button.querySelector('.inner-circle');
          if (innerCircle) innerCircle.style.display = 'none';
        });
      } else if (action === 'edit-button') {
        if (selectedCategories.size === 1) {
          const categoryDiv = Array.from(selectedCategories)[0];
          showEditColorPopup(categoryDiv);
        } else {
          alert('Please select exactly one category to edit its color.');
        }
      } else if (action === 'delete-button') {
        if (selectedCategories.size > 0) {
          const deletePopupMessage = document.getElementById('delete-popup-message');
          const categoryNames = Array.from(selectedCategories).map(cat => {
            const span = cat.querySelector('span:last-child');
            return span ? span.textContent : 'Unknown';
          });
          deletePopupMessage.textContent = selectedCategories.size === 1
            ? `Delete ${categoryNames[0]}?`
            : `Delete ${categoryNames.length} items?`;
          deletePopup.style.display = 'flex';
        } else {
          alert('Please select at least one category to delete.');
        }
      }
    }
  });

  categoryRow.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const categoryDiv = button.parentElement;

    if (!selectMode) {
      categoryRow.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    }

    if (selectMode) {
      const span = categoryDiv.querySelector('span:last-child');
      const categoryName = span ? span.textContent.trim() : '';
      const isMaster = ['Home', 'Life', 'Work', 'School'].includes(categoryName);
      if (isMaster) return; // Don't allow master categories to be selected

      const innerCircle = button.querySelector('.inner-circle');
      if (!span || !innerCircle) return;
      if (selectedCategories.has(categoryDiv)) {
        selectedCategories.delete(categoryDiv);
        innerCircle.style.display = 'none';
      } else {
        selectedCategories.add(categoryDiv);
        innerCircle.style.display = 'block';
      }
    }
  });

  document.getElementById('delete-popup-cancel').addEventListener('click', () => {
    deletePopup.style.display = 'none';
    selectMode = false;
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });

  document.getElementById('delete-popup-delete').addEventListener('click', () => {
    selectedCategories.forEach(categoryDiv => {
      const span = categoryDiv.querySelector('span:last-child');
      if (!span) return;
      const categoryName = span.textContent.trim();

      const isMasterCategory = ['Home', 'Life', 'Work', 'School'].includes(categoryName);
      if (isMasterCategory) {
        alert(`"${categoryName}" is a master category and cannot be deleted.`);
        return;
      }

      categoryDiv.style.transition = 'opacity 0.3s';
      categoryDiv.style.opacity = '0';

      setTimeout(() => {
        removeCategory(categoryName);
        categoryDiv.remove();
        categories = saveCategories(categoryRow);
      }, 300);
    });

    deletePopup.style.display = 'none';
    selectMode = false;
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });
}

waitForElement('.category-row', () => {
  initializeApp();
});