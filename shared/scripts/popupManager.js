// /jiffy/shared/scripts/popupManager.js
export function initializePopups({ popup, deletePopup, editColorPopup, editOptionsPopup, editNamePopup }) {
  console.log('initializePopups: Initializing popup visibility');
  if (!popup) {
    console.error('initializePopups: popup element not found');
  } else {
    popup.style.display = 'none';
  }
  if (!deletePopup) {
    console.error('initializePopups: deletePopup element not found');
  } else {
    deletePopup.style.display = 'none';
  }
  if (!editColorPopup) {
    console.error('initializePopups: editColorPopup element not found');
  } else {
    editColorPopup.style.display = 'none';
  }
  if (!editOptionsPopup) {
    console.error('initializePopups: editOptionsPopup element not found');
  } else {
    editOptionsPopup.style.display = 'none';
  }
  if (!editNamePopup) {
    console.error('initializePopups: editNamePopup element not found');
  } else {
    editNamePopup.style.display = 'none';
  }
}