//Add EventListeners

const removeBtns = document.getElementsByClassName("btn-remove");

for (let btn of removeBtns) {

    const transactionId = btn.dataset.transactionId;
    
    btn.addEventListener("click", deleteTransactionHandler.bind(this, transactionId));
}


function deleteTransactionHandler(transactionId) {

    
    axios.delete(`/transaction/${transactionId}`)
        .then(function (response) {
            const resp = JSON.parse(response.data);
            if(resp.success){
                alert("Transaction has been deleted");
                location.reload(); // that is a bad practice (just for now)
            }else{
                alert("Error deleting transaction")
            }
            
        })
        .catch(function (error) {
            alert("ERROR")
            console.log(error);
        });
}