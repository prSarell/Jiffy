// shared/scripts/main.js
import { getColor, setColor, removeColor } from './colorManagement.js';
import { initializeDragAndDrop } from './dragAndDrop.js';

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  console.log('Initial popup display state:', popup?.style.display, 'Delete popup:', deletePopup?.style.display);
  if (popup && popup.style.display !== 'none') {
    popup.style.display = 'none';
    console.log('Popup was not hidden, forced to display: none');
  }
  if (deletePopup && deletePopup.style.display !== 'none') {
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

  // Event delegation for all actions
  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      console.log('Action button clicked:', action);
      switch (action) {
        case 'add':
          showAddPopup();
          break;
        case 'show-rewards':
          console.log('Rewards action not implemented yet');
          break;
      }
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log('Popup button clicked:', action);
      switch (action) {
        case 'confirm':
          confirmAddCategory();
          break;
        case 'cancel':
          closePopup();
          break;
      }
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      console.log('Select container action:', action);
      switch (action) {
        case 'select-button':
          selectMode = true;
          selectAction.style.display = 'none';
          selectContainer.innerHTML = `
            <span id="delete-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; cursor: pointer;">Delete</span>
            <span id="cancel-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
          `;
          document.querySelectorAll('.category-specific-button').forEach(button => {
            button.style.display = 'block';
          });
          console.log('Entered select mode');
          break;
        case 'cancel-button':
          selectMode = false;
          selectedCategories.clear();
          selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
          document.querySelectorAll('.category-specific-button').forEach(button => {
            button.style.display = 'none';
            button.querySelector('.inner-circle').style.display = 'none';
          });
          console.log('Exited select mode');
          break;
        case 'delete-button':
          if (selectedCategories.size > 0) {
            const deletePopupMessage = document.getElementById('delete-popup-message');
            const categoryNames = Array.from(selectedCategories).map(cat => cat.querySelector('span:last-child').textContent);
            deletePopupMessage.textContent = selectedCategories.size === 1 ? `Delete ${categoryNames[0]}?` : `Delete ${selectedCategories.size} items?`;
            deletePopup.style.display = 'flex';
            console.log('Delete popup shown');
          } else {
            alert('Please select at least one category to delete.');
            console.log('No categories selected');
          }
          break;
      }
    }
  });

  // Handle category selection
  categoryRow.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button && button.querySelector('.category-specific-button') && selectMode) {
      const categoryDiv = button.parentElement;
      const categoryName = categoryDiv.querySelector('span:last-child').textContent;
      const innerCircle = button.querySelector('.inner-circle');
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

  // Delete popup handlers
  document.getElementById('delete-popup-cancel').addEventListener('click', () => {
    deletePopup.style.display = 'none';
    selectMode = false;
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      button.querySelector('.inner-circle').style.display = 'none';
    });
    console.log('Delete canceled');
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
    deletePopup.style.display = 'none';
    selectMode = false;
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      button.querySelector('.inner-circle').style.display = 'none';
    });
    console.log('Categories deleted');
  });

  // Popup functions
  function showAddPopup() {
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    const colorPicker = document.getElementById('color-picker');
    title.textContent = 'Add Category';
    input.value = '';
    colorPicker.value = '#1E3A8A';
    popup.style.display = 'flex';
    console.log('Show add popup');
  }

  function closePopup() {
    const input = document.getElementById('category-input');
    input.value = '';
    popup.style.display = 'none';
    console.log('Close popup');
  }

  function confirmAddCategory() {
    const input = document.getElementById('category-input');
    const colorPicker = document.getElementById('color-picker');
    const categoryName = input.value.trim();
    if (categoryName) {
      const newButton = document.createElement('div');
      newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
      newButton.draggable = true;
      newButton.innerHTML = `
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${colorPicker.value}; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: ${selectMode ? 'block' : 'none'}; position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2px solid #FFFFFF; border-radius: 50%; background-color: #000000;">
            <span class="inner-circle" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></span>
          </span>
        </button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
      `;
      categoryRow.appendChild(newButton);
      setColor(categoryName, colorPicker.value);
      input.value = '';
      closePopup();
      console.log('Added category:', categoryName);
    } else {
      alert('Please enter a category name!');
    }
  }
});