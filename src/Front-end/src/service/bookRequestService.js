export const getAllBookRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch('http://localhost:3000/api/borrow/get-book-request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch book requests');
        }
        const result = await response.json();
        return result.data; 
    } catch (error) {
        console.error('Error fetching book requests:', error);
        throw error;
    }
}

export const getBookRequestById = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch(`http://localhost:3000/api/borrow/get-book-request/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch book request by ID');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching book request by ID:', error);
        throw error;
    }
}

export const deleteBookRequest = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch(`http://localhost:3000/api/borrow/delete-book-request/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete book request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting book request:', error);
        throw error;
    }
}

export const borrowBook = async (book_id, student_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch('http://localhost:3000/api/borrow/borrow-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ book_id, student_id }),
        });
        if (!response.ok) {
            throw new Error('Failed to borrow book');
        }
        return await response.json();
    } catch (error) {
        console.error('Error borrowing book:', error);
        throw error;
    }
}

export const issueBook = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch(`http://localhost:3000/api/borrow/issue-book/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to issue book');
        }
        return await response.json();
    } catch (error) {
        console.error('Error issuing book:', error);
        throw error;
    }
}

export const rejectBookRequest = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch(`http://localhost:3000/api/borrow/reject-book-request/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to reject book request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error rejecting book request:', error);
        throw error;
    }
}

export const returnBook = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await fetch(`http://localhost:3000/api/borrow/return-book/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to return book');
        }
        return await response.json();
    } catch (error) {
        console.error('Error returning book:', error);
        throw error;
    }
}




