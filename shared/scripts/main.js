// shared/scripts/main.js
import { getColor, setColor, removeCategory } from './colorManagement.js';
import { loadCategories, saveCategories } from './categoryManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  const editColorPopup = document.getElementById('edit-color-popup');
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');

  if (!popup || !deletePopup || !editColorPopup || !selectContainer || !categoryRow) {
    console.error('Required DOM elements not found:', { popup, deletePopup, editColorPopup, selectContainer, categoryRow });
    return;
  }

  if (popup.style.display !== 'none') popup.style.display = 'none';
  if (deletePopup.style.display !== 'none') deletePopup.style.display = 'none';
  if (editColorPopup.style.display !== 'none') editColorPopup.style.display = 'none';

  let selectMode = false;
  const selectedCategories = new Set();
  let categories = loadCategories(categoryRow); // Load categories on startup
  let editingCategoryDiv = null; // Track the category being edited

  function showAddPopup() {
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    if (!title || !input) {
      console.error('Popup elements not found:', { title, input });
      return;
    }
    title.textContent = 'Add Category';
    input.value = '';
    popup.style.display = 'flex';
  }

  function closePopup() {
    const input = document.getElementById('category-input');
    if (!input) {
      console.error('Category input not found');
      return;
    }
    input.value = '';
    popup.style.display = 'none';
  }

  function addCategory(categoryName) {
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
    const title = document.getElementById('edit-color-popup-title');
    const input = document.getElementById('color-input');
    if (!title || !input) {
      console.error('Edit color popup elements not found:', { title, input });
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
    const input = document.getElementById('color-input');
    if (!input) {
      console.error('Color input not found');
      return;
    }
    input.value = '';
    editingCategoryDiv = null; // Clear the editing category
    editColorPopup.style.display = 'none';
  }

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      if (action === 'add') {
        showAddPopup();
      } else if (action === 'show-rewards') {
        console.log('Rewards action not implemented');
      }
      return;
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      if (popupButton.closest('#popup')) { // Add popup buttons
        if (action === 'confirm') {
          const input = document.getElementById('category-input');
          if (!input) {
            console.error('Category input not found');
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
            console.error('Color input or editing category not found:', { input, editingCategoryDiv });
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
      if (action === 'select-button') {
        selectMode = true;
        selectAction.style.display = 'none';
        selectContainer.innerHTML = `
          <span id="edit-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Edit</span>
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
          if (!deletePopupMessage) {
            console.error('Delete popup message element not found');
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
    const button = event.target.closest('button');
    if (button && button.querySelector('.category-specific-button') && selectMode) {
      const categoryDiv = button.parentElement;
      const span = categoryDiv.querySelector('span:last-child');
      if (!span) {
        console.error('No span found for category div in select mode:', categoryDiv);
        return;
      }
      const categoryName = span.textContent.trim();
      const innerCircle = button.querySelector('.inner-circle');
      if (!innerCircle) {
        console.error('Inner circle not found for category button:', button);
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
          console.error('No span found for category div during delete:', categoryDiv);
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
});