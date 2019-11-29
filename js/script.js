const Api = function (url) {
    this.url = url;
    this.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}

Api.prototype.getAll = function() {
    const url = this.url;
    return fetch(url)
    .then(this.handleResponse)
    .catch(this.error);
}



Api.prototype.getOne = function(id) {
    const url = this.url + "/" + id;
    return fetch(url)
    .then(this.handleResponse)
    .catch (this.error);
}

Api.prototype.post = function (id, data) {
    const url = this.url + '/' + id;
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: this.headers
    }).then(this.handleResponse)
    .catch(this.error);
}

Api.prototype.delete = function(id) {
    const url = this.url + "/" + id;
    return fetch(url, {
        method: 'DELETE'
    }).then(this.handleResponse)
    .catch(this.error)
}

Api.prototype.changeData = function(id, data){
    const url = this.url + "/" + id;
    return fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: this.headers
    }).then(this.handleResponse)
    .catch(this.error)
}

Api.prototype.buy = function(id, data){
    const url = this.url + '/' + id + "/buy";
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:  this.headers
    }).then(this.handleResponse)
    .catch(this.error)
}


//Obsługa błędów:

Api.prototype.handleResponse = function(response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

Api.prototype.error = function (error) {
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


const api = new Api("http://localhost:3000/db/sklep");



//Panel administratora:

const Admin = function () {
    this.buttonAdd = document.querySelector("#add");
    this.buttonChange = document.querySelector("#change");
    this.buttonDeleteProduct = document.querySelector("#delete");

}

Admin.prototype.getAddData = function () {
    const idAdd = document.querySelector('input[name="idAdd"]').value;
    const nameAdd = document.querySelector('input[name="nameAdd"]').value;
    const countAdd = document.querySelector('input[name="countAdd"]').value;
    const priceAdd = document.querySelector('input[name="priceAdd"]').value;
    const dataAdd = {"name": nameAdd, "price": parseInt(priceAdd), "count": parseInt(countAdd)}; 
    api.post(idAdd, dataAdd);

}

Admin.prototype.addData = function () {
    this.buttonAdd.addEventListener('click', this.getAddData);
}

Admin.prototype.getChangeData = function () {
    const idChange = document.querySelector('input[name="idChange"]').value;
    const nameChange = document.querySelector('input[name="nameChange"]').value;
    const countChange = document.querySelector('input[name="countChange"]').value;
    const priceChange = document.querySelector('input[name="priceChange"]').value;
    const dataChange = {"name": nameChange, "price": parseInt(priceChange), "count": parseInt(countChange)}; 
    
    api.changeData(idChange, dataChange);
    
}

Admin.prototype.changeData = function () {
    this.buttonChange.addEventListener('click', this.getChangeData);
}

Admin.prototype.getDeleteId = function () {
    const idDelete = document.querySelector('input[name="idDelete"]').value; 
    api.delete(idDelete);
}

Admin.prototype.deleteData = function () {
    this.buttonDeleteProduct.addEventListener('click', this.getDeleteId);
    
}

Admin.prototype.adTableOffer = function(data) {
    const divShowDataOffer = document.querySelector("#shop");
    console.log(divShowDataOffer);
    const table = this.table(data);
    divShowDataOffer.appendChild(table);
}

Admin.prototype.adTable = function(data) {
    const divShowData = document.querySelector(".showData");
    const table = this.table(data);
    divShowData.appendChild(table);
}

Admin.prototype.table = function(data){
    const tab = document.createElement("table");
    tab.className = 'table';
    tab.appendChild(this.tHead());
    tab.appendChild(this.tBody(data));
    return tab;

}

Admin.prototype.tHead = function () {
    const tHead = document.createElement("thead");
    const tHeadRow = this.tHeadRow();
    tHead.appendChild(tHeadRow)
    return tHead;

}

Admin.prototype.tHeadRow = function () {
    const headRow = document.createElement("tr");
    const nameHead = ['id', 'name', 'price', 'count'];
    nameHead.forEach (nameH => {
        const cell = this.tHeadCell();
        cell.innerText = nameH;
        headRow.appendChild(cell);

    })
    return headRow;
}
Admin.prototype.tHeadCell = function() {
    const cell = document.createElement("th");
    return cell;
    

}

Admin.prototype.tBody = function(data){
    const tBody = document.createElement("tbody");
    const arrCount = data;

    arrCount.forEach(a => {
        const row = this.tBodyRow(a);
        row.id = a._id;
        tBody.appendChild(row);
    })
    return tBody;
}

Admin.prototype.tBodyRow = function (dataInd) {
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

Admin.prototype.tBodyCell = function() {
    const cell = document.createElement("td");
    return cell;
}

Admin.prototype.allShow = function() {
    api.getAll()
    .then(resp => this.adTable(resp))   
}

Admin.prototype.buttonRefresh = function() {
    const refresh = document.querySelector("#refresh");
    refresh.addEventListener('click', this.refresh)
}

Admin.prototype.refresh = function() {
    setTimeout(function(){ location.reload(); }, 50);
}

const admin = new Admin ();
admin.addData();
admin.changeData();
admin.deleteData();
admin.allShow();
admin.buttonRefresh();
