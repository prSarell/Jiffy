// shared/scripts/promptManagement.js
export function addPrompt(prompt) {
  try {
    const prompts = getPrompts();
    prompts.push(prompt);
    localStorage.setItem('prompts', JSON.stringify(prompts));
  } catch (error) {
    console.error('Error adding prompt:', error);
  }
}

export function getPrompts() {
  try {
    const storedPrompts = localStorage.getItem('prompts');
    return storedPrompts ? JSON.parse(storedPrompts) : [];
  } catch (error) {
    console.error('Error getting prompts:', error);
    return [];
  }
}

export function markPromptDone(promptId) {
  try {
    const prompts = getPrompts();
    const promptIndex = prompts.findIndex(prompt => prompt.id === promptId);
    if (promptIndex !== -1) {
      prompts[promptIndex].done = true;
      localStorage.setItem('prompts', JSON.stringify(prompts));
    }
  } catch (error) {
    console.error('Error marking prompt as done:', error);
  }
}

export function cyclePrompts(callback) {
  try {
    const prompts = getPrompts().filter(prompt => !prompt.done);
    let currentIndex = 0;
    setInterval(() => {
      if (prompts.length === 0) return;
      callback(prompts[currentIndex]);
      currentIndex = (currentIndex + 1) % prompts.length;
    }, 5000); // Cycle every 5 seconds
  } catch (error) {
    console.error('Error cycling prompts:', error);
  }
}