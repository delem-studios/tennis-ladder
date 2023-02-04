export const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const capitalize = (text: string) =>
  text
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
