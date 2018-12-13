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

export const isAdmin = user => user.Role.name === 'admin';
export const isUser = user => user.Role.name === 'user';
export const isGuest = user => user.Role.name === 'guest';
