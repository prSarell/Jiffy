// /jiffy/shared/scripts/main.js
import { getColor } from './colorManagement.js';
import { loadCategories, saveCategories } from './categoryManagement.js';
import { setupEventHandlers } from './eventHandlers.js';
import { initializePopups } from './popupManager.js';
import { addCategory } from './categoryActions.js';

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

  // DOM elements
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  const editColorPopup = document.getElementById('edit-color-popup');
  const editOptionsPopup = document.getElementById('edit-options-popup');
  const editNamePopup = document.getElementById('edit-name-popup');
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');

  console.log('initializeApp: DOM elements retrieved:', {
    popup,
    deletePopup,
    editColorPopup,
    editOptionsPopup,
    editNamePopup,
    selectContainer,
    categoryRow
  });

  // Required DOM elements check
  if (!popup || !deletePopup || !editColorPopup || !selectContainer || !categoryRow) {
    console.error('initializeApp: Required DOM elements not found:', { popup, deletePopup, editColorPopup, selectContainer, categoryRow });
    return;
  }
  if (!editOptionsPopup) {
    console.warn('initializeApp: Optional element edit-options-popup not found; long press edit options may not work.');
  }
  if (!editNamePopup) {
    console.warn('initializeApp: Optional element edit-name-popup not found; name editing may not work.');
  }

  // Initialize popup visibility
  initializePopups({ popup, deletePopup, editColorPopup, editOptionsPopup, editNamePopup });

  // State variables
  let selectMode = false;
  const selectedCategories = new Set();
  let categories = loadCategories(categoryRow);
  console.log('initializeApp: Initial categories loaded:', categories);

  let editingCategoryDiv = null;
  let longHoldTimer = null;
  let isLongHold = false;
  let longHoldTarget = null;
  const LONG_HOLD_DURATION = 500;

  // Expose state and DOM elements to other modules via a shared context
  const appContext = {
    selectMode,
    selectedCategories,
    categories,
    editingCategoryDiv,
    longHoldTimer,
    isLongHold,
    longHoldTarget,
    LONG_HOLD_DURATION,
    popup,
    deletePopup,
    editColorPopup,
    editOptionsPopup,
    editNamePopup,
    selectContainer,
    categoryRow,
    getColor,
    loadCategories,
    saveCategories,
    setEditingCategoryDiv: (div) => { editingCategoryDiv = div; },
    setLongHoldTimer: (timer) => { longHoldTimer = timer; },
    setIsLongHold: (state) => { isLongHold = state; },
    setLongHoldTarget: (target) => { longHoldTarget = target; },
    setSelectMode: (mode) => { selectMode = mode; },
    setCategories: (newCategories) => { categories = newCategories; },
    addCategory: (categoryName) => addCategory(categoryName, appContext)
  };

  // Setup event handlers
  setupEventHandlers(appContext);
}

// Wait for the category-row element to be available before initializing
waitForElement('.category-row', () => {
  console.log('waitForElement: Found .category-row, initializing app');
  initializeApp();
});