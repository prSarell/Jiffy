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
  // New DOM elements for edit options and name editing
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

  if (!popup || !deletePopup || !editColorPopup || !editOptionsPopup || !editNamePopup || !selectContainer || !categoryRow) {
    console.error('initializeApp: Required DOM elements not found:', { popup, deletePopup, editColorPopup, editOptionsPopup, editNamePopup, selectContainer, categoryRow });
    return;
  }

  if (popup.style.display !== 'none') popup.style.display = 'none';
  if (deletePopup.style.display !== 'none') deletePopup.style.display = 'none';
  if (editColorPopup.style.display !== 'none') editColorPopup.style.display = 'none';
  // Initialize new popups
  if (editOptionsPopup.style.display !== 'none') editOptionsPopup.style.display = 'none';
  if (editNamePopup.style.display !== 'none') editNamePopup.style.display = 'none';

  let selectMode = false;
  const selectedCategories = new Set();
  let categories = loadCategories(categoryRow); // Load categories on startup
  console.log('initializeApp: Initial categories loaded:', categories);

  let editingCategoryDiv = null; // Track the category being edited

  // Long hold variables
  let longHoldTimer = null;
  let isLongHold = false; // Flag to track if long hold duration is met
  let longHoldTarget = null; // Track the target category for long hold
  const LONG_HOLD_DURATION = 800; // 800ms for long hold

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

  // New function to show the "Edit" options popup
  function showEditOptionsPopup(categoryDiv) {
    console.log('showEditOptionsPopup: Opening edit options popup');
    editingCategoryDiv = categoryDiv; // Store the category being edited
    editOptionsPopup.style.display = 'flex';
  }

  // New function to close the "Edit" options popup
  function closeEditOptionsPopup() {
    console.log('closeEditOptionsPopup: Closing edit options popup');
    editingCategoryDiv = null; // Clear the editing category
    editOptionsPopup.style.display = 'none';
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

  // New function to show the category name edit popup
  function showEditNamePopup(categoryDiv) {
    console.log('showEditNamePopup: Opening edit name popup');
    const title = document.getElementById('edit-name-popup-title');
    const input = document.getElementById('name-input');
    if (!title || !input) {
      console.error('showEditNamePopup: Edit name popup elements not found:', { title, input });
      return;
    }
    const span = categoryDiv.querySelector('span:last-child');
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    title.textContent = `Edit Name for ${categoryName}`;
    input.value = categoryName; // Pre-fill with the current name
    editingCategoryDiv = categoryDiv; // Store the category being edited
    editNamePopup.style.display = 'flex';
  }

  // New function to close the category name edit popup
  function closeEditNamePopup() {
    console.log('closeEditNamePopup: Closing edit name popup');
    const input = document.getElementById('name-input');
    if (!input) {
      console.error('closeEditNamePopup: Name input not found');
      return;
    }
    input.value = '';
    editingCategoryDiv = null; // Clear the editing category
    editNamePopup.style.display = 'none';
  }

  // Long hold event handlers for edit options (touch and mouse)
  categoryRow.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const categoryDiv = target.closest('.category-row > div');
    if (categoryDiv) {
      longHoldTarget = categoryDiv;
      isLongHold = false;
      longHoldTimer = setTimeout(() => {
        console.log('touchstart: Long hold duration met on category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
        isLongHold = true; // Set flag to indicate long hold duration is met
      }, LONG_HOLD_DURATION);
    }
  });

  categoryRow.addEventListener('touchend', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
    }
    if (isLongHold && longHoldTarget) {
      console.log('touchend: Long hold released, triggering edit options for category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
      showEditOptionsPopup(longHoldTarget); // Updated to show the new "Edit" popup
    }
    isLongHold = false;
    longHoldTarget = null;
  });

  categoryRow.addEventListener('touchmove', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
    }
    isLongHold = false;
    longHoldTarget = null;
  });

  categoryRow.addEventListener('mousedown', (event) => {
    const target = event.target.closest('.category-row > div');
    if (target) {
      longHoldTarget = target;
      isLongHold = false;
      longHoldTimer = setTimeout(() => {
        console.log('mousedown: Long hold duration met on category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
        isLongHold = true; // Set flag to indicate long hold duration is met
      }, LONG_HOLD_DURATION);
    }
  });

  categoryRow.addEventListener('mouseup', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
    }
    if (isLongHold && longHoldTarget) {
      console.log('mouseup: Long hold released, triggering edit options for category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
      showEditOptionsPopup(longHoldTarget); // Updated to show the new "Edit" popup
    }
    isLongHold = false;
    longHoldTarget = null;
  });

  categoryRow.addEventListener('mousemove', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      longHoldTimer = null;
    }
    isLongHold = false;
    longHoldTarget = null;
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
      } else if (popupButton.closest('#edit-name-popup')) { // New: Edit name popup buttons
        if (action === 'confirm') {
          const input = document.getElementById('name-input');
          if (!input || !editingCategoryDiv) {
            console.error('click: Name input or editing category not found:', { input, editingCategoryDiv });
            return;
          }
          const newName = input.value.trim();
          if (newName) {
            const span = editingCategoryDiv.querySelector('span:last-child');
            if (!span) {
              console.error('click: Span not found in editing category div:', editingCategoryDiv);
              return;
            }
            const oldName = span.textContent.trim();
            // Update the category name in the DOM
            span.textContent = newName;
            // Update userColors and colorGroups with the new name
            const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(editingCategoryDiv);
            const currentColor = getColor(oldName, position);
            setColor(newName, currentColor, oldName);
            // Save updated categories to localStorage
            categories = saveCategories(categoryRow);
            closeEditNamePopup();
          } else {
            alert('Please enter a category name!');
          }
        } else if (action === 'cancel') {
          closeEditNamePopup();
        }
      } else if (popupButton.closest('#edit-options-popup')) { // New: Edit options popup buttons
        if (action === 'edit-name') {
          closeEditOptionsPopup();
          showEditNamePopup(editingCategoryDiv);
        } else if (action === 'edit-color') {
          closeEditOptionsPopup();
          showEditColorPopup(editingCategoryDiv);
        } else if (action === 'cancel') {
          closeEditOptionsPopup();
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
          button.style.display = 'block';
        });
      } else if (action === 'cancel-button') {
        selectMode = false;
        selectedCategories.clear();
        selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.style.display = 'none';
          const innerCircle = button.querySelector('.inner-circle');
          if (innerCircle) innerCircle.style.display = 'none';
        });
      } else if (action === 'delete-button') {
        if (selectedCategories.size > 0) {
          const deletePopupMessage = document.getElementById('delete-popup-message');
          if (!deletePopupMessage) {
            console.error('click: Delete popup message element not found');
            return;
          }
          const categoryNames = Array.from(selectedCategories).map(cat => {
            const span = cat.querySelector('span:last-child');
            return span ? span.textContent : 'Unknown';
          });
          deletePopupMessage.textContent = selectedCategories.size === 1 ? `Delete ${categoryNames[0]}?` : `Delete ${categoryNames.length} items?`;
          deletePopup.style.display = 'flex';
        } else {
          alert('Please select at least one category to delete.');
        }
      }
    }
  });

  categoryRow.addEventListener('click', (event) => {
    console.log('categoryRow click: Handling click event');
    const button = event.target.closest('button');
    if (button && button.querySelector('.category-specific-button') && selectMode) {
      const categoryDiv = button.parentElement;
      const span = categoryDiv.querySelector('span:last-child');
      if (!span) {
        console.error('categoryRow click: No span found for category div in select mode:', categoryDiv);
        return;
      }
      const categoryName = span.textContent.trim();
      const innerCircle = button.querySelector('.inner-circle');
      if (!innerCircle) {
        console.error('categoryRow click: Inner circle not found for category button:', button);
        return;
      }
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
    console.log('delete-popup-cancel: Cancel clicked');
    deletePopup.style.display = 'none';
    selectMode = false;
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });

  document.getElementById('delete-popup-delete').addEventListener('click', () => {
    console.log('delete-popup-delete: Delete clicked');
    const deletedPositions = [];
    selectedCategories.forEach(categoryDiv => {
      const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(categoryDiv);
      deletedPositions.push(position);
    });

    selectedCategories.forEach(categoryDiv => {
      categoryDiv.style.transition = 'opacity 0.3s';
      categoryDiv.style.opacity = '0';
      setTimeout(() => {
        const span = categoryDiv.querySelector('span:last-child');
        if (!span) {
          console.error('delete-popup-delete: No span found for category div during delete:', categoryDiv);
          return;
        }
        const categoryName = span.textContent.trim();
        const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(categoryDiv);
        const categoriesPerLine = 4;
        const lineNumber = Math.floor(position / categoriesPerLine) + 1;
        removeCategory(lineNumber); // Notify colorManagement of the deletion
        categoryDiv.remove();
        categories = saveCategories(categoryRow); // Save updated categories
      }, 300);
    });

    // After deletion, reassign colors to remaining categories in the affected lines
    setTimeout(() => {
      const affectedLines = new Set(deletedPositions.map(pos => Math.floor(pos / 4) + 1));
      affectedLines.forEach(lineNumber => {
        const startPosition = (lineNumber - 1) * 4;
        const endPosition = startPosition + 4;
        const categoryDivs = Array.from(categoryRow.querySelectorAll('div'));
        for (let pos = startPosition; pos < endPosition && pos < categoryDivs.length; pos++) {
          const categoryDiv = categoryDivs[pos];
          const span = categoryDiv.querySelector('span:last-child');
          if (!span) continue;
          const categoryName = span.textContent.trim();
          const newColor = getColor(categoryName, pos); // Reassign color based on new position
          setColor(categoryName, newColor); // Update the color in userColors
          const button = categoryDiv.querySelector('button');
          if (button) {
            button.style.backgroundColor = newColor; // Update the DOM
          }
        }
      });
    }, 300);

    deletePopup.style.display = 'none';
    selectMode = false;
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });
}

// Wait for the category-row element to be available before initializing
waitForElement('.category-row', () => {
  console.log('waitForElement: Found .category-row, initializing app');
  initializeApp();
});