// /jiffy/shared/scripts/eventHandlers.js
export function setupEventHandlers(appContext) {
  const {
    selectMode,
    selectedCategories,
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
    setEditingCategoryDiv,
    setLongHoldTimer,
    setIsLongHold,
    setLongHoldTarget,
    setSelectMode,
    getColor,
    saveCategories,
    addCategory,
    removeCategory
  } = appContext;

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

  function showEditOptionsPopup(categoryDiv) {
    console.log('showEditOptionsPopup: Opening edit options popup');
    console.log('showEditOptionsPopup: categoryDiv:', categoryDiv);
    setEditingCategoryDiv(categoryDiv);
    console.log('showEditOptionsPopup: editingCategoryDiv set to:', appContext.editingCategoryDiv);
    if (editOptionsPopup) {
      editOptionsPopup.style.display = 'flex';
      console.log('showEditOptionsPopup: edit-options-popup display set to flex');
    } else {
      console.error('showEditOptionsPopup: edit-options-popup element not found');
    }
  }

  function closeEditOptionsPopup() {
    console.log('closeEditOptionsPopup: Closing edit options popup');
    console.log('closeEditOptionsPopup: editingCategoryDiv before clearing:', appContext.editingCategoryDiv);
    setEditingCategoryDiv(null);
    console.log('closeEditOptionsPopup: editingCategoryDiv cleared:', appContext.editingCategoryDiv);
    if (editOptionsPopup) {
      editOptionsPopup.style.display = 'none';
      console.log('closeEditOptionsPopup: edit-options-popup display set to none');
    }
  }

  function showEditColorPopup(categoryDiv) {
    console.log('showEditColorPopup: Opening edit color popup');
    console.log('showEditColorPopup: categoryDiv:', categoryDiv);
    const title = document.getElementById('edit-color-popup-title');
    const input = document.getElementById('color-input');
    console.log('showEditColorPopup: title element:', title);
    console.log('showEditColorPopup: input element:', input);
    if (!title || !input) {
      console.error('showEditColorPopup: Edit color popup elements not found:', { title, input });
      return;
    }
    const span = categoryDiv.querySelector('span:last-child');
    console.log('showEditColorPopup: span element:', span);
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    console.log('showEditColorPopup: categoryName:', categoryName);
    title.textContent = `Edit Color for ${categoryName}`;
    console.log('showEditColorPopup: title set to:', title.textContent);
    const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(categoryDiv);
    console.log('showEditColorPopup: position:', position);
    const currentColor = getColor(categoryName, position);
    console.log('showEditColorPopup: currentColor:', currentColor);
    input.value = currentColor;
    console.log('showEditColorPopup: input value set to:', input.value);
    setEditingCategoryDiv(categoryDiv);
    console.log('showEditColorPopup: editingCategoryDiv set to:', appContext.editingCategoryDiv);
    editColorPopup.style.display = 'flex';
    console.log('showEditColorPopup: edit-color-popup display set to flex');
  }

  function closeEditColorPopup() {
    console.log('closeEditColorPopup: Closing edit color popup');
    const input = document.getElementById('color-input');
    console.log('closeEditColorPopup: input element:', input);
    if (!input) {
      console.error('closeEditColorPopup: Color input not found');
      return;
    }
    input.value = '';
    console.log('closeEditColorPopup: input value cleared');
    setEditingCategoryDiv(null);
    console.log('closeEditColorPopup: editingCategoryDiv cleared:', appContext.editingCategoryDiv);
    editColorPopup.style.display = 'none';
    console.log('closeEditColorPopup: edit-color-popup display set to none');
  }

  function showEditNamePopup(categoryDiv) {
    console.log('showEditNamePopup: Opening edit name popup');
    console.log('showEditNamePopup: categoryDiv:', categoryDiv);
    const title = document.getElementById('edit-name-popup-title');
    const input = document.getElementById('name-input');
    console.log('showEditNamePopup: title element:', title);
    console.log('showEditNamePopup: input element:', input);
    if (!title || !input) {
      console.error('showEditNamePopup: Edit name popup elements not found:', { title, input });
      return;
    }
    const span = categoryDiv.querySelector('span:last-child');
    console.log('showEditNamePopup: span element:', span);
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    console.log('showEditNamePopup: categoryName:', categoryName);
    title.textContent = `Edit Name for ${categoryName}`;
    console.log('showEditNamePopup: title set to:', title.textContent);
    input.value = categoryName;
    console.log('showEditNamePopup: input value set to:', input.value);
    setEditingCategoryDiv(categoryDiv);
    console.log('showEditNamePopup: editingCategoryDiv set to:', appContext.editingCategoryDiv);
    if (editNamePopup) {
      editNamePopup.style.display = 'flex';
      console.log('showEditNamePopup: edit-name-popup display set to flex');
    } else {
      console.error('showEditNamePopup: edit-name-popup element not found');
    }
  }

  function closeEditNamePopup() {
    console.log('closeEditNamePopup: Closing edit name popup');
    const input = document.getElementById('name-input');
    console.log('closeEditNamePopup: input element:', input);
    if (!input) {
      console.error('closeEditNamePopup: Name input not found');
      return;
    }
    input.value = '';
    console.log('closeEditNamePopup: input value cleared');
    setEditingCategoryDiv(null);
    console.log('closeEditNamePopup: editingCategoryDiv cleared:', appContext.editingCategoryDiv);
    if (editNamePopup) {
      editNamePopup.style.display = 'none';
      console.log('closeEditNamePopup: edit-name-popup display set to none');
    }
  }

  // Long hold event handlers for edit options (touch and mouse)
  categoryRow.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const categoryDiv = target.closest('.category-row > div');
    if (categoryDiv) {
      setLongHoldTarget(categoryDiv);
      setIsLongHold(false);
      setLongHoldTimer(setTimeout(() => {
        console.log('touchstart: Long hold duration met on category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
        setIsLongHold(true);
      }, LONG_HOLD_DURATION));
    }
  });

  categoryRow.addEventListener('touchend', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    if (isLongHold && longHoldTarget) {
      console.log('touchend: Long hold released, triggering edit options for category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
      showEditOptionsPopup(longHoldTarget);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  categoryRow.addEventListener('touchmove', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  categoryRow.addEventListener('mousedown', (event) => {
    const target = event.target.closest('.category-row > div');
    if (target) {
      setLongHoldTarget(target);
      setIsLongHold(false);
      setLongHoldTimer(setTimeout(() => {
        console.log('mousedown: Long hold duration met on category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
        setIsLongHold(true);
      }, LONG_HOLD_DURATION));
    }
  });

  categoryRow.addEventListener('mouseup', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    if (isLongHold && longHoldTarget) {
      console.log('mouseup: Long hold released, triggering edit options for category:', longHoldTarget.querySelector('span:last-child').textContent.trim());
      showEditOptionsPopup(longHoldTarget);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  categoryRow.addEventListener('mousemove', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  document.addEventListener('click', (event) => {
    console.log('document click: Handling click event');
    console.log('document click: Event target:', event.target);
    console.log('document click: Event target parentElement:', event.target.parentElement);

    // Check for action buttons (Add, Rewards, etc.)
    const actionButton = event.target.closest('.action-button');
    console.log('document click: Found actionButton:', actionButton);
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      console.log(`document click: Action button clicked with action: ${action}`);
      if (action === 'add') {
        showAddPopup();
      } else if (action === 'show-rewards') {
        console.log('document click: Rewards action not implemented');
      }
      event.stopPropagation();
      return;
    }

    // Check for select container actions (Select, Delete, Cancel)
    const selectContainerElement = document.querySelector('#select-container');
    console.log('document click: selectContainer element:', selectContainerElement);
    console.log('document click: selectContainer children:', selectContainerElement ? Array.from(selectContainerElement.children) : 'Not found');
    const selectAction = event.target.closest('#select-container span');
    console.log('document click: Found selectAction:', selectAction);
    if (selectAction) {
      const action = selectAction.id;
      console.log(`document click: Select container clicked with action: ${action}`);
      console.log(`document click: Current selectMode before action: ${appContext.selectMode}`);
      if (action === 'select-button') {
        setSelectMode(true);
        console.log(`document click: Set selectMode to true, new value: ${appContext.selectMode}`);
        selectAction.style.display = 'none';
        selectContainer.innerHTML = `
          <span id="delete-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Delete</span>
          <span id="cancel-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
        `;
        document.querySelectorAll('.category-specific-button').forEach(button => {
          console.log('select-button: Showing category-specific-button:', button);
          button.style.display = 'block';
          button.style.pointerEvents = 'auto'; // Ensure clicks are registered
        });
      } else if (action === 'cancel-button') {
        setSelectMode(false);
        console.log(`document click: Set selectMode to false, new value: ${appContext.selectMode}`);
        selectedCategories.clear();
        selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
        document.querySelectorAll('.category-specific-button').forEach(button => {
          console.log('cancel-button: Hiding category-specific-button:', button);
          button.style.display = 'none';
          const innerCircle = button.querySelector('.inner-circle');
          if (innerCircle) innerCircle.style.display = 'none';
        });
      } else if (action === 'delete-button') {
        if (selectedCategories.size > 0) {
          const deletePopupMessage = document.getElementById('delete-popup-message');
          if (!deletePopupMessage) {
            console.error('document click: Delete popup message element not found');
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
      event.stopPropagation();
      return;
    }

    // Check for popup buttons (Confirm, Cancel, Edit Name, Edit Color)
    const popupButton = event.target.closest('button[data-action]');
    console.log('document click: Found popupButton:', popupButton);
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log(`document click: Popup button clicked with action: ${action}`);
      console.log(`document click: Popup button parent:`, popupButton.closest('#edit-options-popup'));
      if (popupButton.closest('#popup')) { // Add popup buttons
        if (action === 'confirm') {
          const input = document.getElementById('category-input');
          if (!input) {
            console.error('document click: Category input not found');
            return;
          }
          const categoryName = input.value.trim();
          if (categoryName) {
            appContext.addCategory(categoryName);
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
          if (!input || !appContext.editingCategoryDiv) {
            console.error('document click: Color input or editing category not found:', { input, editingCategoryDiv: appContext.editingCategoryDiv });
            return;
          }
          const newColor = input.value;
          const span = appContext.editingCategoryDiv.querySelector('span:last-child');
          const categoryName = span ? span.textContent.trim() : 'Unknown';
          setColor(categoryName, newColor);
          const button = appContext.editingCategoryDiv.querySelector('button');
          if (button) {
            button.style.backgroundColor = newColor;
          }
          closeEditColorPopup();
        } else if (action === 'cancel') {
          closeEditColorPopup();
        }
      } else if (popupButton.closest('#edit-name-popup')) { // Edit name popup buttons
        if (action === 'confirm') {
          const input = document.getElementById('name-input');
          if (!input || !appContext.editingCategoryDiv) {
            console.error('document click: Name input or editing category not found:', { input, editingCategoryDiv: appContext.editingCategoryDiv });
            return;
          }
          const newName = input.value.trim();
          if (newName) {
            const span = appContext.editingCategoryDiv.querySelector('span:last-child');
            if (!span) {
              console.error('document click: Span not found in editing category div:', appContext.editingCategoryDiv);
              return;
            }
            const oldName = span.textContent.trim();
            span.textContent = newName;
            const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(appContext.editingCategoryDiv);
            const currentColor = getColor(oldName, position);
            setColor(newName, currentColor, oldName);
            appContext.setCategories(saveCategories(categoryRow));
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
          showEditNamePopup(appContext.editingCategoryDiv);
        } else if (action === 'edit-color') {
          closeEditOptionsPopup();
          showEditColorPopup(appContext.editingCategoryDiv);
        }
      }
      event.stopPropagation();
      return;
    }

    console.log('document click: No matching action found for click');
  });

  // Attach click listeners directly to .category-specific-button elements
  function attachSelectionListeners() {
    const buttons = document.querySelectorAll('.category-specific-button');
    console.log('attachSelectionListeners: Found category-specific-buttons:', buttons.length, buttons);
    buttons.forEach(button => {
      console.log('attachSelectionListeners: Attaching listener to button:', button);
      // Remove existing listeners to prevent duplicates
      button.removeEventListener('click', handleCategorySpecificClick);
      button.addEventListener('click', handleCategorySpecificClick);
    });
  }

  function handleCategorySpecificClick(event) {
    event.stopPropagation();
    console.log('categorySpecificButton click: Handling click event');
    console.log('categorySpecificButton click: Event target:', event.target);
    console.log('categorySpecificButton click: Event target classList:', event.target.classList);
    console.log('categorySpecificButton click: Event target parentElement:', event.target.parentElement);
    console.log('categorySpecificButton click: Selection mode:', appContext.selectMode);
    const categorySpecificButton = event.currentTarget;
    if (appContext.selectMode) {
      console.log('categorySpecificButton click: In selection mode');
      const parentButton = categorySpecificButton.closest('button');
      if (!parentButton) {
        console.error('categorySpecificButton click: No parent button found:', categorySpecificButton);
        return;
      }
      const categoryDiv = parentButton.parentElement;
      console.log('categorySpecificButton click: Found categoryDiv:', categoryDiv);
      const span = categoryDiv.querySelector('span:last-child');
      if (!span) {
        console.error('categorySpecificButton click: No span found for category div in select mode:', categoryDiv);
        return;
      }
      const categoryName = span.textContent.trim();
      console.log('categorySpecificButton click: Category name:', categoryName);
      const innerCircle = categorySpecificButton.querySelector('.inner-circle');
      if (!innerCircle) {
        console.error('categorySpecificButton click: Inner circle not found:', categorySpecificButton);
        return;
      }
      console.log('categorySpecificButton click: Selected categories before:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child').textContent.trim()));
      if (selectedCategories.has(categoryDiv)) {
        selectedCategories.delete(categoryDiv);
        innerCircle.style.display = 'none';
        console.log('categorySpecificButton click: Deselected', categoryName);
      } else {
        selectedCategories.add(categoryDiv);
        innerCircle.style.display = 'block';
        console.log('categorySpecificButton click: Selected', categoryName);
      }
      console.log('categorySpecificButton click: Selected categories after:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child').textContent.trim()));
    } else {
      console.log('categorySpecificButton click: Not in selection mode, ignoring click');
    }
  }

  // Initial attachment of listeners
  attachSelectionListeners();

  // Reattach listeners after DOM changes (e.g., adding a new category)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length || mutation.removedNodes.length) {
        console.log('MutationObserver: DOM changed, reattaching selection listeners');
        attachSelectionListeners();
      }
    });
  });
  observer.observe(categoryRow, { childList: true, subtree: true });

  deletePopup.querySelector('#delete-popup-cancel').addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('delete-popup-cancel: Cancel clicked');
    deletePopup.style.display = 'none';
    setSelectMode(false);
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });

  deletePopup.querySelector('#delete-popup-delete').addEventListener('click', (event) => {
    event.stopPropagation();
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
        const position = Array.from(categoryRow.querySelectorAll('div')).indexOf(categoryDiv);
        const categoriesPerLine = 4;
        const lineNumber = Math.floor(position / categoriesPerLine) + 1;
        removeCategory(lineNumber);
        categoryDiv.remove();
        appContext.setCategories(saveCategories(categoryRow));
      }, 300);
    });

    deletePopup.style.display = 'none';
    setSelectMode(false);
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });
}