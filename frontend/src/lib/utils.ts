import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberToCurrency(price: number) {
  const PHPeso = new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP'
  });

  return PHPeso.format(price);
}

const wordSeparators = /[-_\\.+\s]+/g;
const notAlphaNumericOrSpace = /[^ a-zA-Z0-9]+/g;
const notAlphaNumericSpaceOrDash = /[^ a-zA-Z0-9-]/g;
const capitalizedFirstLetter = /[A-Z]+(?![a-z])|[A-Z]/g;

/**
 * Safely camelCases a string, taking into account acronyms, kebab-case, snake_case, and sentence casing as well as special characters
 * @param string
 * @returns A `string` in camelCase form
 */
export const camelCase = (string: string): string => {
  const cleanedString = string
    .replace(wordSeparators, ' ')
    .replace(notAlphaNumericOrSpace, '')
    .replace(capitalizedFirstLetter, ($, ofs) => (ofs ? ' ' : '') + $.trim().toLowerCase())
    .trim();
  const words = cleanedString.split(' ');
  const camelCasedWords = words.map((word, index) =>
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
  const camelCasedString = camelCasedWords.join('');

  return camelCasedString;
};

/**
 * Safely kebab-cases a string, taking into account acronyms, camelCase, snake_case, and sentence casing, as well as special characters
 * @param string
 * @returns a kebab-cased string
 */
export const kebabCase = (str: string) =>
  str
    .trim()
    .replace(wordSeparators, '-')
    .replace(notAlphaNumericSpaceOrDash, '')
    .replace(capitalizedFirstLetter, ($, ofs) => (ofs ? '-' : '') + $.trim().toLowerCase())
    .replace(/--+/g, '-');

/**
 * This function converts Markdown syntax to HTML using regular expressions.
 * @param {string | null} text - The Markdown text to parse.
 * @returns {string} The HTML content generated from the Markdown text.
 */
export const parseMarkdown = (text: string | null) => {
  if (!text) {
    return '';
  }

  // Convert Markdown syntax to HTML using regular expressions
  text = text.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>'); // Heading 1
  text = text.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>'); // Heading 2
  text = text.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>'); // Heading 3
  text = text.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>'); // Bold
  text = text.replace(/__(.*)__/g, '<strong>$1</strong>'); // Bold (alternative syntax)
  text = text.replace(/\*(.*)\*/g, '<em>$1</em>'); // Italic
  text = text.replace(/`(.*?)`/g, '<code>$1</code>'); // Inline code
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">'); // Image
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'); // Link

  // Convert newlines to <br> tags
  text = text.replace(/\n/g, '<br>');

  return text;
};

/**
 * A helper function to add line break.
 * Can be used for paragraphed texts like user's bio
 * @param text The string to look for new line characters
 * @returns
 */
export const newLineParagraphs = (text: string) => {
  // Split the text into paragraphs
  const paragraphs = text.split('\n\n'); // assuming paragraphs are separated by double newline

  // Join the paragraphs with a new line character
  const newText = paragraphs.join('\n');

  return newText;
};

export const textToMarkdown = (text: string) => {
  // Replace asterisks with Markdown emphasis syntax
  // text = text.replace(/\*(.*?)\*/g, '*$1*');

  // Replace double asterisks with Markdown strong emphasis syntax
  text = text.replace(/__(.*?)__/g, '<b class="font-poppins text-lg font-bold">$1</b>');

  // Replace backticks with Markdown inline code syntax
  // text = text.replace(/`(.*?)`/g, '`$1`');

  // Replace newlines with Markdown line breaks
  text = text.replace(/\n/g, '  <br/>'); // adding two spaces at the end for line break

  text = text.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a class="font-poppins text-lg font-bold text-electric-purple-500 underline" href="$2">$1</a>',
  );

  return text;
};

