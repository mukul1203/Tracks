export const assert = (condition: any, message: any) => {
  if (!condition) throw new Error(message || "Assertion failed");
};
