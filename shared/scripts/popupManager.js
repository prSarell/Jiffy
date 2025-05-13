// /jiffy/shared/scripts/popupManager.js
export function initializePopups() {
  console.log('initializePopups: Initializing popup visibility');
  const addForm = document.getElementById('add-form');
  if (!addForm) {
    console.error('initializePopups: add-form element not found');
    return;
  }
  addForm.style.display = 'none';
}