var rootUrlApi = "http://localhost:3000";
var user = {
    _id: "5e407974abe2d24226922d8a",
    name: "User Test",
    email: "test@email.com",
};

function renderAccounts(accounts) {
	const select = document.getElementById("select-accounts")
	accounts.forEach((accounts) => {
		const op = document.createElement("option")
		op.setAttribute("value", accounts["_id"])
		op.text = accounts["name"]
		select.add(op)
	})
}

function renderTransactions(data) {
	console.log("Data:", data)
}

function renderCategories(categories) {
    const select = document.getElementById("select-categories");
	categories.forEach((category) => {
		const op = document.createElement("option")
		op.setAttribute("value", category["_id"])
		op.text = category["name"]
		select.add(op)
	})
}

async function saveTransaction() {
    let form
	let type
	const tabId = $(".nav-tabs .active").attr("id")

	if (tabId == "gasto-tab") {
		form = $("#gasto-ingreso-form")
		type = "expense"
	} else if (tabId == "ingreso-tab") {
		form = $("#gasto-ingreso-form")
		type = "income"
	} else if (tabId == "transferencia-tab") {
		form = $("#transferencia-form")
	}
	
	const _dataForm = form.serializeArray()
	
	//organize data
	const dataForm = _dataForm.reduce((prev, curr) => {
		prev[curr["name"]] = curr["value"]
		return prev
	}, {})

	const data = {
		amount: Number(dataForm["valor"]),
		note: dataForm["nota"].trim(),
		date: dataForm["fecha"],
		type: type,
		user_id: user["_id"],
		category_id: dataForm["categoria"],
		account_id: dataForm["cuenta"]
    }

	const jsonData = JSON.stringify(data);

	try {
		const response = await $.ajax({
			url: `${rootUrlApi}/transactions`,
			type: "POST",
			//data: data,
			async: true,
			data: jsonData,
			contentType: "application/json; charset=UTF-8"
		});
		console.log(response);
		if(response["success"]){
			alert("Transacción creada");
		}else{
			alert("Error!");
		} 
	} catch (error) {
		console.log(error)
		alert("Error!");
	}finally{
		//close modal
		$('#agregar-modal').modal('hide')
	} 
}

$(document).ready(async function () {


	document
		.getElementById("save-transaction")
		.addEventListener("click", saveTransaction)


    //API Communications (pending: send useriD to filter)    
	const accountsData = await $.get(`${rootUrlApi}/accounts`)
	renderAccounts(accountsData)

	const transactionsData = await $.get(`${rootUrlApi}/transactions`)
    renderTransactions(transactionsData)
    
    const categoriesData = await $.get(`${rootUrlApi}/categories`)
    renderCategories(categoriesData)
})

