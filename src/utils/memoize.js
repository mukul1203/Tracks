export const memoize = (fn) => {
  // Create a cache to store the results
  const cache = new Map();

  // Return a new function that wraps the original function
  return async function (...args) {
    // Generate a cache key based on the arguments
    const key = JSON.stringify(args);

    // Check if the result is already cached
    if (cache.has(key)) {
      //    console.log("Fetching from cache for:", key);
      return cache.get(key); // Return cached result
    }

    // If not cached, call the original function and cache the result
    const result = await fn(...args);
    cache.set(key, result); // Store the result in cache

    //  console.log("Calculating result for:", key);
    return result; // Return the computed result
  };
};
