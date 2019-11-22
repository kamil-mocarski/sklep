const Api = function (url) {
    this.url = url;

};
Api.prototype.getAll = function() {
    const url = this.url;
    return fetch(url)
    .then(this.handleResponse)
    .catch(this.error);
    
}; 
Api.prototype.getAllShow = function() {
    const url = this.url;
    return fetch(url)
    .then(this.handleResponse)
    .catch(this.error)
    .then(resp =>shop.adTable(resp))
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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(this.handleResponse)
    .catch(this.error)
}

Api.prototype.buy = function(id, data){
    const url = this.url + '/' + id + "/buy";
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers:  {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(this.handleResponse)
    .catch(this.error)

}
Api.prototype.showDataConsole = function(response) {
    console.log(response);
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


Api.prototype.getProductCount = function(id) {
    const url = this.url + '/' + id;
    return fetch(url).then(this.handleResponse).then(response =>console.log(response[0].data.count))
    .catch (this.error);
    
}; 





const api = new Api("http://localhost:3000/db/sklep");

//Panel administratora:

const buttonAdd = document.querySelector("#add");
buttonAdd.addEventListener('click', buttonData);
function buttonData () {
    const idAdd = document.querySelector('input[name="idAdd"]').value;
    const nameAdd = document.querySelector('input[name="nameAdd"]').value;
    const countAdd = document.querySelector('input[name="countAdd"]').value;
    const priceAdd = document.querySelector('input[name="priceAdd"]').value;
    const dataAdd = {"name": nameAdd, "price": parseInt(priceAdd), "count": parseInt(countAdd)}; 
    api.post(idAdd, dataAdd);
    
}
const buttonChange = document.querySelector("#change");
buttonChange.addEventListener('click', buttonDataChange);
function buttonDataChange () {
    const idChange = document.querySelector('input[name="idChange"]').value;
    const nameChange = document.querySelector('input[name="nameChange"]').value;
    const countChange = document.querySelector('input[name="countChange"]').value;
    const priceChange = document.querySelector('input[name="priceChange"]').value;
    const dataChange = {"name": nameChange, "price": parseInt(priceChange), "count": parseInt(countChange)}; 
    
    api.changeData(idChange, dataChange);
    
}
const buttonDeleteProduct = document.querySelector("#delete");
buttonDeleteProduct.addEventListener('click', buttonDelete);
function buttonDelete() {
    const idDelete = document.querySelector('input[name="idDelete"]').value; 
    console.log(idDelete);
    api.delete(idDelete);
    
}

//SKLEP TABELA 
const Show = function() {};

Show.prototype.adTable = function(data) {
    const divShowData = document.querySelector(".showData");
    const table = this.table(data);
    divShowData.appendChild(table);
};
Show.prototype.table = function(data){
    const tab = document.createElement("table");
    tab.appendChild(this.tHead());
    tab.appendChild(this.tBody(data));
    return tab;

};

Show.prototype.tBody = function(data){
    const tBody = document.createElement("tbody");
    const arrCount = data;
    arrCount.forEach(a => {
        //console.log(a._id)
        const row = this.row(a);
        //console.log(row);
        row.id = a._id;
        tBody.appendChild(row);

    })
    return tBody;
};
Show.prototype.tHead = function () {
    const tHead = document.createElement("thead");
    const tHeadRow = this.tHeadRow();
    tHead.appendChild(tHeadRow)
    return tHead;

}
Show.prototype.tHeadRow = function () {

    const headRow = document.createElement("tr");
    const nameHead = ['id', 'name', 'price', 'count'];
    nameHead.forEach (nameH => {
        const cell = this.cell();
        cell.innerText = nameH;
        headRow.appendChild(cell);

    })
    return headRow;
}

Show.prototype.row = function (dataInd) {
    const row = document.createElement ("tr");
    const arr = ['id', 'name', 'price', 'count'];
    arr.forEach (name => {
    
        const cell = this.cell();
        cell.id = name;
        if (name ===  "id") {
            cell.innerText = dataInd._id;
        } else if (name === "name") {
            cell.innerText = dataInd.data.name;
        } else if (name === "price") {
            cell.innerText = dataInd.data.price;
        } else if (name === "count") {
            cell.innerText = dataInd.data.count;
        }
        //console.log(id);
        //cell.innerText = shop.fillData(id, dataInd);
        row.appendChild(cell)
    })
    return row;
}

Show.prototype.cell = function() {
    const cell = document.createElement("td");
    cell.className = "cell";
    return cell;
    

}

Show.prototype.fillData = function(cellId, dataInd){
    if (cellId === "id") {
        return cellId.innerText = dataInd._id
    } else if (CellId === "name") {
        return cellId.innerText = dataInd.data.name;
    } else if (CellId === "price") {
        return cellId.innerText = dataInd.data.price;
    } else if (CellId === "count") {
        return cellId.innerText = dataInd.data.count;
    }

}
const show = new Show ();
api.getAllShow()


function stoper2 (liczba) {
    console.log(liczba);
    liczba++;
    if (liczba > 5)
    return;
    setTimeout(function(){
        stoper2 (liczba)
    }, 2000)
}
stoper2(1);