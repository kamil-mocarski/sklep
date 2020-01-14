class Api {
    constructor(url) {
        this.url = url;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

    };
    getAll() {
        const url = this.url;
        return fetch(url)
        .then(this.handleResponse)
        .catch(this.error);
    
    };
   
    getOne(id) {
        const url = this.url + "/" + id;
        return fetch(url)
        .then(this.handleResponse)
        .catch (this.error);
    
    }

    buy(id, data){
        const url = this.url + '/' + id + "/buy";
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this.headers
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




//SKLEP TABELA 
class Show {
    constructor(){
        this.buyArray = [];
        this.divShowDataOffer = document.querySelector("#show");
        this.cartCount = document.querySelector("#cartCountProduct");
    };

// DODAWANIE TABELI
    addTableOffer(data) {
        const table = this.table(data);
        this.divShowDataOffer.appendChild(table);
    }

// TWORZENIE TABELI
    table(data) {
        const tab = document.createElement("table");
        tab.appendChild(this.tHead());
        tab.appendChild(this.tBody(data));
        return tab;
    }
//TWORZENIE NAGŁÓWKA TABELI

    tHead() {
        const tHead = document.createElement("thead");
        const tHeadRow = this.tHeadRow();
        tHead.appendChild(tHeadRow)
        return tHead;
    }

    tHeadRow() {
        const headRow = document.createElement("tr");
        const nameHead = ['id', 'nazwa towaru', 'cena', 'dostępna ilość'];

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

//TWORZENIE CIAŁA TABELI

    tBody(data) {
        const tBody = document.createElement("tbody");
        const arrCount = data;
        
        arrCount.forEach(dataObj => {
            const row = this.tBodyRow(dataObj);
            row.id = dataObj._id;
            tBody.appendChild(row);

        })
        return tBody;
    }

    tBodyRow(dataObj) {
        const row = document.createElement ("tr");
        const countProduct = document.createElement("input");
        countProduct.setAttribute ("type", "number");
        countProduct.setAttribute ("min", 1);
        countProduct.setAttribute ("placeholder", "wpisz ilość");
        countProduct.setAttribute ("name", `count${dataObj._id}`);
        const addToCartButton = document.createElement("button");
        addToCartButton.className = "buyButton";
        addToCartButton.dataset.productId =  dataObj._id;
        addToCartButton.innerText = "Dodaj do koszyka";
        addToCartButton.addEventListener('click', this.addBuyArray.bind(this));
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
                cell.appendChild(countProduct)
                cell.appendChild(addToCartButton)
            }
            row.appendChild(cell)
        })
        return row;
    }

    tBodyCell() {
        const cell = document.createElement("td");
        return cell;
    }

//FUNKCJA TWORZĄCA TABLICĘ Z ZAKUPAMI:

    addBuyArray(e) {

        const productElement = {};
        const productId = e.target.dataset.productId;
        let name = `count${productId}`;
        const count = document.querySelector(`input[name=${name}`).value;
        
        
        if (count > 0) {
            api.getOne(productId).then(response => {
            const dataProd = response;
            
            productElement.id = dataProd.result._id;
            productElement.name = dataProd.result.data.name;
            productElement.price = dataProd.result.data.price;
            productElement.count = count;
                if (this.buyArray.length == 0) {
                    this.buyArray.push(productElement);
                
                    } else {
                        if (this.buyArray.some((el) => {
                                return el.id == productElement.id
                                })) {
                                        alert(`Dodałeś już produkt ${productElement.name}, zmien tylko ilość w koszyku`)
                        } else {
                                this.buyArray.push(productElement);
                        }
                    }
                this.cartCount.innerText = this.buyArray.length;
            })
        } else {alert('Podaj ilość produktu')}
    }

    showProductList() {
        api.getAll()
        .then(resp =>show.addTableOffer(resp))
    }}

const show = new Show ();
show.showProductList();


