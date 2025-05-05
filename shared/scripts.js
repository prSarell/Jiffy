document.addEventListener('DOMContentLoaded', () => {
  function showAddPopup() {
    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    if (document.querySelectorAll('.category-row > div').length < 4) {
      title.textContent = 'Add Category';
      input.value = ''; // Reset input when opening popup
      popup.style.display = 'flex';
    } else {
      alert('Maximum of 4 categories allowed!');
    }
  }

  function closePopup() {
    const popup = document.getElementById('popup');
    const input = document.getElementById('category-input');
    input.value = ''; // Reset input when closing popup
    popup.style.display = 'none';
  }

  function confirmAddCategory() {
    const input = document.getElementById('category-input');
    const categoryName = input.value.trim();
    if (categoryName && document.querySelectorAll('.category-row > div').length < 4) {
      const categoryRow = document.querySelector('.category-row');
      const newButton = document.createElement('div');
      newButton.style = 'display: flex; flex-direction: column; align-items: center;';
      const buttonIndex = categoryRow.children.length;
      const colors = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];
      const color = colors[buttonIndex % colors.length];
      newButton.innerHTML = `
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${color}; cursor: pointer; border: none;" onclick="alert('Remove category coming soon!');"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
      `;
      categoryRow.appendChild(newButton);
      input.value = '';
      closePopup();
    } else if (!categoryName) {
      alert('Please enter a category name!');
    }
    console.log('confirmAddCategory called with:', categoryName); // Debug log
  }

  // Add event listeners
  document.querySelector('button[onclick="showAddPopup();"]').onclick = showAddPopup;
  document.querySelector('button[onclick="closePopup();"]').onclick = closePopup;
  document.querySelector('button[onclick="confirmAddCategory();"]').onclick = confirmAddCategory;
});