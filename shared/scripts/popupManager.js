// /jiffy/shared/scripts/popupManager.js
export function initializePopups({ popup, deletePopup, editColorPopup, editOptionsPopup, editNamePopup }) {
  if (popup.style.display !== 'none') popup.style.display = 'none';
  if (deletePopup.style.display !== 'none') deletePopup.style.display = 'none';
  if (editColorPopup.style.display !== 'none') editColorPopup.style.display = 'none';
  if (editOptionsPopup && editOptionsPopup.style.display !== 'none') editOptionsPopup.style.display = 'none';
  if (editNamePopup && editNamePopup.style.display !== 'none') editNamePopup.style.display = 'none';
}
