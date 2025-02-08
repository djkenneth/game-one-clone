/**
 * Collection of utility helper functions
 */

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns The slugified text
 */
export const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
  }
  
  /**
   * Formats a price number to currency string
   * @param price The price to format
   * @param currency The currency code (default: USD)
   * @returns Formatted price string
   */
  export const formatPrice = (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }
  
  /**
   * Validates email format
   * @param email Email string to validate
   * @returns Boolean indicating if email is valid
   */
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * Formats a date to a readable string
   * @param date Date to format
   * @returns Formatted date string
   */
  export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  /**
   * Truncates text to a specified length
   * @param text Text to truncate 
   * @param length Maximum length (default: 100)
   * @returns Truncated text with ellipsis if needed
   */
  export const truncateText = (text: string, length: number = 100): string => {
    if (text.length <= length) return text
    return text.slice(0, length).trim() + '...'
  }
  
  /**
   * Generates a random string
   * @param length Length of the string (default: 10)
   * @returns Random string
   */
  export const generateRandomString = (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from(
      { length }, 
      () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  }
  
  /**
   * Validates a password meets minimum requirements
   * @param password Password to validate
   * @returns Object with isValid boolean and error message if invalid
   */
  export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' }
    }
    
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { 
        isValid: false, 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    }
  
    return { isValid: true }
  }
  
  /**
   * Deep clones an object
   * @param obj Object to clone
   * @returns Cloned object
   */
  export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  }
  
  /**
   * Removes null and undefined values from an object
   * @param obj Object to clean
   * @returns Cleaned object
   */
  export const removeEmptyValues = <T extends object>(obj: T): Partial<T> => {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(obj).filter(([_, value]) => value != null)
    ) as Partial<T>
  }
  
  /**
   * Calculates the total pages for pagination
   * @param totalItems Total number of items
   * @param itemsPerPage Items per page
   * @returns Total number of pages
   */
  export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
    return Math.ceil(totalItems / itemsPerPage)
  }
  
  /**
   * Formats a file size in bytes to a readable string
   * @param bytes Size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  export const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
  }
  
  /**
   * Validates if a string is a valid URL
   * @param url URL string to validate
   * @returns Boolean indicating if URL is valid
   */
  export const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Formats a phone number to a standard format
   * @param phone Phone number to format
   * @returns Formatted phone number
   */
  export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return phone
  }
  
  /**
   * Debounce function
   * @param func Function to debounce
   * @param wait Wait time in milliseconds
   * @returns Debounced function
   */
  export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
  
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }
  
  /**
   * Creates pagination metadata
   * @param total Total number of items
   * @param page Current page
   * @param limit Items per page
   * @returns Pagination metadata
   */
  export const createPaginationMeta = (total: number, page: number, limit: number) => {
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
  
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  }