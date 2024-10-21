import {FormEvent} from "react";

export async function getLoggedInUserData() {
    const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/user/', {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + token,
            },
            credentials: 'include',
        });

        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
}

export async function getUserData(username: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/user/${username}`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function register(dni: string, name: string, surname: string, username: string, email: string, phone: string, birthdate: string, password: string) {
    const response = await fetch('http://localhost:8080/user/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({dni, name, surname, username, email, phone, birthdate, password}),
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function login(email: string, password: string) {
    const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
    })

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function logout() {
    const response = await fetch('http://localhost:8080/user/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    })

    if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('helpPublicationList')
        return true;
    } else return false;
}

export async function updateUser(dni: string, name: string, surname: string, email: string, phone: string, birthdate: string) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/user/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({dni, name, surname, email, phone, birthdate}),
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function deleteUser() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/user/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include'
    });

    if (response.ok) {
        localStorage.removeItem('token');
        return true;
    } else return false;
}

export async function updatePassword(dni: string, password: string, newPassword:string){
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/user/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({dni, password, newPassword}),
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function createHelpPublication(title: string, description: string, media: File[] | null, tags: string){
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (media) media.forEach(file => formData.append('media', file));
    formData.append('tags', tags);

    const response = await fetch('http://localhost:8080/helpPublications/', {
        method: 'POST',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: formData,
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function updateHelpPublication(id: number | undefined, title: string, description: string, tags: string[]){
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/helpPublications/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify({id, title, description, tags}),
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function getHelpPublication(id: string){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/helpPublications/${id}`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function deleteHelpPublication(id: number){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/helpPublications/${id}`, {
        method: 'DELETE',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    return response.ok;
}

export async function createComment(text: string, helpPublicationId: number){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/helpPublications/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify({text, helpPublicationId}),
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function updateComment(id: number, text: string, helpPublicationId:number){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/helpPublications/comment`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify({id, text, helpPublicationId}),
    });

    return response.ok;
}

export async function deleteComment(id: number, helpPublicationId: number){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/helpPublications/comment`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify({id, helpPublicationId}),
    });

    return response.ok;
}

export async function getHelpPublicationBySearchFilter(username: string, title: string, tags: string, initialDate: string, finalDate: string){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/helpPublications/search?username=${username}&title=${title}&tags=${tags}&initialDate=${initialDate}&finalDate=${finalDate}`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function confirmAid(username: string, helpPublicationId: string){
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('helpPublicationId', helpPublicationId);

    const response = await fetch('http://localhost:8080/helpPublications/aid', {
        method: 'POST',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: formData,
    });

    if (response.ok) {
        return await response.json();
    }
}

export async function getUserRanking(date: Date){
    const token = localStorage.getItem('token');
    const dateString = date.toISOString();
    const response = await fetch(`http://localhost:8080/user/ranking?dateString=${dateString}`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function rateUser(ratingUserUsername: string, rating: number, message: string){
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/user/rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify({ratingUserUsername, rating, message}),
    });

    if (response.ok) {
        return await response.json();
    }

}

export async function deleteRating(ratingId: number, targetUserUsername: string){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/user/rating/${targetUserUsername}/${ratingId}`, {
        method: 'DELETE',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    return response.ok;
}

export async function getChatList(){
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/user/messages', {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function getChat(otherUsername: string){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/user/messages/${otherUsername}`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export async function sendMessage(receiverUsername: string, message: string){
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/user/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        credentials: 'include',
        body: JSON.stringify({receiverUsername, message}),
    });

    return response.ok;
}