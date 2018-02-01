function legacyShowNotification(title, options) {
  // eslint-disable-next-line no-new
  new Notification(title, options);
}

async function showNotification(title, options) {
  let serviceWorkerRunning = false;
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration('sdf');
      serviceWorkerRunning = registration !== undefined;
      if (serviceWorkerRunning) {
        registration.showNotification(title, options);
      }
    } catch (err) {
      serviceWorkerRunning = false;
    }
  }
  if (!serviceWorkerRunning) {
    legacyShowNotification(title, options);
  }
}

export function notify(title) {
  if (Notification.permission === 'granted') {
    showNotification('En sak har akkurat åpnet for votering', {
      body: `«${title}»`,
    });
  }
}

export function notifyPermission() {
  if (Notification.permission === 'default') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        showNotification('Varsling er skrudd på', {
          body: 'Du vil nå få varsler om nye saker så lenge vinduet er åpent.',
        });
      }
    });
  }
}
