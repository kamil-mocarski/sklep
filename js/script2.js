const Api = function (url) {
    this.url = url;
    this.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

};
Api.prototype.getAll = function() {
    const url = this.url;
    return fetch(url)
    .then(this.handleResponse)
    .catch(this.error);
    
};
   
Api.prototype.getOne = function(id) {
    const url = this.url + "/" + id;
    return fetch(url)
    .then(this.handleResponse)
    .catch (this.error);
    
}

Api.prototype.buy = function(id, data){
    const url = this.url + '/' + id + "/buy";
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: this.headers
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




//SKLEP TABELA 
const Show = function() {};
Show.prototype.addTableOffer = function(data) {
    const divShowDataOffer = document.querySelector("#show");
    const table = this.table(data);
    divShowDataOffer.appendChild(table);
}

Show.prototype.table = function(data){
    const tab = document.createElement("table");
    tab.appendChild(this.tHead());
    tab.appendChild(this.tBody(data));
    return tab;

}

Show.prototype.tHead = function () {
    const tHead = document.createElement("thead");
    const tHeadRow = this.tHeadRow();
    tHead.appendChild(tHeadRow)
    return tHead;

}

Show.prototype.tHeadRow = function () {
    const headRow = document.createElement("tr");
    const nameHead = ['id', 'nazwa towaru', 'cena', 'dostępna ilość'];

    nameHead.forEach (nameH => {
        const cell = this.tHeadCell();
        cell.innerText = nameH;
        headRow.appendChild(cell);

    })
    return headRow;
}

Show.prototype.tHeadCell = function () {
    const cell = document.createElement('th');
    return cell;
}

Show.prototype.tBody = function(data){
    const tBody = document.createElement("tbody");
    const arrCount = data;

    arrCount.forEach(dataObj => {
        const row = this.tBodyRow(dataObj);
        row.id = dataObj._id;
        tBody.appendChild(row);

    })
    return tBody;
}

Show.prototype.buyClickHandler = function (e) {
        const prodId = e.target.dataset.productId;
        let name = `count${prodId}`;
        const count = document.querySelector(`input[name=${name}`).value;
        const prodCount = document.querySelector(`#cell${prodId}`).innerText;
        console.log(prodId);
        console.log(count);
        console.log(prodCount);
        
        if (parseInt(count) <= parseInt(prodCount)) {
        api.buy(prodId, {"count": parseInt(count)});
        setTimeout(function(){ location.reload(); }, 10);
        } else (alert("nie mamy tyle produktów na stanie"));
}

Show.prototype.tBodyRow = function (dataObj) {
    const row = document.createElement ("tr");
    const countBuy = document.createElement("input");
    countBuy.setAttribute ("type", "text");
    countBuy.setAttribute ("placeholder", "wpisz ilość");
    countBuy.setAttribute ("name", `count${dataObj._id}`);
    const buttonBuy = document.createElement("button");
    buttonBuy.className = "buyButton";
    buttonBuy.dataset.productId =  dataObj._id;
    buttonBuy.innerText = "kup";
    buttonBuy.addEventListener('click', this.buyClickHandler)
    const arr = ['id', 'name', 'price', 'count', "buy"];
    
    arr.forEach (name => {
        const cell = this.tBodyCell();
        cell.className = name;
        if (name ===  "id") {
            cell.innerText = dataObj._id;
        } else if (name === "name") {
            cell.innerText = dataObj.data.name;
        } else if (name === "price") {
            cell.innerText = dataObj.data.price;
        } else if (name === "count") {
            cell.innerText = dataObj.data.count;
            cell.id = `cell${dataObj._id}`
        }
        else if (name === "buy") {
            cell.appendChild(countBuy)
            cell.appendChild(buttonBuy)
        }
        row.appendChild(cell)
    })
    return row;
}

Show.prototype.tBodyCell = function() {
    const cell = document.createElement("td");
    return cell;
}

Show.prototype.showProductList = function() {
    api.getAll()
    .then(resp =>show.addTableOffer(resp))
}

const show = new Show ();
show.showProductList();