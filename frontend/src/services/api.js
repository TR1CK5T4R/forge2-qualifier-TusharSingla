// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api'; // Assuming Laravel API is running on port 8000

export const fetchBoards = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/boards`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
};

export const fetchBoardDetails = async (boardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(\`Error fetching board details for ${boardId}:\`, error);
    throw error;
  }
};

// Add more functions for lists, cards, tags, members as needed
