// shared/scripts/main.js
import { getColor } from './colorManagement.js';
import { loadCategories, saveCategories } from './categoryManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');

  if (!popup || !deletePopup || !selectContainer || !categoryRow) {
    console.error('Required DOM elements not found:', { popup, deletePopup, selectContainer, categoryRow });
    return;
  }

  if (popup.style.display !== 'none') popup.style.display = 'none';
  if (deletePopup.style.display !== 'none') deletePopup.style.display = 'none';

  let selectMode = false;
  const selectedCategories = new Set();
  let categories = loadCategories(categoryRow, selectMode); // Load categories on startup

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
    console.log('Show add popup');
  }

  function closePopup() {
    const input = document.getElementById('category-input');
    if (!input) {
      console.error('Category input not found');
      return;
    }
    input.value = '';
    popup.style.display = 'none';
    console.log('Close popup');
  }

  function addCategory(categoryName) {
    const defaultColor = getColor(categoryName);
    const newButton = document.createElement('div');
    newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    newButton.draggable = true;
    newButton.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${defaultColor}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: ${selectMode ? 'block' : 'none'};">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
    `;
    categoryRow.appendChild(newButton);
    categories = saveCategories(categoryRow); // Save updated categories
    console.log('Added category:', categoryName);
  }

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      console.log(`Action button clicked with action: ${action}`);
      if (action === 'add') {
        console.log('Attempting to show add popup');
        showAddPopup();
      } else if (action === 'show-rewards') {
        console.log('Rewards action not implemented');
      }
      return;
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log(`Popup button clicked with action: ${action}`);
      if (action === 'confirm') {
        console.log('Attempting to confirm add category');
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
          console.log('No category name entered');
        }
      } else if (action === 'cancel') {
        console.log('Attempting to close popup');
        closePopup();
      }
      return;
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      console.log(`Select container clicked with action: ${action}`);
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
        console.log('Entered select mode');
      } else if (action === 'cancel-button') {
        selectMode = false;
        selectedCategories.clear();
        selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.style.display = 'none';
          const innerCircle = button.querySelector('.inner-circle');
          if (innerCircle) innerCircle.style.display = 'none';
        });
        console.log('Exited select mode');
      } else if (action === 'delete-button') {
        console.log('Delete button clicked, selected categories:', selectedCategories.size);
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
          deletePopupMessage.textContent = selectedCategories.size === 1 ? `Delete ${categoryNames[0]}?` : `Delete ${selectedCategories.size} items?`;
          deletePopup.style.display = 'flex';
          console.log('Delete popup shown');
        } else {
          alert('Please select at least one category to delete.');
          console.log('No categories selected');
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
      console.log(`Select mode - Processing category: "|${categoryName}|"`);

      const innerCircle = button.querySelector('.inner-circle');
      if (!innerCircle) {
        console.error('Inner circle not found for category button:', button);
        return;
      }
      if (selectedCategories.has(categoryDiv)) {
        selectedCategories.delete(categoryDiv);
        innerCircle.style.display = 'none';
        console.log('Unselected:', categoryName);
      } else {
        selectedCategories.add(categoryDiv);
        innerCircle.style.display = 'block';
        console.log('Selected:', categoryName);
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
    console.log('Delete canceled');
  });

  document.getElementById('delete-popup-delete').addEventListener('click', () => {
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
        categoryDiv.remove();
        categories = saveCategories(categoryRow); // Save updated categories
        console.log('Deleted category:', categoryName);
      }, 300);
    });
    selectedCategories.clear();
    deletePopup.style.display = 'none';
    selectMode = false;
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
    console.log('Categories deleted');
  });
});