//Add EventListeners

const removeBtns = document.getElementsByClassName("btn-remove");

for (let btn of removeBtns) {

    const transactionId = btn.dataset.transactionId;
    
    btn.addEventListener("click", deleteTransactionHandler.bind(this, transactionId));
}


async function deleteTransactionHandler(transactionId) {

    alert(transactionId)

}