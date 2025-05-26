// Path: /jiffy/pages/prompts/scripts.js
// Purpose: Initializes the Prompts page, manages prompt display, and handles adding, editing, and removing prompts with weight options via popups and buttons, saving to localStorage.

import { addPrompt, getPrompts, updatePrompt, removePrompt } from './promptManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: Initializing prompts page');
  initializePromptsPage();
});

function initializePromptsPage() {
  console.log('initializePromptsPage: Starting initialization');
  const promptList = document.querySelector('.prompt-list');
  const addPromptButton = document.getElementById('add-prompt-button');
  const addPromptPopup = document.getElementById('add-prompt-popup');
  const editPromptPopup = document.getElementById('edit-prompt-popup');

  if (!promptList || !addPromptButton || !addPromptPopup) {
    console.error('initializePromptsPage: Required DOM elements not found:', { promptList, addPromptButton, addPromptPopup });
    return;
  }
  if (!editPromptPopup) {
    console.warn('initializePromptsPage: Edit prompt popup not found, editing disabled');
  }

  if (addPromptPopup.style.display !== 'none') addPromptPopup.style.display = 'none';
  if (editPromptPopup && editPromptPopup.style.display !== 'none') editPromptPopup.style.display = 'none';

  let editingPromptId = null;

  // Load prompts
  function loadPrompts() {
    console.log('loadPrompts: Loading prompts');
    const prompts = getPrompts();
    promptList.innerHTML = '';
    // Sort: weighted prompts first
    prompts.sort((a, b) => (b.weighted ? 1 : 0) - (a.weighted ? 1 : 0));
    prompts.forEach(prompt => {
      if (!prompt.id || !prompt.text) {
        console.error('loadPrompts: Invalid prompt:', prompt);
        return;
      }
      const promptItem = document.createElement('div');
      promptItem.className = `prompt-item${prompt.weighted ? ' weighted' : ''}`;
      promptItem.dataset.promptId = prompt.id;
      promptItem.innerHTML = `
        <span>${prompt.text}</span>
        <button class="delete-button" data-prompt-id="${prompt.id}">🗑️</button>
      `;
      if (editPromptPopup) {
        promptItem.querySelector('span').addEventListener('click', () => showEditPromptPopup(prompt));
      }
      promptItem.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('deletePrompt: Deleting prompt ID:', prompt.id);
        removePrompt(prompt.id);
        loadPrompts();
      });
      promptList.appendChild(promptItem);
    });
    console.log(`loadPrompts: Loaded ${prompts.length} prompts`);
  }

  // Show add prompt popup
  function showAddPromptPopup() {
    console.log('showAddPromptPopup: Opening add prompt popup');
    const input = document.getElementById('prompt-input');
    const weightInput = document.getElementById('prompt-weight');
    if (!input || !weightInput) {
      console.error('showAddPromptPopup: Prompt inputs not found');
      return;
    }
    input.value = '';
    weightInput.checked = false;
    addPromptPopup.style.display = 'flex';
    input.focus();
  }

  // Close add prompt popup
  function closeAddPromptPopup() {
    console.log('closeAddPromptPopup: Closing add prompt popup');
    const input = document.getElementById('prompt-input');
    if (!input) {
      console.error('closeAddPromptPopup: Prompt input not found');
      return;
    }
    input.value = '';
    addPromptPopup.style.display = 'none';
  }

  // Show edit prompt popup
  function showEditPromptPopup(prompt) {
    if (!editPromptPopup) {
      console.warn('showEditPromptPopup: Edit prompt popup not available');
      return;
    }
    console.log('showEditPromptPopup: Opening edit prompt popup for:', prompt);
    const input = document.getElementById('edit-prompt-input');
    const weightInput = document.getElementById('edit-prompt-weight');
    if (!input || !weightInput) {
      console.error('showEditPromptPopup: Edit prompt inputs not found');
      return;
    }
    input.value = prompt.text;
    weightInput.checked = prompt.weighted || false;
    editingPromptId = prompt.id;
    editPromptPopup.style.display = 'flex';
    input.focus();
  }

  // Close edit prompt popup
  function closeEditPromptPopup() {
    if (!editPromptPopup) {
      console.warn('closeEditPromptPopup: Edit prompt popup not available');
      return;
    }
    console.log('closeEditPromptPopup: Closing edit prompt popup');
    const input = document.getElementById('edit-prompt-input');
    if (!input) {
      console.error('closeEditPromptPopup: Edit prompt input not found');
      return;
    }
    input.value = '';
    editingPromptId = null;
    editPromptPopup.style.display = 'none';
  }

  // Add event listener for add prompt button
  addPromptButton.addEventListener('click', (event) => {
    console.log('addPromptButton: Add prompt button clicked');
    event.stopPropagation();
    event.preventDefault();
    showAddPromptPopup();
  });

  // Add event listener for popup buttons
  document.addEventListener('click', (event) => {
    const popupButton = event.target.closest('.popup-button');
    if (!popupButton) return;
    const action = popupButton.getAttribute('data-action');
    console.log(`click: Popup button clicked with action: ${action}`);

    if (action === 'confirm') {
      if (popupButton.closest('#add-prompt-popup')) {
        const input = document.getElementById('prompt-input');
        const weightInput = document.getElementById('prompt-weight');
        if (!input || !weightInput) {
          console.error('click: Prompt inputs not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText) {
          const prompt = {
            id: Date.now(),
            text: promptText,
            done: false,
            weighted: weightInput.checked
          };
          addPrompt(prompt);
          loadPrompts();
          closeAddPromptPopup();
        } else {
          alert('Please enter a prompt!');
        }
      } else if (popupButton.closest('#edit-prompt-popup') && editPromptPopup) {
        const input = document.getElementById('edit-prompt-input');
        const weightInput = document.getElementById('edit-prompt-weight');
        if (!input || !weightInput) {
          console.error('click: Edit prompt inputs not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText && editingPromptId !== null) {
          updatePrompt(editingPromptId, promptText, weightInput.checked);
          loadPrompts();
          closeEditPromptPopup();
        } else {
          alert('Please enter a prompt!');
        }
      }
    } else if (action === 'cancel') {
      if (popupButton.closest('#add-prompt-popup')) {
        closeAddPromptPopup();
      } else if (popupButton.closest('#edit-prompt-popup') && editPromptPopup) {
        closeEditPromptPopup();
      }
    }
  });

  // Initial load
  loadPrompts();
}