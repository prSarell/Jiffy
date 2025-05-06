// shared/scripts/main.js
import { getColor, setColor, removeColor } from './colorManagement.js';
import { initializeDragAndDrop } from './dragAndDrop.js';

document.addEventListener('DOMContentLoaded', () => {
  // Ensure popups are hidden on page load
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  console.log('Initial popup display state:', popup.style.display, 'Delete popup:', deletePopup.style.display);
  if (popup.style.display !== 'none') {
    popup.style.display = 'none';
    console.log('Popup was not hidden, forced to display: none');
  }
  if (deletePopup.style.display !== 'none') {
    deletePopup.style.display = 'none';
    console.log('Delete popup was not hidden, forced to display: none');
  }

  let selectMode = false;
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');
  const selectedCategories = new Set();

  // Initialize drag-and-drop
  initializeDragAndDrop(categoryRow);

  // Apply stored colors to existing categories on page load
  const categoryDivs = categoryRow.querySelectorAll('div[draggable="true"]');
  categoryDivs.forEach((div, index) => {
    const categoryName = div.querySelector('span:last-child').textContent;
    const button = div.querySelector('button');
    button.style.backgroundColor = getColor(categoryName, index);
  });

  // Popup Functions
  function showAddPopup() {
    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    const colorPicker = document.getElementById('color-picker');
    title.textContent = 'Add Category';
    input.value = '';
    colorPicker.value = '#1E3A8A';
    popup.style.display = 'flex';
    console.log('Show add popup called');
  }

  function closePopup() {
    const popup = document.getElementById('popup');
    const input = document.getElementById('category-input');
    input.value = '';
    popup.style.display = 'none';
    console.log('Close popup called');
  }

  function confirmAddCategory() {
    const input = document.getElementById('category-input');
    const colorPicker = document.getElementById('color-picker');
    const categoryName = input.value.trim();
    const selectedColor = colorPicker.value;
    if (categoryName) {
      const newButton = document.createElement('div');
      newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
      newButton.draggable = true;
      newButton.innerHTML = `
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${selectedColor}; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: none; position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2px solid #FFFFFF; border-radius: 50%; background-color: #000000;">
            <span class="inner-circle" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></span>
          </span>
        </button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
      `;
      categoryRow.appendChild(newButton);
      setColor(categoryName, selectedColor);
      input.value = '';
      closePopup();
      if (selectMode) {
        newButton.querySelector('.category-specific-button').style.display = 'block';
      }
      console.log('New category added:', categoryName, 'with color:', selectedColor, 'Select mode:', selectMode);
    } else {
      alert('Please enter a category name!');
    }
  }

  function toggleSelect(button) {
    if (!selectMode) {
      console.log('toggleSelect called but not in select mode');
      return;
    }
    const categoryDiv = button.parentElement;
    if (!categoryDiv) {
      console.error('No parent categoryDiv found for button:', button);
      return;
    }
    const categoryNameElement = categoryDiv.querySelector('span:last-child');
    const categoryName = categoryNameElement ? categoryNameElement.textContent : 'Unknown';
    const categorySpecificButton = button.querySelector('.category-specific-button');
    const innerCircle = categorySpecificButton ? categorySpecificButton.querySelector('.inner-circle') : null;
    if (!categorySpecificButton || !innerCircle) {
      console.error('Missing category-specific-button or inner-circle in button:', button);
      return;
    }
    if (selectedCategories.has(categoryDiv)) {
      selectedCategories.delete(categoryDiv);
      innerCircle.style.display = 'none';
      console.log('Unselected:', categoryName, 'Selected categories now:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child')?.textContent || 'Invalid'));
    } else {
      selectedCategories.add(categoryDiv);
      innerCircle.style.display = 'block';
      console.log('Selected:', categoryName, 'Selected categories now:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child')?.textContent || 'Invalid'));
    }
    console.log('toggleSelect completed, categoryDiv:', categoryDiv, 'categoryName:', categoryName, 'selectedCategories size:', selectedCategories.size);
  }

  // Dynamically attach event listeners
  categoryRow.addEventListener('click', (event) => {
    console.log('Category row clicked, target:', event.target);
    const button = event.target.closest('button');
    if (button && button.querySelector('.category-specific-button')) {
      console.log('Valid button found, calling toggleSelect');
      toggleSelect(button);
    } else {
      console.log('No valid button found, target:', event.target);
    }
  });

  selectContainer.addEventListener('click', (event) => {
    console.log('Select container clicked, target:', event.target);
    if (event.target.id === 'select-button') {
      selectMode = true;
      event.target.style.display = 'none';
      selectContainer.innerHTML = `
        <span id="delete-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; cursor: pointer;">Delete</span>
        <span id="cancel-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
      `;
      document.querySelectorAll('.category-specific-button').forEach(button => {
        button.style.display = 'block';
      });
      console.log('Entered select mode, category-specific buttons shown');
    } else if (event.target.id === 'cancel-button') {
      selectMode = false;
      selectedCategories.clear();
      selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
      document.querySelectorAll('.category-specific-button').forEach(button => {
        button.style.display = 'none';
        button.querySelector('.inner-circle').style.display = 'none';
      });
      console.log('Canceled, returned to default screen');
    } else if (event.target.id === 'delete-button') {
      console.log('Delete button clicked, selectedCategories:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child')?.textContent || 'Invalid'), 'size:', selectedCategories.size);
      if (selectedCategories.size > 0) {
        const deletePopup = document.getElementById('delete-popup');
        const deletePopupMessage = document.getElementById('delete-popup-message');
        const categoryNames = Array.from(selectedCategories).map(cat => cat.querySelector('span:last-child').textContent);
        deletePopupMessage.textContent = selectedCategories.size === 1 ? `Delete ${categoryNames[0]}?` : `Delete ${selectedCategories.size} items?`;
        deletePopup.style.display = 'flex';
      } else {
        alert('Please select at least one category to delete.');
        console.log('No categories selected for deletion');
      }
    }
  });

  document.getElementById('delete-popup-cancel').addEventListener('click', () => {
    const deletePopup = document.getElementById('delete-popup');
    deletePopup.style.display = 'none';
    selectMode = false;
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      button.querySelector('.inner-circle').style.display = 'none';
    });
    console.log('Cancel clicked on delete popup, returned to default screen');
  });

  document.getElementById('delete-popup-delete').addEventListener('click', () => {
    selectedCategories.forEach(categoryDiv => {
      categoryDiv.style.transition = 'opacity 0.3s';
      categoryDiv.style.opacity = '0';
      setTimeout(() => {
        const categoryName = categoryDiv.querySelector('span:last-child').textContent;
        removeColor(categoryName);
        categoryDiv.remove();
      }, 300);
    });
    selectedCategories.clear();
    const deletePopup = document.getElementById('delete-popup');
    deletePopup.style.display = 'none';
    selectMode = false;
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      button.querySelector('.inner-circle').style.display = 'none';
    });
    console.log('Categories deleted, returned to default screen');
  });

  // Dynamically attach event listeners to buttons with inline onclick attributes
  const addButton = document.querySelector('button[onclick="showAddPopup();"]');
  const closeButton = document.querySelector('button[onclick="closePopup();"]');
  const confirmButton = document.querySelector('button[onclick="confirmAddCategory();"]');

  if (addButton) addButton.onclick = showAddPopup;
  if (closeButton) closeButton.onclick = closePopup;
  if (confirmButton) confirmButton.onclick = confirmAddCategory;
});