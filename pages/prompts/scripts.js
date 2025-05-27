// Path: /jiffy/pages/prompts/scripts.js
// Purpose: Initializes the Prompts page, manages prompt display, and handles adding, editing, and removing prompts with weight and time options via popups and buttons, saving to localStorage.

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
    console.log('loadPrompts: Prompts retrieved:', prompts);
    promptList.innerHTML = '';
    if (prompts.length === 0) {
      console.log('loadPrompts: No prompts to display');
    }
    prompts.sort((a, b) => (b.weighted ? 1 : 0) - (a.weighted ? 1 : 0));
    prompts.forEach(prompt => {
      if (!prompt.id || !prompt.text) {
        console.error('loadPrompts: Invalid prompt:', prompt);
        return;
      }
      console.log('loadPrompts: Rendering prompt:', prompt);
      const promptItem = document.createElement('div');
      promptItem.className = `prompt-item${prompt.weighted ? ' weighted' : ''}`;
      promptItem.dataset.promptId = prompt.id;
      const timeDisplay = prompt.dueTime ? new Date(prompt.dueTime).toLocaleString() : '';
      promptItem.innerHTML = `
        <button class="delete-button" data-prompt-id="${prompt.id}">🗑️</button>
        <span>${prompt.text}${timeDisplay ? ` (Due: ${timeDisplay})` : ''}</span>
        <input type="checkbox" class="weight-checkbox" data-prompt-id="${prompt.id}" ${prompt.weighted ? 'checked' : ''}>
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
      promptItem.querySelector('.weight-checkbox').addEventListener('change', (event) => {
        console.log('weightCheckbox: Toggling weight for prompt ID:', prompt.id);
        updatePrompt(prompt.id, prompt.text, event.target.checked, prompt.dueTime);
        loadPrompts();
      });
      promptList.appendChild(promptItem);
    });
    console.log(`loadPrompts: Loaded ${prompts.length} prompts, list HTML:`, promptList.innerHTML);
  }

  // Show add prompt popup
  function showAddPromptPopup() {
    console.log('showAddPromptPopup: Opening add prompt popup');
    const input = document.getElementById('prompt-input');
    const timeInput = document.getElementById('prompt-time');
    if (!input || !timeInput) {
      console.error('showAddPromptPopup: Prompt inputs not found');
      return;
    }
    input.value = '';
    timeInput.value = '';
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
    const timeInput = document.getElementById('edit-prompt-time');
    if (!input || !timeInput) {
      console.error('showEditPromptPopup: Edit prompt inputs not found');
      return;
    }
    input.value = prompt.text;
    timeInput.value = prompt.dueTime ? new Date(prompt.dueTime).toISOString().slice(0, 16) : '';
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
        const timeInput = document.getElementById('prompt-time');
        if (!input || !timeInput) {
          console.error('click: Prompt inputs not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText) {
          const prompt = {
            id: Date.now(),
            text: promptText,
            done: false,
            weighted: false, /* Default to false */
            dueTime: timeInput.value ? new Date(timeInput.value).toISOString() : null
          };
          addPrompt(prompt);
          loadPrompts();
          closeAddPromptPopup();
        } else {
          alert('Please enter a prompt!');
        }
      } else if (popupButton.closest('#edit-prompt-popup') && editPromptPopup) {
        const input = document.getElementById('edit-prompt-input');
        const timeInput = document.getElementById('edit-prompt-time');
        if (!input || !timeInput) {
          console.error('click: Edit prompt inputs not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText && editingPromptId !== null) {
          const prompt = getPrompts().find(p => p.id === editingPromptId);
          updatePrompt(editingPromptId, promptText, prompt.weighted, timeInput.value ? new Date(timeInput.value).toISOString() : null);
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