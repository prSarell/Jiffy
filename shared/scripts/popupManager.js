// /jiffy/shared/scripts/popupManager.js
export function initializePopups({ popup, deletePopup, editColorPopup, editOptionsPopup, editNamePopup }) {
  console.log('initializePopups: Initializing popup visibility');
  popup.style.display = 'none';
  deletePopup.style.display = 'none';
  editColorPopup.style.display = 'none';
  if (editOptionsPopup) editOptionsPopup.style.display = 'none';
  if (editNamePopup) editNamePopup.style.display = 'none';
}