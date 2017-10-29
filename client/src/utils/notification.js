export function notify(title) {
  if (Notification.permission === 'granted') {
    // New is required
    // eslint-disable-next-line no-new
    new Notification('En ny sak ble akkurat åpnet', {
      body: `«${title}»`,
    });
  }
}

export function notifyPermission() {
  if (Notification.permission === 'default') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        // eslint-disable-next-line no-new
        new Notification('Varsling er skrudd på', {
          body: 'Du vil nå få varsler om nye saker så lenge vinduet er åpent.',
        });
      }
    });
  }
}
