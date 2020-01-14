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


//POBRANIE JEDNEGO PRODUKTU
getOne() {
    const url = this.url + "/" + id;
    return fetch(url)
    .then(this.handleResponse)
    .catch (this.error);
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
//USUWANIE PRODUKTU
delete(id) {
    const url = this.url + "/" + id;
    return fetch(url, {
        method: 'DELETE'
    }).then(this.handleResponse)
    .catch(this.error)
}
//ZMIANA WŁASCIWOSCI PRODUKTU
changeData (id, data) {
    const url = this.url + "/" + id;
    return fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: this.headers
    }).then(this.handleResponse)
    .catch(this.error)
}
//KUPNO PRODUKTU
buy (id, data) {
    const url = this.url + '/' + id + "/buy";
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:  this.headers
    }).then(this.handleResponse)
    .catch(this.error)
}


//Obsługa błędów:

handleResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

error(error) {
    if (error.status == 404) {
    alert("zasób nie został znalziony")
} else if (error.status == 408) {
    alert("został przekroczony czas przetwarzania zapytania")
} else if (error.status == 400) {
    alert("zapytanie nie może być przetworzone np. na skutek nieprawidłowych lub brakujących danych")
} else if (error.status == 500) {
    alert("wewnętrzny błąd aplikacji na serwerze")
} else if (error.status == 501) {
    alert("metoda na serwerze nie zostałą zaimplementowana")
} else if (error.status == 503) {
    alert("usługa niedostępna; serwer nie jest w stanie w tej chwili przetworzyć zapytania")
} else if (error.status == 409) {
    alert("Produkt z podanym id już istnieje! \n Wprowadź produkt z kolejym id")
} 
else {alert ("wystapił nieznay błąd")}
}
}


const api = new Api("http://localhost:3000/db/sklep");


class Admin {
    constructor() {
    this.buttonAdd = document.querySelector("#add");
    this.buttonChange = document.querySelector("#change");
    this.buttonDeleteProduct = document.querySelector("#delete");
    };

//DODAWANIE PRODUKTU
getAddData() {
    const idAdd = document.querySelector('input[name="idAdd"]').value;
    const nameAdd = document.querySelector('input[name="nameAdd"]').value;
    const countAdd = document.querySelector('input[name="countAdd"]').value;
    const priceAdd = document.querySelector('input[name="priceAdd"]').value;
    const productData = {"name": nameAdd, "price": parseInt(priceAdd), "count": parseInt(countAdd)};
    
    if ((idAdd.length > 0 && !(isNaN(Number(idAdd)))) && nameAdd.length>0 && (countAdd.length > 0 && !(isNaN(Number(countAdd)))) && (priceAdd.length > 0 && !(isNaN(Number(priceAdd))))) {
    api.post(idAdd, productData);
    alert("produkt został poprawnie dodany")
    setTimeout(function(){ location.reload(); }, 300);
    } else (alert("Nie wszystkie pola zostały poprawnie wypełnione, popraw lub uzupełnij dane"))
     
}
    
addData() {
    this.buttonAdd.addEventListener('click', this.getAddData);
}

//ZMIANA DANYCH PRODUKTU:
getChangeData() {
    const idChange = document.querySelector('input[name="idChange"]').value;
    const nameChange = document.querySelector('input[name="nameChange"]').value;
    const countChange = document.querySelector('input[name="countChange"]').value;
    const priceChange = document.querySelector('input[name="priceChange"]').value;
    const dataChange = {"name": nameChange, "price": parseInt(priceChange), "count": parseInt(countChange)}; 
    if ((idChange.length > 0 && !(isNaN(Number(idChange)))) && nameChange.length>0 && (countChange.length > 0 && !(isNaN(Number(countChange)))) && (priceChange.length > 0 && !(isNaN(Number(priceChange))))) {
        api.changeData(idChange, dataChange);
        alert("produkt został poprawnie zmieniony")
        setTimeout(function(){ location.reload(); }, 300);
        } else (alert("Nie wszystkie pola zostały poprawnie wypełnione, popraw lub uzupełnij dane"))
    
    
}

changeData() {
    this.buttonChange.addEventListener('click', this.getChangeData);
}


//USUWANIE PRODUKTU:
getDeleteId() {
    const alertDelete = document.querySelector("#allertDelete");
    const confirmButton = document.querySelector("#confirm");
    const cancelButton = document.querySelector("#cancel");
    const idDelete = document.querySelector('input[name="idDelete"]').value; 
    if ((idDelete.length > 0 && !(isNaN(Number(idDelete))))) {
        
       api.delete(idDelete);
        setTimeout(function(){location.reload();
            alert("produkt został usunięty");
          }, 300);
        
    } else {alert("wprowadź poprawne id")}
}
deleteData() {
    this.buttonDeleteProduct.addEventListener('click', this.getDeleteId);
    
}

//TABELA POMOCNICZA ISTNIEJĄCYCH PRODUKTÓW:
adTableOffer(data) {
    const divShowDataOffer = document.querySelector("#shop");
    console.log(divShowDataOffer);
    const table = this.table(data);
    divShowDataOffer.appendChild(table);
}

adTable(data) {
    const divShowData = document.querySelector(".showData");
    const table = this.table(data);
    divShowData.appendChild(table);
}

table(data){
    const tab = document.createElement("table");
    tab.className = 'table';
    tab.appendChild(this.tHead());
    tab.appendChild(this.tBody(data));
    return tab;

}

tHead() {
    const tHead = document.createElement("thead");
    const tHeadRow = this.tHeadRow();
    tHead.appendChild(tHeadRow)
    return tHead;

}

tHeadRow() {
    const headRow = document.createElement("tr");
    const nameHead = ['id', 'name', 'price', 'count'];
    nameHead.forEach (nameH => {
        const cell = this.tHeadCell();
        cell.innerText = nameH;
        headRow.appendChild(cell);

    })
    return headRow;
}
tHeadCell() {
    const cell = document.createElement("th");
    return cell;
    

}

tBody(data){
    const tBody = document.createElement("tbody");
    const arrCount = data;

    arrCount.forEach(a => {
        const row = this.tBodyRow(a);
        row.id = a._id;
        tBody.appendChild(row);
    })
    return tBody;
}

tBodyRow(dataInd) {
    const row = document.createElement ("tr");
    const arr = ['id', 'name', 'price', 'count'];

    arr.forEach (name => {
        const cell = this.tBodyCell();
        cell.className = name;
        if (name ===  "id") {
            cell.innerText = dataInd._id;
        } else if (name === "name") {
            cell.innerText = dataInd.data.name;
        } else if (name === "price") {
            cell.innerText = dataInd.data.price;
        } else if (name === "count") {
            cell.innerText = dataInd.data.count;
        }
        row.appendChild(cell)
    })
    return row;
}

tBodyCell() {
    const cell = document.createElement("td");
    return cell;
}

allShow() {
    api.getAll()
    .then(resp => this.adTable(resp))   
}
// ODŚWIEŻANIE TABELI PO WPROWADZENIU DANYCH:
// buttonRefresh() {
//     const refresh = document.querySelector("#refresh");
//     refresh.addEventListener('click', this.refresh)
// }

// refresh() {
//     setTimeout(function(){ location.reload(); }, 50);
// }
}
const admin = new Admin ();
admin.addData();
admin.changeData();
admin.deleteData();
admin.allShow();
// admin.buttonRefresh();
// const a = '';
// console.log(!(isNaN(Number(a))))
// console.log(a.length)

// if (a.length > 0 && !(isNaN(Number(a))) ) {console.log("dupa")} else {console.log("jajca")}