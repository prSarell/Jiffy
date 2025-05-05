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
      const newButton = document.createElement('div');
      newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
      const buttonIndex = categoryRow.children.length;
      const colors = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];
      const color = colors[buttonIndex % colors.length];
      newButton.innerHTML = `
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${color}; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: none; position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2px solid #FFFFFF; border-radius: 50%; background-color: #000000;">
            <span class="inner-circle" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></span>
          </span>
        </button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
      `;
      categoryRow.appendChild(newButton);
      input.value = '';
      closePopup();
      // Show category-specific button for the new category if select mode is active
      if (selectMode) {
        newButton.querySelector('.category-specific-button').style.display = 'block';
      }
    } else {
      alert('Please enter a category name!');
    }
    console.log('confirmAddCategory called with:', categoryName);
  }

  function toggleSelect(button) {
    if (!selectMode) return; // Only allow selection if in select mode
    const categoryDiv = button.parentElement;
    const categoryName = categoryDiv.querySelector('span:last-child').textContent;
    const categorySpecificButton = button.querySelector('.category-specific-button');
    const innerCircle = categorySpecificButton.querySelector('.inner-circle');
    if (selectedCategories.has(categoryDiv)) {
      selectedCategories.delete(categoryDiv);
      innerCircle.style.display = 'none';
      console.log('Unselected:', categoryName, 'Selected categories now:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child').textContent));
    } else {
      selectedCategories.add(categoryDiv);
      innerCircle.style.display = 'block';
      console.log('Selected:', categoryName, 'Selected categories now:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child').textContent));
    }
  }

  // Use event delegation to handle clicks on category buttons
  categoryRow.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button && button.querySelector('.category-specific-button')) {
      toggleSelect(button);
    }
  });

  // Add click event listener for Select, Cancel, and Delete
  selectContainer.addEventListener('click', (event) => {
    if (event.target.id === 'select-button') {
      selectMode = true;
      event.target.style.display = 'none';
      selectContainer.innerHTML = `
        <span id="delete-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; cursor: pointer;">Delete</span>
        <span id="cancel-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-left: 5px; cursor: pointer;">Cancel</span>
      `;
      // Show category-specific buttons on all category buttons immediately when Select is clicked
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
      if (selectedCategories.size > 0) {
        const deletePopup = document.getElementById('delete-popup');
        const deletePopupMessage = document.getElementById('delete-popup-message');
        console.log('Selected categories before delete:', Array.from(selectedCategories).map(div => div.querySelector('span:last-child').textContent));
        if (selectedCategories.size === 1) {
          // If only one category is selected, show its name
          const categoryDiv = selectedCategories.values().next().value;
          const categoryName = categoryDiv.querySelector('span:last-child').textContent;
          deletePopupMessage.textContent = `Delete ${categoryName}?`;
          console.log('Setting delete message to:', `Delete ${categoryName}?`);
        } else {
          // If multiple categories are selected, use a generic message
          deletePopupMessage.textContent = 'Delete Categories?';
          console.log('Setting delete message to: Delete Categories?');
        }
        deletePopup.style.display = 'flex';
      } else {
        alert('Please select at least one category to delete.');
      }
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
    selectContainer.innerHTML = '<span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>';
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.style.display = 'none';
      button.querySelector('.inner-circle').style.display = 'none';
    });
    console.log('Categories deleted, returned to default screen');
  });

  // Add event listeners for static buttons
  document.querySelector('button[onclick="showAddPopup();"]').onclick = showAddPopup;
  document.querySelector('button[onclick="closePopup();"]').onclick = closePopup;
  document.querySelector('button[onclick="confirmAddCategory();"]').onclick = confirmAddCategory;
});