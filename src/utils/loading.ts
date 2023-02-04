export const withLoading = (
  setLoading: (isLoading: boolean) => void,
  callback: () => void
) => {
  setLoading(true);
  callback();
  setLoading(false);
};
