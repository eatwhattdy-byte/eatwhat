document.querySelector('#feedback-form').addEventListener('submit', event => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.querySelector('#feedback-status');
  const name = document.querySelector('#feedback-name').value.trim() || 'Anonymous';
  const comment = document.querySelector('#feedback-message').value.trim();
  const feedback = JSON.parse(localStorage.getItem('eatwhat-feedback') || '[]');

  feedback.push({name, comment, timestamp: new Date().toISOString()});
  localStorage.setItem('eatwhat-feedback', JSON.stringify(feedback));
  form.reset();
  status.textContent = 'Thanks - your feedback has been saved on this device.';
});
