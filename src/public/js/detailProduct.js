const socketClient = io();
const form = document.getElementById("productForm");
//const inputQuantity = document.getElementById("Quantity");
const inputProductID = document.getElementById("ProductID");
const inputCartID = document.getElementById("CartID");

form.onsubmit = (e) => {
    e.preventDefault();
    const infoProduct = {
      productID: inputProductID.value,
      cartID: inputCartID.value,
      //quantity: inputQuantity.value,
    };
    socketClient.emit("addProduct", infoProduct);
  };