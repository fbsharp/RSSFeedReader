'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-form');
  const urlInput = document.getElementById('url-input');
  const errorMessage = document.getElementById('error-message');
  const subscriptionList = document.getElementById('subscription-list');
  const emptyMessage = document.getElementById('empty-message');

  function renderSubscriptions(subscriptions) {
    subscriptionList.innerHTML = '';
    if (subscriptions.length === 0) {
      emptyMessage.hidden = false;
    } else {
      emptyMessage.hidden = true;
      subscriptions.forEach(({ url }) => {
        const li = document.createElement('li');
        li.textContent = url;
        subscriptionList.appendChild(li);
      });
    }
  }

  function loadSubscriptions() {
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => renderSubscriptions(data))
      .catch(() => {
        emptyMessage.hidden = false;
        emptyMessage.textContent = 'Failed to load subscriptions.';
      });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = urlInput.value.trim();
    errorMessage.hidden = true;
    errorMessage.textContent = '';

    fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            errorMessage.textContent = data.error || 'An error occurred.';
            errorMessage.hidden = false;
          });
        }
        urlInput.value = '';
        return loadSubscriptions();
      })
      .catch(() => {
        errorMessage.textContent = 'Failed to add subscription.';
        errorMessage.hidden = false;
      });
  });

  loadSubscriptions();
});
