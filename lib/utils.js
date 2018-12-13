export const emptyObject = new Proxy({}, {
  get() {
    return '';
  },
});

export const guestUser = {
  firstName: 'Guest',
  lastName: '',
  email: 'felix0808@yandex.ru',
  Role: {
    name: 'guest',
  },
};

export const isAdmin = currentUser => currentUser.Role.name === 'admin';
export const isUser = currentUser => currentUser.Role.name === 'user';
export const isGuest = currentUser => currentUser.Role.name === 'guest';
export const isOwner = currentUser => user => currentUser.id === user.id || isAdmin(currentUser);
