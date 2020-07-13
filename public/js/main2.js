//Add EventListeners

const removeBtns = document.getElementsByClassName("btn-remove");

for (let btn of removeBtns) {

    const transactionId = btn.dataset.transactionId;
    
    btn.addEventListener("click", deleteTransactionHandler.bind(this, transactionId));
}


// When add button is clicked
const addBtn = document.getElementById("add-transaction-btn");

addBtn.addEventListener("click", addBtnHandler)


/* Handlers */

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

function addBtnHandler(){
    
    //get Categories
    alert("categories")
    axios.get(`/categories`)
        .then(function (response) {
            const categories = response.data;   

            //Render Categories
            renderCategories(categories);
        })
        .catch(function (error) {
            alert("ERROR")
            console.log(error);
        });
    
}

/*  Renders */

function renderCategories(categories) {
	const select = document.getElementById("select-categories")
	categories.forEach((category) => {
		const op = document.createElement("option")
		op.setAttribute("value", category["_id"])
		op.text = category["name"]
		select.add(op)
	})
}