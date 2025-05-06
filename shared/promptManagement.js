// shared/scripts/promptManagement.js
export function addPrompt(prompt) {
  const prompts = getPrompts();
  prompts.push(prompt);
  localStorage.setItem('prompts', JSON.stringify(prompts));
}

export function getPrompts() {
  const storedPrompts = localStorage.getItem('prompts');
  return storedPrompts ? JSON.parse(storedPrompts) : [];
}

export function markPromptDone(promptId) {
  const prompts = getPrompts();
  const updatedPrompts = prompts.filter(prompt => prompt.id !== promptId);
  localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
}

export function cyclePrompts(callback) {
  const prompts = getPrompts().filter(prompt => !prompt.done);
  let currentIndex = 0;
  setInterval(() => {
    if (prompts.length === 0) return;
    callback(prompts[currentIndex]);
    currentIndex = (currentIndex + 1) % prompts.length;
  }, 5000); // Cycle every 5 seconds
}
