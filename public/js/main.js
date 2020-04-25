var rootUrlApi = "http://localhost:3000"
var user = {
	_id: "5e407974abe2d24226922d8a",
	name: "User Test",
	email: "test@email.com",
}

/* <<<<<<<< API Communication functions >>>>>>>>>> */
async function getAccounts (){
	const accountsData = await $.get(`${rootUrlApi}/accounts`)
	renderAccounts(accountsData)
}

async function getTransactions(){
	const transactionsData = await $.get(`${rootUrlApi}/transactions`)
	console.log(transactionsData)
	renderTransactions(transactionsData)
}

async function getCategories(){
	
	const categoriesData = await $.get(`${rootUrlApi}/categories`)
	renderCategories(categoriesData)
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

/* organize data */
	const dataForm = _dataForm.reduce((prev, curr) => {
		prev[curr["name"]] = curr["value"]
		return prev
	}, {})

	const data = {
		amount: Number(dataForm["valor"].split('.').join("")),
		note: dataForm["nota"].trim(),
		date: dataForm["fecha"],
		type: type,
		user_id: user["_id"],
		category_id: dataForm["categoria"],
		account_id: dataForm["cuenta"],
	}

	const jsonData = JSON.stringify(data)

	try {
		const response = await $.ajax({
			url: `${rootUrlApi}/transactions`,
			type: "POST",
			//data: data,
			async: true,
			data: jsonData,
			contentType: "application/json; charset=UTF-8",
		})
		console.log(response)
		if (response["success"]) {
			alert("Transacción creada")
		} else {
			alert("Error!")
		}
	} catch (error) {
		console.log(error)
		alert("Error!")
	} finally {
		
		$("#agregar-modal").modal("hide")
		//Reload table
		getTransactions();

	}
}

/* <<<<<<<<<<<<<<<<< Rendering functions >>>>>>>>>>>>>> */
function renderAccounts(accounts) {
	
	console.log(accounts)
	
	accounts.forEach((accounts) => {
		//Render Divs 
		const div = document.createElement("div");
		div.classList.add("p-2");
		div.classList.add("bd-highlight");
				
		//format money values
		const incomes = new Intl.NumberFormat("de-DE").format(accounts.incomes);
		const expenses = new Intl.NumberFormat("de-DE").format(accounts.expenses);
		const balance = new Intl.NumberFormat("de-DE").format(accounts.balance);

		const card = `
		<div class="card" style="width: 18rem;">
		<div class="card-body">
		<h5 class="card-title">${accounts.name}</h5>
		<div class="card-text">Incomes:&ensp;$${incomes}</div>
		<div class="card-text">Expenses:&ensp;$${expenses}</div>
		<div class="card-text">Balance:&ensp;$${balance}</div>
		</div>
		</div>`;
		
		div.innerHTML = card;
		
		document.getElementById("data-containers").appendChild(div);
		
		
		//Render Select box
		const select = document.getElementById("select-accounts")
		const op = document.createElement("option")
		op.setAttribute("value", accounts["_id"])
		op.text = accounts["name"]
		select.add(op)
	})
}

function renderTransactions(transactions) {
	//console.log("Data:", data)
	const table = document.getElementById("table-transactions")
	//console.log(tbody)

	transactions.forEach((transaction) => {
		
		//Styles for type column
		let typeClasses = []
		if(transaction.type == "expense"){
			typeClasses.push("border-bottom");
			typeClasses.push("border-danger");
			typeClasses.push("alert-danger");
		}else if (transaction.type == "income"){
			//typeClasses.push("border");
			typeClasses.push("border-bottom");
			typeClasses.push("border-success");
			typeClasses.push("alert-success");
		}

		const row = table.insertRow(-1)

		const cell1 = row.insertCell(0)
		const cell2 = row.insertCell(1)
		const cell3 = row.insertCell(2)
		const cell4 = row.insertCell(3)
		const cell5 = row.insertCell(4)
		const cell6 = row.insertCell(5)
		

		
		cell1.innerHTML = `<td>${getFormatedDate(new Date(transaction.date))}</td>`;
		cell2.innerHTML = `<th>${transaction.type}</td>`;
		cell3.innerHTML = `<td>${transaction.account.name}</td>`;
		cell4.innerHTML = `<td>${new Intl.NumberFormat("de-DE").format(transaction.amount)}</td>`;
		cell5.innerHTML = `<td>${transaction.category.name}</td>`;
		cell6.innerHTML = `<td>${transaction.note}</td>`;
		
		cell2.classList.add(...typeClasses);
	})
}

function renderCategories(categories) {
	const select = document.getElementById("select-categories")
	categories.forEach((category) => {
		const op = document.createElement("option")
		op.setAttribute("value", category["_id"])
		op.text = category["name"]
		select.add(op)
	})
}

/* <<<<<<<<<<<< Other fucntions  >>>>>>>>>>>>>>>*/
function getFormatedDate(date) {
	/*  YYYY-MM-dd */
	//const date = 
	return (
		date.getFullYear() +
		"-" +
		("0" + (date.getMonth() + 1)).slice(-2) +
		"-" +
		("0" + date.getDate()).slice(-2)
	)
}

function formatNumber(){
	const currentVal = Number(this.value.split('.').join(""));
	const val = new Intl.NumberFormat("de-DE").format(currentVal);
	this.value = val;
}

$(document).ready(function () {

	//API Communications (pending: send useriD to filter)
	getAccounts();	
	getTransactions();	
	getCategories();

	
	/* Format Date */
	const today = new Date();
	const d = document.getElementById("fecha").setAttribute("value", getFormatedDate(today))

	/* onclick Save Transaction  */
	document
		.getElementById("save-transaction")
		.addEventListener("click", saveTransaction)

	/* keyup type input value  */
	document
	.getElementById("valor")
	.addEventListener("keyup", formatNumber)

})
