
/**
 * Utility functions to help with conversion between camelCase and snake_case
 * for better compatibility with the database schema
 */

/**
 * Converts snake_case strings to camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Converts camelCase strings to snake_case
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Converts an object's keys from snake_case to camelCase
 */
export function convertToCamelCase<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = snakeToCamel(key);
    const value = obj[key];
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = convertToCamelCase(value);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map(item => 
        typeof item === 'object' && item !== null ? convertToCamelCase(item) : item
      );
    } else {
      result[camelKey] = value;
    }
  });
  
  return result as T;
}

/**
 * Converts an object's keys from camelCase to snake_case
 */
export function convertToSnakeCase<T>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = camelToSnake(key);
    const value = obj[key];
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = convertToSnakeCase(value);
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map(item => 
        typeof item === 'object' && item !== null ? convertToSnakeCase(item) : item
      );
    } else {
      result[snakeKey] = value;
    }
  });
  
  return result as T;
}
