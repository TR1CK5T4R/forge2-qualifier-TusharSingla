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
    console.error(`Error fetching board details for ${boardId}:`, error);
    throw error;
  }
};

export const updateCardList = async (cardId, newListId, newIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        list_id: newListId,
        order: newIndex, // Assuming your API can handle an 'order' or 'index' field for positioning
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating card ${cardId} list to ${newListId}:`, error);
    throw error;
  }
};

// Add more functions for tags, members, due dates as needed

export const createBoard = async (boardData) => {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boardData),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};
