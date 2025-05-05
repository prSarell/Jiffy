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
  const selectButton = document.getElementById('select-button');
  const actionButtons = document.getElementById('action-buttons');
  const selectedCategories = new Set();

  function showAddPopup() {
    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    title.textContent = 'Add Category';
    input.value = '';
    popup.style.display = 'flex';
  }

  function closePopup() {
    const popup = document.getElementById('popup');
    const input = document.getElementById('category-input');
    input.value = '';
    popup.style.display = 'none';
  }

  function confirmAddCategory() {
    const input = document.getElementById('category-input');
    const categoryName = input.value.trim();
    if (categoryName) {
      const categoryRow = document.querySelector('.category-row');
      const newButton = document.createElement('div');
      newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px;';
      const buttonIndex = categoryRow.children.length;
      const colors = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];
      const color = colors[buttonIndex % colors.length];
      newButton.innerHTML = `
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${color}; cursor: pointer; border: none;" onclick="toggleSelect(this);"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
      `;
      categoryRow.appendChild(newButton);
      input.value = '';
      closePopup();
    } else {
      alert('Please enter a category name!');
    }
    console.log('confirmAddCategory called with:', categoryName);
  }

  function toggleSelect(button) {
    if (!selectMode) {
      selectMode = true;
      selectButton.style.display = 'none';
      actionButtons.innerHTML = `
        <span id="delete-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; cursor: pointer;">Delete</span>
        <span id="cancel-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
      `;
      actionButtons.style.display = 'inline';
    }
    const categoryDiv = button.parentElement.parentElement;
    const categoryName = categoryDiv.querySelector('span').textContent;
    if (selectedCategories.has(categoryDiv)) {
      selectedCategories.delete(categoryDiv);
      button.style.border = 'none';
      console.log('Unselected:', categoryName);
    } else {
      selectedCategories.add(categoryDiv);
      button.style.border = '2px solid #FF0000';
      console.log('Selected:', categoryName);
    }
  }

  document.getElementById('cancel-button')?.addEventListener('click', () => {
    selectMode = false;
    selectedCategories.clear();
    selectButton.style.display = 'inline';
    actionButtons.style.display = 'none';
    actionButtons.innerHTML = '';
    document.querySelectorAll('.category-row button').forEach(btn => btn.style.border = 'none');
    console.log('Canceled, returned to default screen');
  });

  document.getElementById('delete-button')?.addEventListener('click', () => {
    if (selectedCategories.size > 0) {
      const firstCategory = selectedCategories.values().next().value.querySelector('span').textContent;
      const deletePopup = document.getElementById('delete-popup');
      const deletePopupMessage = document.getElementById('delete-popup-message');
      deletePopupMessage.textContent = `Delete ${firstCategory}?`;
      deletePopup.style.display = 'flex';
    }
  });

  document.getElementById('delete-popup-cancel').addEventListener('click', () => {
    const deletePopup = document.getElementById('delete-popup');
    deletePopup.style.display = 'none';
  });

  document.getElementById('delete-popup-delete').addEventListener('click', () => {
    selectedCategories.forEach(categoryDiv => categoryDiv.remove());
    selectedCategories.clear();
    const deletePopup = document.getElementById('delete-popup');
    deletePopup.style.display = 'none';
    selectMode = false;
    selectButton.style.display = 'inline';
    actionButtons.style.display = 'none';
    actionButtons.innerHTML = '';
    document.querySelectorAll('.category-row button').forEach(btn => btn.style.border = 'none');
    console.log('Categories deleted, returned to default screen');
  });

  // Ensure existing category buttons use toggleSelect
  document.querySelectorAll('.category-row button').forEach(btn => {
    btn.onclick = function() { toggleSelect(this); };
  });

  // Add event listeners
  document.querySelector('button[onclick="showAddPopup();"]').onclick = showAddPopup;
  document.querySelector('button[onclick="closePopup();"]').onclick = closePopup;
  document.querySelector('button[onclick="confirmAddCategory();"]').onclick = confirmAddCategory;
});