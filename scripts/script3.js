
class ApiAuth {
    constructor(url) {
        this.url = url;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

// SPRAWDZANIE UŻYTKOWNIKA
    checkUser(data) {
        const url = this.url;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this.headers
        }).then(this.handleResponse)
            .catch(this.error);
    }

// TWORZENIE NOWEGO UŻYTKOWNIKA
    newUser(data) {
        const url = `${this.url}/create`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this.headers
        }).then(this.handleResponse)
            .catch(this.error);
    }



//ZMIANA HASŁA
    changePassword(id, data) {
        const url = `${this.url}/${id}id`;
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers:  this.headers
        }).then(this.handleResponseAlert)
            .catch(this.error)
    }



    handleResponseAlert(response) {
        if (response.ok) {
            alert('Wszystko przebiegło pomyslnie')
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }

    handleResponse(response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }
//Obsługa błędów:
    error(error) {
        if (error.status == 404) {
            alert('zasób nie został znalziony')
        } else if (error.status == 408) {
            alert('został przekroczony czas przetwarzania zapytania')
        } else if (error.status == 400) {
            alert('zapytanie nie może być przetworzone np. na skutek nieprawidłowych lub brakujących danych')
        } else if (error.status == 500) {
            alert('wewnętrzny błąd aplikacji na serwerze')
        } else if (error.status == 501) {
            alert('metoda na serwerze nie zostałą zaimplementowana')
        } else if (error.status == 503) {
            alert('usługa niedostępna; serwer nie jest w stanie w tej chwili przetworzyć zapytania')
        } else if (error.status == 409) {
            alert('Produkt z podanym id już istnieje! \n Wprowadź produkt z kolejym id')
        }
        else {alert (error.status)}
    }
}

const apiAuth = new ApiAuth('http://localhost:3000/shop/auth');

class Auth {
    constructor() {
        this.newLogButton = document.querySelector('#newLogButton');
        this.logButton = document.querySelector('#logButton');
    }
    handleSendNewUser = () => {
        const inputNewEmail = document.querySelector('#newInputEmail').value;
        const inputNewLogin = document.querySelector('#newInputLogin').value;
        const inputNewPassword = document.querySelector('#newInputPassword').value;
        const data = {"email": inputNewEmail, "login": inputNewLogin, "password": inputNewPassword};
        console.log(data)
        apiAuth.newUser(data);
    }
    sendNewUser () {
    this.newLogButton.addEventListener('click', this.handleSendNewUser);
    }
    handleCheckUser = () => {
        
        const inputLogin = document.querySelector('#logInputLogin').value;
        const inputPassword = document.querySelector('#logInputPassword').value;
        const data = {"login": inputLogin, "password": inputPassword}
        console.log(data)
        apiAuth.checkUser(data).then(resp => {
            console.log(resp)
            this.welcome(resp)
            });
    }
    welcome (resp) {
        const login = resp.login;
        const divWelcome = document.querySelector('.welcome');
        const welcome = document.createElement('h1');
        welcome.innerText = `Witaj ${login} jesteś zalogowany`;
        divWelcome.appendChild(welcome)
    }
    sendCheckUser () {
    this.logButton.addEventListener('click', this.handleCheckUser);
    }
}

const auth = new Auth ();
auth.sendNewUser();
auth.sendCheckUser();
