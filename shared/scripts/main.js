// shared/scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const deletePopup = document.getElementById('delete-popup');
  if (popup.style.display !== 'none') popup.style.display = 'none';
  if (deletePopup.style.display !== 'none') deletePopup.style.display = 'none';

  let selectMode = false;
  const selectContainer = document.getElementById('select-container');
  const categoryRow = document.querySelector('.category-row');
  const selectedCategories = new Set();

  // Color management
  const defaultColors = {
    'Home': '#1E3A8A',
    'Life': '#3B82F6',
    'Work': '#60A5FA',
    'School': '#93C5FD'
  };
  const colorCycle = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];

  // Clear all localStorage colors for debugging
  localStorage.removeItem('categoryColors');
  console.log('Cleared all localStorage colors');

  function getColor(categoryName) {
    // Normalize category name to ensure case matches
    const normalizedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
    console.log(`getColor called for ${categoryName} (normalized: ${normalizedName})`);
    
    // Always use default colors for example categories
    if (defaultColors[normalizedName]) {
      console.log(`Assigned default color for ${normalizedName}: ${defaultColors[normalizedName]}`);
      return defaultColors[normalizedName];
    }
    // For new categories, use a default color
    const color = '#1E3A8A'; // Default fallback color
    console.log(`Assigned fallback color for ${normalizedName}: ${color}`);
    return color;
  }

  function setColor(categoryName, color) {
    const storedColors = JSON.parse(localStorage.getItem('categoryColors') || '{}');
    storedColors[categoryName] = color;
    localStorage.setItem('categoryColors', JSON.stringify(storedColors));
    console.log(`Set color for ${categoryName}: ${color}`);
  }

  function removeColor(categoryName) {
    const storedColors = JSON.parse(localStorage.getItem('categoryColors') || '{}');
    delete storedColors[categoryName];
    localStorage.setItem('categoryColors', JSON.stringify(storedColors));
    console.log(`Removed color for ${categoryName}`);
  }

  // Simplified drag-and-drop (temporary)
  function initializeDragAndDrop(categoryRow) {
    let draggedItem = null;
    categoryRow.addEventListener('dragstart', (event) => {
      const categoryDiv = event.target.closest('div[draggable="true"]');
      if (categoryDiv) {
        draggedItem = categoryDiv;
        setTimeout(() => categoryDiv.style.opacity = '0.5', 0);
      }
    });
    categoryRow.addEventListener('dragend', () => {
      if (draggedItem) draggedItem.style.opacity = '1';
      draggedItem = null;
    });
    categoryRow.addEventListener('dragover', (event) => event.preventDefault());
    categoryRow.addEventListener('drop', (event) => {
      event.preventDefault();
      if (draggedItem) {
        const dropTarget = event.target.closest('div[draggable="true"]');
        if (dropTarget && draggedItem !== dropTarget) {
          const categoryRow = draggedItem.parentElement;
          const draggedIndex = Array.from(categoryRow.children).indexOf(draggedItem);
          const targetIndex = Array.from(categoryRow.children).indexOf(dropTarget);
          if (draggedIndex < targetIndex) {
            categoryRow.insertBefore(draggedItem, dropTarget.nextSibling);
          } else {
            categoryRow.insertBefore(draggedItem, dropTarget);
          }
        }
        draggedItem.style.opacity = '1';
        draggedItem = null;
      }
    });
  }

  initializeDragAndDrop(categoryRow);

  // Apply colors to category buttons
  const categoryDivs = categoryRow.querySelectorAll('div[draggable="true"]');
  console.log(`Found ${categoryDivs.length} category divs`);
  categoryDivs.forEach((div, index) => {
    const span = div.querySelector('span:last-child');
    if (!span) {
      console.error(`No span found for category div at index ${index}`);
      return;
    }
    const categoryName = span.textContent.trim();
    const button = div.querySelector('button');
    if (!button) {
      console.error(`No button found for category ${categoryName}`);
      return;
    }
    const color = getColor(categoryName);
    button.style.backgroundColor = color;
    console.log(`Set backgroundColor for ${categoryName} to ${color}, actual style: ${button.style.backgroundColor}`);

    // Force colors for debugging
    if (categoryName === 'Home') button.style.backgroundColor = '#1E3A8A';
    if (categoryName === 'Life') button.style.backgroundColor = '#3B82F6';
    if (categoryName === 'Work') button.style.backgroundColor = '#60A5FA';
    if (categoryName === 'School') button.style.backgroundColor = '#93C5FD';
    console.log(`Forced color for ${categoryName}: ${button.style.backgroundColor}`);
  });

  function showAddPopup() {
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    title.textContent = 'Add Category';
    input.value = '';
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
    const categoryName = input.value.trim();
    if (categoryName) {
      const defaultColor = '#1E3A8A'; // Default color for new categories
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
      setColor(categoryName, defaultColor);
      input.value = '';
      closePopup();
      console.log('Added category:', categoryName);
    } else {
      alert('Please enter a category name!');
    }
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
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      if (action === 'confirm') {
        confirmAddCategory();
      } else if (action === 'cancel') {
        closePopup();
      }
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      if (action === 'select-button') {
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
      } else if (action === 'cancel-button') {
        selectMode = false;
        selectedCategories.clear();
        selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.style.display = 'none';
          button.querySelector('.inner-circle').style.display = 'none';
        });
        console.log('Exited select mode');
      } else if (action === 'delete-button') {
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
      }
    }
  });

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
});