//KOSZYK:
class Cart {
        constructor(array) {
        this.cartArray = array;
        this.cartShowDiv = document.querySelector("#cartShow");
        this.totalCountDiv = document.querySelector("#totalCount");
        this.totalPriceDiv = document.querySelector("#totalPrice");
        this.cartCountProductDiv = document.querySelector("#cartCountProduct");
        this.cartShow = document.querySelector(".cart");
        };
//OBLICZANIE CAŁKOWITEJ ILOŚCI PRODUKTÓW  
    totalCount() {
        const totalCount = this.cartArray.reduce(function(a, b) {
            return {count : parseInt(a.count) + parseInt(b.count)}
            }, {count : 0}); 
            this.totalCountDiv.innerText = totalCount.count;
    }
//OBLICZANIE CAŁKOWITEJ CENY PRODUKTÓW    
    totalPrice() {
        const totalArray = [];
        this.cartArray.forEach(prod => {
            const {price, count}  = prod;
            const totalPriceOne = price*count;
            totalArray.push(totalPriceOne)
            })
        if (totalArray.length > 0) {
                const total = totalArray.reduce(function (a,b) {
                return a+b
            })
            this.totalPriceDiv.innerText = total;
        }
    }
//POKAZANIE KOSZYKA W DIV
    cartDiv() {
        if (this.cartArray.length > 0) {
                this.cartShowDiv.style.display = "block";
                const buyButton = document.createElement("button");
                const closeButton = document.createElement("button");
                
                buyButton.id = "buyButton";
                buyButton.innerText = "kupuję";
                closeButton.id = "closeButton";
                closeButton.innerText = "zamknij koszyk";
                
                this.cartTableShow(this.cartArray);
                this.cartShowDiv.appendChild(closeButton);
                this.cartShowDiv.appendChild(buyButton);
                const closeButtonDiv = document.querySelector("#closeButton");
            
                this.totalCount();
                this.totalPrice();
                this.buy(this.cartArray);
                closeButtonDiv.addEventListener("click", () => {
                    this.removeShow();
                
                })
            } else {alert("twój koszyk jest pusty")}
    }
//FUNKCJA CZYSZCZĄCA DIV
    removeShow() {
                const closeButtonDiv = document.querySelector("#closeButton");
                const tableCartDiv = document.querySelector("#tableCart");
                const buyButtonDiv = document.querySelector("#buyButton");
                this.cartShowDiv.style.display = "none";
                this.cartShowDiv.removeChild(tableCartDiv);
                this.cartShowDiv.removeChild(closeButtonDiv);
                this.cartShowDiv.removeChild(buyButtonDiv);
    }

//FUNKCJA POKAZUJĄCA TABELĘ
    cartTableShow(data) {
            const table = this.cartTable(data);
            this.cartShowDiv.appendChild(table);
    }

//FUNKCJE TWORZĄCE TABELĘ    
    cartTable(data) {
        const table = document.createElement("table");
        table.id = "tableCart";
        const dataTab = data;
        dataTab.forEach(col => {
            const row = this.cartRow(col);
            row.id = `row${col.id}`;
            table.appendChild(row);
            })
        return table;
    }
    
    cartRow(data) {
        const buyButtonDiv = document.querySelector("#buyButton");
        const row = document.createElement("tr");
        const count = document.createElement("input");
        const deleteButton = document.createElement("button");
        count.setAttribute ("type", "number");
        count.setAttribute ("min", 1);
        count.setAttribute ("placeholder", data.count);
        deleteButton.innerText = "Usuń z koszyka";
        const rowData = ["name", "price", "count", "delete"];
        rowData.forEach ( name => {
            const cell = this.cartCell();
            cell.className = name;
            if (name === "name") {
                cell.innerText = data.name;
            } else if (name === "price") {
                cell.innerText = data.price;
            } else if (name === "count") {
                cell.appendChild(count);
                count.addEventListener("change", () => {
                    for (let i = 0; i < this.cartArray.length; i++) {
                        if (this.cartArray[i].id == data.id) {
                            this.cartArray[i].count = count.value;
                            api.getOne(this.cartArray[i].id).then(resp => {
                                const productObject = resp;
                                const actuallyProductCount = productObject.result.data.count;
                                if(actuallyProductCount< count.value) {
                                    alert(`Nie mamy tyle produktu: ${productObject.result.data.name} na stanie - zmniejsz ilość do ${actuallyProductCount}`);
                                
                                    }
                                })
                            }
                        
                        }   
                    this.totalCount();
                    this.totalPrice();
                })
            } else if (name === "delete") {
                cell.appendChild(deleteButton);
                deleteButton.id = `delete${data.id}`;
                deleteButton.addEventListener("click", () => {
                    const trId = document.querySelector(`#row${data.id}`);
                    const table = document.querySelector("#tableCart");
                    table.removeChild(trId);
                    for (let i = 0; i < this.cartArray.length; i++) {
                            if (this.cartArray[i].id == data.id) {
                                this.cartArray.splice(i,1)
                            }
                        }
        
                if (this.cartArray.length === 0) {
                        this.removeShow();
                        this.cartCountProductDiv.innerText = "Twój koszyk jest pusty";  
                        }
                this.totalCount();
                this.totalPrice();
                })
            }
            
            row.appendChild(cell);
        });
        return row;
    }
    
    cartCell() {
        const cell = document.createElement("td");
        return cell;
    }
    
    show(){
        this.cartShow.addEventListener('click', () => {
        this.cartDiv();
        })
    }
//FUNKCJA ODPOWIADAJĄCA ZA KUPOWANIE:
    buy(array) {
        const buttonBuy = document.querySelector("#buyButton");
        buttonBuy.addEventListener("click", () =>{
        array.forEach(prod => {
            const {id, count}  = prod;
            api.buy(parseInt(id), {"count": parseInt(count)})        
            })
        alert("Zakupy zrealizowane, dziekujemy zapraszamy ponownie")
        setTimeout(function(){ location.reload(); }, 300);
        })
        
    }
}    
    
    const cart = new Cart(show.buyArray);
    cart.show();
    


