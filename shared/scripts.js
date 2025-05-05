function showAddPopup() {
  const popup = document.getElementById('popup');
  const title = document.getElementById('popup-title');
  title.textContent = 'Add Category';
  popup.style.display = 'flex';
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}
