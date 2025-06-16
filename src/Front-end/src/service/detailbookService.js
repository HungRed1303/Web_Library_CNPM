const getBookById = async (id) =>{
    const token = localStorage.getItem('token');
    if(!token){
        throw new Error("No token found");
    }
 
    try {
 const response = await fetch(`http://localhost:3000/api/books/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`
        }
    })

    if( !response.ok){
        throw new Error('Failed to fetch book requests')
    }


     const result = await response.json();
     return result.data 
    } catch (error){
     console.log("Error getBookById",error);
     throw error;
    }
   
}