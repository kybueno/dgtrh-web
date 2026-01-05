/**
 * Extracts the username part from an email address
 * @param email The full email address
 * @returns The username part before the @ symbol
 */
export const getEmailUsername = (email: string) => email.split("@").at(0);


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
