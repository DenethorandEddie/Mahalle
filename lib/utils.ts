export const slugify = (text: string) => {
  const trMap: { [key: string]: string } = {
    'çÇ': 'c',
    'ğĞ': 'g',
    'şŞ': 's',
    'üÜ': 'u',
    'ıİ': 'i',
    'öÖ': 'o'
  };

  for (let key in trMap) {
    text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}; 