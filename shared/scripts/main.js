import { getColor } from './colorManagement.js';
import { loadCategories, saveCategories } from './categoryManagement.js';
import { setupEventHandlers } from './eventHandlers.js';
import { initializePopups } from './popupManager.js';
import { addCategory } from './categoryActions.js';
import { cyclePrompts, getPrompts } from './promptManagement.js';

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
  const promptDisplay = document.getElementById('prompt-display');

  console.log('initializeApp: DOM elements retrieved:', {
    popup,
    deletePopup,
    editColorPopup,
    editOptionsPopup,
    editNamePopup,
    selectContainer,
    categoryRow,
    promptDisplay
  });

  // Required DOM elements check
  if (!popup || !deletePopup || !editColorPopup || !selectContainer || !categoryRow || !promptDisplay) {
    console.error('initializeApp: Required DOM elements not found:', { popup, deletePopup, editColorPopup, selectContainer, categoryRow, promptDisplay });
    promptDisplay.textContent = 'Error: Required elements not found';
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
  let categories = [];
  try {
    categories = loadCategories(categoryRow);
    console.log('initializeApp: Initial categories loaded:', categories);
  } catch (error) {
    console.error('initializeApp: Failed to load categories:', error);
    promptDisplay.textContent = 'Error loading categories';
    return;
  }

  let editingCategoryDiv = null;
  let longHoldTimer = null;
  let isLongHold = false;
  let longHoldTarget = null;
  const LONG_HOLD_DURATION = 500;

  // Expose state and DOM elements to other modules via a shared context
  const appContext = {
    get selectMode() { return selectMode; },
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
    setSelectMode: (mode) => { 
      console.log(`setSelectMode: Setting selectMode to ${mode}, previous value: ${selectMode}`);
      selectMode = mode; 
      console.log(`setSelectMode: New selectMode value: ${selectMode}`);
    },
    setCategories: (newCategories) => { categories = newCategories; },
    addCategory: (categoryName) => addCategory(categoryName, appContext),
    removeCategory: (lineNumber) => { /* Placeholder for color management */ }
  };

  // Setup event handlers
  setupEventHandlers(appContext);

  // Register the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/jiffy/service-workers/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        // Start prompt cycling
        cyclePrompts(prompt => {
          promptDisplay.textContent = prompt.text || 'No prompt text';
          // Send push notification
          if ('PushManager' in window) {
            registration.pushManager.getSubscription().then(subscription => {
              if (subscription) {
                fetch('/send-push', {
                  method: 'POST',
                  body: JSON.stringify({
                    subscription,
                    title: 'Jiffy Prompt',
                    body: prompt.text || 'New Prompt'
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).catch(error => {
                  console.error('Error sending push notification:', error);
                });
              } else {
                console.warn('Push subscription not found');
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
        promptDisplay.textContent = 'Service Worker failed to register. Prompts will still display here.';
        // Continue prompt cycling without service worker
        cyclePrompts(prompt => {
          promptDisplay.textContent = prompt.text || 'No prompt text';
        });
      });
  } else {
    console.warn('Service Workers are not supported in this browser.');
    promptDisplay.textContent = 'Service Workers not supported. Prompts will still display here.';
    // Continue prompt cycling without service worker
    cyclePrompts(prompt => {
      promptDisplay.textContent = prompt.text || 'No prompt text';
    });
  }
}

// Wait for the category-row element to be available before initializing
waitForElement('.category-row', () => {
  console.log('waitForElement: Found .category-row, initializing app');
  initializeApp();
});
