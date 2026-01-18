/**
 * Extracts the username part from an email address
 * @param email The full email address
 * @returns The username part before the @ symbol
 */
export const getEmailUsername = (email: string) => email.split("@").at(0);

/**
 * Formats a date string or Date object into a localized date string
 * @param date The date to format (can be string, Date, or null/undefined)
 * @param locale The locale to use for formatting (default: 'es-ES')
 * @param options Intl.DateTimeFormatOptions for custom formatting (default: { year: 'numeric', month: 'long', day: '2-digit' })
 * @returns Formatted date string or '—' if date is invalid
 */
export const formatDate = (
  date: string | Date | null | undefined,
  locale: string = 'es-ES',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' }
): string => {
  if (!date) return '—';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return typeof date === 'string' ? date : '—';
  }
  
  return dateObj.toLocaleDateString(locale, options);
};


//CASE TRANSFORMATION

//Title Case
/**
 * Converts a string to title case (first letter of each word capitalized)
 * @param str The input string to convert
 * @returns The string in title case
 */
export const titleCase = (str: string): string => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};


/**
 * Gets the initials from a string (first letter of each word)
 * @param str The input string
 * @returns The initials in uppercase
 */
export const getInitials = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};
