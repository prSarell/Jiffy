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
    setEditingCategoryDiv(categoryDiv);
    if (editOptionsPopup) {
      editOptionsPopup.style.display = 'flex';
    } else {
      console.error('showEditOptionsPopup: edit-options-popup element not found');
    }
  }

  function closeEditOptionsPopup() {
    console.log('closeEditOptionsPopup: Closing edit options popup');
    setEditingCategoryDiv(null);
    if (editOptionsPopup) {
      editOptionsPopup.style.display = 'none';
    }
  }

  function showEditColorPopup(categoryDiv) {
    console.log('showEditColorPopup: Opening edit color popup');
    const title = document.getElementById('edit-color-popup-title');
    const input = document.getElementById('color-input');
    if (!title || !input) {
      console.error('showEditColorPopup: Edit color popup elements not found:', { title, input });
      return;
    }
    const span = categoryDiv.querySelector('.category-label');
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    title.textContent = `Edit Color for ${categoryName}`;
    const position = Array.from(categoryRow.querySelectorAll('.category-item')).indexOf(categoryDiv);
    const currentColor = getColor(categoryName, position);
    input.value = currentColor;
    setEditingCategoryDiv(categoryDiv);
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
    setEditingCategoryDiv(null);
    editColorPopup.style.display = 'none';
  }

  function showEditNamePopup(categoryDiv) {
    console.log('showEditNamePopup: Opening edit name popup');
    const title = document.getElementById('edit-name-popup-title');
    const input = document.getElementById('name-input');
    if (!title || !input) {
      console.error('showEditNamePopup: Edit name popup elements not found:', { title, input });
      return;
    }
    const span = categoryDiv.querySelector('.category-label');
    const categoryName = span ? span.textContent.trim() : 'Unknown';
    title.textContent = `Edit Name for ${categoryName}`;
    input.value = categoryName;
    setEditingCategoryDiv(categoryDiv);
    if (editNamePopup) {
      editNamePopup.style.display = 'flex';
    } else {
      console.error('showEditNamePopup: edit-name-popup element not found');
    }
  }

  function closeEditNamePopup() {
    console.log('closeEditNamePopup: Closing edit name popup');
    const input = document.getElementById('name-input');
    if (!input) {
      console.error('closeEditNamePopup: Name input not found');
      return;
    }
    input.value = '';
    setEditingCategoryDiv(null);
    if (editNamePopup) {
      editNamePopup.style.display = 'none';
    }
  }

  // Long hold event handlers
  categoryRow.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const categoryDiv = target.closest('.category-item');
    if (categoryDiv) {
      setLongHoldTarget(categoryDiv);
      setIsLongHold(false);
      setLongHoldTimer(setTimeout(() => {
        if (appContext.longHoldTarget) {
          console.log('touchstart: Long hold on category:', appContext.longHoldTarget.querySelector('.category-label')?.textContent.trim());
          setIsLongHold(true);
        }
      }, LONG_HOLD_DURATION));
    }
  });

  categoryRow.addEventListener('touchend', (event) => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    if (isLongHold && longHoldTarget) {
      console.log('touchend: Long hold released, showing edit options');
      showEditOptionsPopup(longHoldTarget);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  categoryRow.addEventListener('touchmove', () => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  categoryRow.addEventListener('mousedown', (event) => {
    const target = event.target.closest('.category-item');
    if (target) {
      setLongHoldTarget(target);
      setIsLongHold(false);
      setLongHoldTimer(setTimeout(() => {
        if (appContext.longHoldTarget) {
          console.log('mousedown: Long hold on category:', appContext.longHoldTarget.querySelector('.category-label')?.textContent.trim());
          setIsLongHold(true);
        }
      }, LONG_HOLD_DURATION));
    }
  });

  categoryRow.addEventListener('mouseup', () => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    if (isLongHold && longHoldTarget) {
      console.log('mouseup: Long hold released, showing edit options');
      showEditOptionsPopup(longHoldTarget);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  categoryRow.addEventListener('mousemove', () => {
    if (longHoldTimer) {
      clearTimeout(longHoldTimer);
      setLongHoldTimer(null);
    }
    setIsLongHold(false);
    setLongHoldTarget(null);
  });

  document.addEventListener('click', (event) => {
    console.log('document click: Handling click event');
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      if (action === 'add') {
        showAddPopup();
      }
      event.stopPropagation();
      return;
    }

    const selectAction = event.target.closest('#select-container span');
    if (selectAction) {
      const action = selectAction.id;
      if (action === 'select-button') {
        setSelectMode(true);
        selectContainer.innerHTML = `
          <span id="delete-button">Delete</span>
          <span id="cancel-button">Cancel</span>
        `;
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.classList.add('active');
          button.style.display = 'block';
        });
      } else if (action === 'cancel-button') {
        setSelectMode(false);
        selectedCategories.clear();
        selectContainer.innerHTML = '<span id="select-button">Select</span>';
        document.querySelectorAll('.category-specific-button').forEach(button => {
          button.classList.remove('active');
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
            const span = cat.querySelector('.category-label');
            return span ? span.textContent : 'Unknown';
          });
          deletePopupMessage.textContent = selectedCategories.size === 1 ? `Delete ${categoryNames[0]}?` : `Delete ${categoryNames.length} items?`;
          deletePopup.style.display = 'flex';
          document.querySelectorAll('.category-specific-button').forEach(button => {
            button.style.display = 'none';
            const innerCircle = button.querySelector('.inner-circle');
            if (innerCircle) innerCircle.style.display = 'none';
          });
        } else {
          alert('Please select at least one category to delete.');
        }
      }
      event.stopPropagation();
      return;
    }

    const popupButton = event.target.closest('button[data-action]');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      if (popupButton.closest('#popup')) {
        if (action === 'confirm') {
          const input = document.getElementById('category-input');
          if (!input) {
            console.error('document click: Category input not found');
            return;
          }
          const categoryName = input.value.trim();
          if (categoryName) {
            addCategory(categoryName, appContext);
            closePopup();
          } else {
            alert('Please enter a category name!');
          }
        } else if (action === 'cancel') {
          closePopup();
        }
      } else if (popupButton.closest('#edit-color-popup')) {
        if (action === 'confirm') {
          const input = document.getElementById('color-input');
          if (!input || !appContext.editingCategoryDiv) {
            console.error('document click: Color input or editing category not found');
            return;
          }
          const newColor = input.value;
          const span = appContext.editingCategoryDiv.querySelector('.category-label');
          const categoryName = span ? span.textContent.trim() : 'Unknown';
          setColor(categoryName, newColor);
          const button = appContext.editingCategoryDiv.querySelector('.category-button');
          if (button) {
            button.style.backgroundColor = newColor;
          }
          closeEditColorPopup();
        } else if (action === 'cancel') {
          closeEditColorPopup();
        }
      } else if (popupButton.closest('#edit-name-popup')) {
        if (action === 'confirm') {
          const input = document.getElementById('name-input');
          if (!input || !appContext.editingCategoryDiv) {
            console.error('document click: Name input or editing category not found');
            return;
          }
          const newName = input.value.trim();
          if (newName) {
            const span = appContext.editingCategoryDiv.querySelector('.category-label');
            if (!span) {
              console.error('document click: Span not found in editing category div');
              return;
            }
            const oldName = span.textContent.trim();
            span.textContent = newName;
            const position = Array.from(categoryRow.querySelectorAll('.category-item')).indexOf(appContext.editingCategoryDiv);
            const currentColor = getColor(oldName, position);
            setColor(newName, currentColor, oldName);
            const categories = getCategories();
            const categoryIndex = categories.findIndex(cat => cat.name === oldName);
            if (categoryIndex !== -1) {
              categories[categoryIndex].name = newName;
              saveCategories(categories);
            }
            closeEditNamePopup();
          } else {
            alert('Please enter a category name!');
          }
        } else if (action === 'cancel') {
          closeEditNamePopup();
        }
      } else if (popupButton.closest('#edit-options-popup')) {
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
  });

  categoryRow.addEventListener('click', (event) => {
    const categorySpecificButton = event.target.closest('.category-specific-button');
    if (categorySpecificButton && appContext.selectMode) {
      const categoryDiv = categorySpecificButton.closest('.category-item');
      if (!categoryDiv) {
        console.error('categoryRow click: No parent category div found');
        return;
      }
      const span = categoryDiv.querySelector('.category-label');
      const categoryName = span ? span.textContent.trim() : 'Unknown';
      const innerCircle = categorySpecificButton.querySelector('.inner-circle');
      if (!innerCircle) {
        console.error('categoryRow click: Inner circle not found');
        return;
      }
      if (selectedCategories.has(categoryDiv)) {
        selectedCategories.delete(categoryDiv);
        innerCircle.style.display = 'none';
      } else {
        selectedCategories.add(categoryDiv);
        innerCircle.classList.add('active');
        innerCircle.style.display = 'block';
      }
      console.log('categoryRow click: Selected categories:', Array.from(selectedCategories).map(div => div.querySelector('.category-label')?.textContent.trim()));
    }
  });

  deletePopup.querySelector('#delete-popup-cancel').addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('delete-popup-cancel: Cancel clicked');
    deletePopup.style.display = 'none';
    setSelectMode(false);
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.classList.remove('active');
      button.style.display = 'block';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });

  deletePopup.querySelector('#delete-popup-delete').addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('delete-popup-delete: Delete clicked');
    const categoriesPerLine = 4;
    const categoryDivs = Array.from(categoryRow.querySelectorAll('.category-item'));
    const categoriesToRemove = Array.from(selectedCategories).map(categoryDiv => {
      const position = categoryDivs.indexOf(categoryDiv);
      if (position === -1) {
        console.warn('delete-popup-delete: Category not found in DOM:', categoryDiv);
        return null;
      }
      const lineNumber = Math.floor(position / categoriesPerLine) + 1;
      return { categoryDiv, position, lineNumber };
    }).filter(item => item !== null);

    categoriesToRemove.forEach(({ categoryDiv, lineNumber }) => {
      console.log('delete-popup-delete: Removing category:', categoryDiv.querySelector('.category-label')?.textContent.trim());
      categoryDiv.remove();
      removeCategory(lineNumber);
    });

    const categories = getCategories();
    const updatedCategories = categories.filter(cat => {
      return !categoriesToRemove.some(item => {
        const span = item.categoryDiv.querySelector('.category-label');
        return span && span.textContent.trim() === cat.name;
      });
    });
    saveCategories(updatedCategories);
    appContext.setCategories(updatedCategories);

    deletePopup.style.display = 'none';
    setSelectMode(false);
    selectedCategories.clear();
    selectContainer.innerHTML = '<span id="select-button">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.classList.remove('active');
      button.style.display = 'block';
      const innerCircle = button.querySelector('.inner-circle');
      if (innerCircle) innerCircle.style.display = 'none';
    });
  });
}