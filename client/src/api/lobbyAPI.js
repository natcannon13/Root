const API_URL = "http://localhost:3001";

export async function createLobby(settings){

    const response = await fetch (`${API_URL}/lobby/create`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
    })

    return response.json();

}