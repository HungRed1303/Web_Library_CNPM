export const getAllBookIssue = async () => {
  // Simulate API call with your data structure
  /*
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  });
  */
  // Uncomment and modify this section when you want to use real API
  
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("token not found");
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/borrow/get-book-issue', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch book requests");
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Error getAllBookIssue", error);
    throw error;
  }
  
};

export const handleReturnBook = async (issue_id) => {
  // Mock return book API call
  /*
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
  
  */
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("token not found");
  }
   
  try {
    const response = await fetch(`http://localhost:3000/api/borrow/return-book/${issue_id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
         
    if (!response.ok) {
      throw new Error("Failed to return book");
    }
         
    const result = await response.json();
    console.log("Book returned successfully:", result);
    return result.data;
  } catch (error) {
    console.log("Error handleReturnBook", error);
    throw error;
  }
  
};
