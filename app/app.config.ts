export default defineAppConfig({
  ui: {
    colors: {
      primary: "indigo",
    },
    card: {
      slots: {
        root: 'rounded-lg overflow-hidden flex flex-col justify-between',
        header: 'p-2 sm:px-3',
        body: 'p-2 sm:p-3 h-full',
        footer: 'p-2 sm:px-3'
      },
    }
  },
});
