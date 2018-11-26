export const emptyObject = new Proxy({}, {
  get() {
    return '';
  },
});
