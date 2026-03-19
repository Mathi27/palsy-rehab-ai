const STORAGE_KEY = 'face_app_history';

// 1. Existing save function
export const saveSession = (metrics) => {
  try {
    const existing = getHistory();
    const newSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...metrics
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newSession]));
  } catch (error) {
    console.error("Failed to save session data:", error);
  }
};

// 2. Existing get function
export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load session data:", error);
    return [];
  }
};

// 3. THE MISSING PIECE: Make sure "export" is here!
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session data:", error);
  }
};