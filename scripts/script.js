class Api {
    constructor(url) {
        this.url = url;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
    };
}

//POBRANIE WSZYSTKICH PRODUKTÓW
    getAll() {
        const url = this.url;
        return fetch(url)
        .then(this.handleResponse)
        .catch(this.error);
    }

// TWORZENIE NOWEGO PRODUKTU
    post(id, data) {
        const url = this.url + '/' + id;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this.headers
        }).then(this.handleResponse)
        .catch(this.error);
    }
    
    postImg(id, formData) {
        const url = this.url + '/' + id;
        return fetch(url, {
            method: 'POST',
            body: formData
        }).then(this.handleResponseAlert)
        .catch(this.error)
    }

//USUWANIE PRODUKTU
    delete(id) {
        const url = this.url + '/' + id;
        return fetch(url, {
            method: 'DELETE'
        }).then(this.handleResponseAlert)
        .catch(this.error)
    }

//ZMIANA WŁASCIWOSCI PRODUKTU
    changeData (id, formData) {
        const url = this.url + '/' + id;
        return fetch(url, {
            method: 'PUT',
            body: formData
        }).then(this.handleResponseAlert)
        .catch(this.error)
    }

//UZUPEŁNIANIE PRODUKTU
    fill (id, data) {
        const url = this.url + '/' + id + '/addcount';
        console.log(url)
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


const api = new Api('http://localhost:3000/shop/products');


class Admin {
    constructor() {
        this.buttonAdd = document.querySelector('#add');
        this.buttonChange = document.querySelector('#change');
        this.buttonDeleteProduct = document.querySelector('#delete');
        this.buttonFillProduct = document.querySelector('#fill');
    };

//DODAWANIE PRODUKTU
    getAddData() {
        const idAdd = document.querySelector('input[name="idAdd"]').value;
        const nameAdd = document.querySelector('input[name="nameAdd"]').value;
        const descriptionAdd = document.querySelector('textarea[name="descriptionAdd"]').value;
        const countAdd = document.querySelector('input[name="countAdd"]').value;
        const priceAdd = document.querySelector('input[name="priceAdd"]').value;
        const imageAdd = document.querySelector('input[name="imageAdd"]').files[0]

        if ((idAdd.length > 0 && !(isNaN(Number(idAdd)))) && nameAdd.length > 0 && descriptionAdd.length > 0 && (countAdd.length > 0 && !(isNaN(Number(countAdd)))) && (priceAdd.length > 0 && !(isNaN(Number(priceAdd)))) && imageAdd) {
            const formData = new FormData();
            formData.append('id', idAdd);
            formData.append('name', nameAdd);
            formData.append('description', descriptionAdd);
            formData.append('price', priceAdd);
            formData.append('count', countAdd);
            formData.append('file', imageAdd);
            api.postImg(idAdd, formData);
            setTimeout(function(){ location.reload() }, 300);
        } else {alert('Nie wszystkie pola zostały poprawnie wypełnione, popraw lub uzupełnij dane')}
    }
        
    addData() {
        this.buttonAdd.addEventListener('click', this.getAddData);
    }

//ZMIANA DANYCH PRODUKTU:
    getChangeData() {
        const idChange = document.querySelector('input[name="idChange"]').value;
        const nameChange = document.querySelector('input[name="nameChange"]').value;
        const descriptionChange = document.querySelector('textarea[name="descriptionChange"]').value;
        const countChange = document.querySelector('input[name="countChange"]').value;
        const priceChange = document.querySelector('input[name="priceChange"]').value;
        const imageChange = document.querySelector('input[name="imageChange"]').files[0]

        if ((idChange.length > 0 && !(isNaN(Number(idChange)))) && nameChange.length > 0 && descriptionChange.length > 0 && (countChange.length > 0 && !(isNaN(Number(countChange)))) && (priceChange.length > 0 && !(isNaN(Number(priceChange)))) && imageChange) {
            const formData = new FormData();
            formData.append('id', idChange);
            formData.append('name', nameChange);
            formData.append('description', descriptionChange);
            formData.append('price', priceChange);
            formData.append('count', countChange);
            formData.append('file', imageChange);
            api.changeData(idChange, formData);
            setTimeout(function(){ location.reload() }, 300);
        } else {alert('Nie wszystkie pola zostały poprawnie wypełnione, popraw lub uzupełnij dane')}
    }

    changeData() {
        this.buttonChange.addEventListener('click', this.getChangeData);
    }

// UZUPEŁNIANIE ILOŚCI PRODUKTU
    getFillCount() {
        const idFill = document.querySelector('input[name="idFillCount"]').value;
        const fillCount = document.querySelector('input[name="fillCount"]').value;
        const dataFill = {"count": fillCount}
        if ((idFill.length > 0 && !(isNaN(Number(idFill)))) && fillCount.length > 0 && !(isNaN(Number(fillCount)))) {
            api.fill(idFill, dataFill);
            setTimeout(function(){location.reload() }, 300);

        } else {alert('wprowadź poprawne dane (liczby)')}
    }

    fillCount(){
        this.buttonFillProduct.addEventListener('click', this.getFillCount);
    }

//USUWANIE PRODUKTU:
    getDeleteId(){
        const idDelete = document.querySelector('input[name="idDelete"]').value; 
        if ((idDelete.length > 0 && !(isNaN(Number(idDelete))))) {
            api.delete(idDelete);
            setTimeout(function(){ location.reload() }, 300);
        } else {alert('wprowadź poprawne id')}
    }

    deleteData() {
        this.buttonDeleteProduct.addEventListener('click', this.getDeleteId);
    }


    addTable(data) {
        const divShowData = document.querySelector('.showData');
        const table = this.table(data);
        divShowData.appendChild(table);
    }

//TABELA POMOCNICZ ISTNIEJĄCYCH PRODUKTÓW:
    table(data){
        const tab = document.createElement('table');
        tab.className = 'table';
        tab.appendChild(this.tHead());
        tab.appendChild(this.tBody(data));
        return tab;
    }

    tHead() {
        const tHead = document.createElement('thead');
        const tHeadRow = this.tHeadRow();
        tHead.appendChild(tHeadRow)
        return tHead;
    }

    tHeadRow() {
        const headRow = document.createElement('tr');
        const nameHead = ['id', 'name', 'description', 'price', 'count', 'image'];
        nameHead.forEach (nameH => {
            const cell = this.tHeadCell();
            cell.innerText = nameH;
            headRow.appendChild(cell);
        })
        return headRow;
    }

    tHeadCell() {
        const cell = document.createElement('th');
        return cell;
    }

    tBody(data){
        const tBody = document.createElement('tbody');
        const arrCount = data.rows;
        

        arrCount.forEach(a => {
            const row = this.tBodyRow(a);
            row.id = a.id;
            tBody.appendChild(row);
        })
        return tBody;
    }

    tBodyRow(dataInd) {
        const row = document.createElement ('tr');
        const img = document.createElement ('img');
        img.setAttribute ('src', `http://localhost:3000/static/${dataInd.doc.image}`);
        img.setAttribute ('alt', 'obrazek');
        img.className = 'imgTable';
        const arr = ['id', 'name', 'description', 'price', 'count', 'image'];
        arr.forEach (name => {
            const cell = this.tBodyCell();
            cell.className = name;
            if (name ===  'id') {
                cell.innerText = dataInd.id;
            } else if (name === 'name') {
                cell.innerText = dataInd.doc.name;
            } else if (name === 'description') {
                cell.innerText = dataInd.doc.description;
            }else if (name === 'price') {
                cell.innerText = `${dataInd.doc.price} pln `;
            } else if (name === 'count') {
                cell.innerText = `${dataInd.doc.count} szt.`;
            } else if (name === 'image') {
                cell.appendChild(img);
            }
            row.appendChild(cell)
        })
        return row;
    }

    tBodyCell() {
        const cell = document.createElement('td');
        return cell;
    }

    allShow() {
    api.getAll()
        .then(resp =>  {;
            const data = resp;
            this.addTable(resp)})
    }
}
const admin = new Admin ();
admin.addData();
admin.changeData();
admin.deleteData();
admin.allShow();
admin.fillCount();
