// shared/scripts/main.js
import { getColor, setColor, removeCategory, groupCategories } from './colorManagement.js';
import { loadCategories, saveCategories } from './categoryManagement.js';

// Function to wait for an element to be available
function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
  let attempts = 0;
  const intervalId = setInterval(() => {
    const element = document.querySelector(selector);
    attempts++;
    console.log(`waitForElement: Attempt ${attempts} to find ${selector}:`, element);
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
  console.log('initializeApp: Starting app initialization');

  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  const editColorPopup = document.getElementById('edit-color-popup');
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');

  console.log('initializeApp: DOM elements retrieved:', {
    popup,
    deletePopup,
    editColorPopup,
    selectContainer,
    categoryRow
  });

  if (!popup || !deletePopup || !editColorPopup || !selectContainer || !categoryRow) {
    console.error('initializeApp: Required DOM elements not found:', { popup, deletePopup, editColorPopup, selectContainer, categoryRow });
    return;
  }

  if (popup.style.display !== 'none') popup.style.display = 'none';
  if (deletePopup.style.display !== 'none') deletePopup.style.display = 'none';
  if (editColorPopup.style.display !== 'none') editColorPopup.style.display = 'none';

  let selectMode = false;
  const selectedCategories = new Set();
  let categories = loadCategories(categoryRow); // Load categories on startup
  console.log('initializeApp: Initial categories loaded:', categories);

  let editingCategoryDiv = null; // Track the category being edited

  // Variables for long hold detection
  let longHoldTimer = null;
  const longHoldDuration = 500; // 500ms for a long hold

  function showAddPopup() {
    console.log('showAddPopup: Opening add popup');
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    if (!title || !input) {
      console.error('showAddPopup: Popup elements not found:', { title, input });
      return;
    }
    title.textContent = 'Add Category';
    input.value = '';
    popup.style.display = 'flex';
  }

  function closePopup() {
    console.log('closePopup: Closing add popup');
    const input = document.getElementById('category-input');
    if (!input) {
      console.error('closePopup: Category input not found');
      return;
    }
    input.value = '';
    popup.style.display = 'none';
  }

  function addCategory(categoryName) {
    console.log(`addCategory: Adding category "${categoryName}"`);
    const categoryDivs = categoryRow.querySelectorAll('div');
    const position = categoryDivs.length; // 0-based position of the new category
    const newColor = getColor(categoryName, position); // Pass the position
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
    categories = saveCategories(categoryRow); // Save updated categories
  }

  function showEditColorPopup(categoryDiv) {
    console.log('showEditColorPopup: Opening edit color popup');
    const title = document.getElementById('edit-color-popup-title');
    const input = document.getElementById('color-input');
    if (!title || !input) {
      console.error('showEditColorPopup: Edit color popup elements not found:', { title, input });
      return;
    }
    const span = categoryDiv.querySelector('span:last-child');
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    title.textContent = `Edit Color for ${categoryName}`;
    const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(categoryDiv);
    const currentColor = getColor(categoryName, position); // Pass the position
    input.value = currentColor; // Set the color picker to the current color
    editingCategoryDiv = categoryDiv; // Store the category being edited
    editColorPopup.style.display = 'flex';
  }

  function closeEditColorPopup() {
    console.log('closeEditColorPopup: Closing edit color popup');
    const input = document.getElementById('color-input');
    if (!input) {
      console.error('closeEditColorPopup: Color input not found');
      return;
    }
    input.value = '';
    editingCategoryDiv = null; // Clear the editing category
    editColorPopup.style.display = 'none';
  }

  // Long hold detection for touch devices
  categoryRow.addEventListener('touchstart', (event) => {
    const target = event.target.closest('.category-row > div > button');
    if (target) {
      const categoryDiv = target.parentElement;
      longHoldTimer = setTimeout(() => {
        console.log('touchstart: Long hold detected on category:', categoryDiv.querySelector('span:last-child').textContent.trim());
        showEditColorPopup(categoryDiv);
      }, longHoldDuration);
    }
  });

  categoryRow.addEventListener('touchend', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
      console.log('touchend: Long hold timer cleared');
    }
  });

  categoryRow.addEventListener('touchmove', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
      console.log('touchmove: Long hold timer cleared due to movement');
    }
  });

  // Long hold detection for mouse devices
  categoryRow.addEventListener('mousedown', (event) => {
    const target = event.target.closest('.category-row > div > button');
    if (target) {
      const categoryDiv = target.parentElement;
      longHoldTimer = setTimeout(() => {
        console.log('mousedown: Long hold detected on category:', categoryDiv.querySelector('span:last-child').textContent.trim());
        showEditColorPopup(categoryDiv);
      }, longHoldDuration);
    }
  });

  categoryRow.addEventListener('mouseup', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
      console.log('mouseup: Long hold timer cleared');
    }
  });

  categoryRow.addEventListener('mousemove', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
      console.log('mousemove: Long hold timer cleared due to movement');
    }
  });

  document.addEventListener('click', (event) => {
    console.log('click: Handling click event');
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      console.log(`click: Action button clicked with action: ${action}`);
      if (action === 'add') {
        showAddPopup();
      } else if (action === 'show-rewards') {
        console.log('click: Rewards action not implemented');
      }
      return;
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log(`click: Popup button clicked with action: ${action}`);
      if (popupButton.closest('#popup')) { // Add popup buttons
        if (action === 'confirm') {
          const input = document.getElementById('category-input');
          if (!input) {
            console.error('click: Category input not found');
            return;
          }
          const categoryName = input.value.trim();
          if (categoryName) {
            addCategory(categoryName);
            input.value = '';
            closePopup();
          } else {
            alert('Please enter a category name!');
          }
        } else if (action === 'cancel') {
          closePopup();
        }
      } else if (popupButton.closest('#edit-color-popup')) { // Edit color popup buttons
        if (action === 'confirm') {
          const input = document.getElementById('color-input');
          if (!input || !editingCategoryDiv) {
            console.error('click: Color input or editing category not found:', { input, editingCategoryDiv });
            return;
          }
          const newColor = input.value;
          const span = editingCategoryDiv.querySelector('span:last-child');
          const categoryName = span ? span.textContent.trim() : 'Unknown';
          setColor(categoryName, newColor); // Save the new color to userColors
          const button = editingCategoryDiv.querySelector('button');
          if (button) {
            button.style.backgroundColor = newColor; // Update the button color in the DOM
          }
          closeEditColorPopup();
        } else if (action === 'cancel') {
          closeEditColorPopup();
        }
      }
      return;
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      console.log(`click: Select container clicked with action: ${action}`);
      if (action === 'select-button') {
        selectMode = true;
        selectAction.style.display = 'none';
        selectContainer.innerHTML = `
          <span id="delete-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Delete</span>
          <span id="cancel-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
        `;
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.style.display