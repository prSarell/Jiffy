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

  // Updated: Check for any button with a data-action attribute in popups
  const popupButton = event.target.closest('button[data-action]');
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
    } else if (popupButton.closest('#edit-name-popup')) { // Edit name popup buttons
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
    } else if (popupButton.closest('#edit-options-popup')) { // Edit options popup buttons
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