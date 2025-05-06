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

  // Apply random colors to category buttons
  const categoryDivs = categoryRow.querySelectorAll('div[draggable="true"]');
  console.log(`Found ${categoryDivs.length} category divs`);
  categoryDivs.forEach((div, index) => {
    const span = div.querySelector('span:last-child');
    if (!span) {
      console.error(`No span found for category div at index ${index}`);
      return;
    }
    const categoryName = span.textContent.trim();
    console.log(`Processing category: "${categoryName}" (length: ${categoryName.length}, raw: ${span.textContent})`);

    const button = div.querySelector('button');
    if (!button) {
      console.error(`No button found for category "${categoryName}"`);
      return;
    }

    // Directly apply random colors based on category name
    if (categoryName === 'Home') {
      button.style.backgroundColor = '#FF6347'; // Tomato Red
      console.log(`Matched ${categoryName} to Home, set color: #FF6347`);
    } else if (categoryName === 'Life') {
      button.style.backgroundColor = '#32CD32'; // Lime Green
      console.log(`Matched ${categoryName} to Life, set color: #32CD32`);
    } else if (categoryName === 'Work') {
      button.style.backgroundColor = '#FFD700'; // Gold Yellow
      console.log(`Matched ${categoryName} to Work, set color: #FFD700`);
    } else if (categoryName === 'School') {
      button.style.backgroundColor = '#FF00FF'; // Magenta
      console.log(`Matched ${categoryName} to School, set color: #FF00FF`);
    } else {
      button.style.backgroundColor = '#FF6347'; // Default for new categories
      console.log(`No match for ${categoryName}, used default color: #FF6347`);
    }

    // Fallback: Force colors based on index to ensure variation
    const colors = ['#FF6347', '#32CD32', '#FFD700', '#FF00FF'];
    button.style.backgroundColor = colors[index % colors.length];
    console.log(`Forced color for ${categoryName} at index ${index}: ${button.style.backgroundColor}`);
  });

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

  function confirmAddCategory() {
    const input = document.getElementById('category-input');
    if (!input) {
      console.error('Category input not found');
      return;
    }
    const categoryName = input.value.trim();
    if (categoryName) {
      const defaultColor = '#FF6347'; // Default color for new categories
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
      console.log(`Action button clicked with action: ${action}`);
      if (action === 'add') {
        showAddPopup();
      } else if (action === 'show-rewards') {
        console.log('Rewards action not implemented');
      }
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log(`Popup button clicked with action: ${action}`);
      if (action === 'confirm') {
        confirmAddCategory();
      } else if (action === 'cancel') {
        closePopup();
      }
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      console.log(`Select container clicked with action: ${action}`);
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