var rootUrlApi = "http://localhost:3000"
var user = {
	_id: "5e407974abe2d24226922d8a",
	name: "User Test",
	email: "test@email.com",
}


/* <<<<<<<< API Communication functions >>>>>>>>>> */
async function getAccounts() {
	const accountsData = await $.get(`${rootUrlApi}/accounts`)
	renderAccounts(accountsData)
}

async function getTransactions() {
	const transactionsData = await $.get(`${rootUrlApi}/transactions`)
	//console.log(transactionsData)
	renderTransactions(transactionsData)
}

async function getCategories() {
	const categoriesData = await $.get(`${rootUrlApi}/categories`)
	renderCategories(categoriesData)
}

async function getBudgetData() {
	const budgetData = await $.get(`${rootUrlApi}/budget`)
	renderBudget(budgetData)
}

async function saveTransaction() {
	let form
	let type
	const tabId = $(".nav-tabs .active").attr("id")

	//get type of transaction (depends on active tab)
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

	//paymentMonth is the first day of the month
	const paymentMonth = moment().month(dataForm["month"]).startOf('month').format("YYYY-MM-DD");

	const data = {
		amount: Number(dataForm["valor"].split(".").join("")),
		note: dataForm["nota"].trim(),
		payment_month: paymentMonth,
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
		getTransactions()
		getBudgetData()
	}
}

async function getAccountData(id) {
	const accountData = await $.get(`${rootUrlApi}/accounts/${id}`);
	return accountData;

}

/* <<<<<<<<<<<<<<<<< Rendering functions >>>>>>>>>>>>>> */
function renderAccounts(accounts) {
	console.log(accounts)

	accounts.forEach((account) => {
		//Render Divs
		const div = document.createElement("div")
		div.classList.add("p-2")
		div.classList.add("bd-highlight")
		div.classList.add("account-container")
		div.id = account.name.toLowerCase().split(' ').join('-')

		div.setAttribute("data-toggle", "modal");
		div.setAttribute("data-target", `#show-${div.id}`);
		div.setAttribute("data-account-id", account._id);

		//format money values
		const incomes = new Intl.NumberFormat("de-DE").format(account.incomes)
		const expenses = new Intl.NumberFormat("de-DE").format(account.expenses)
		const balance = new Intl.NumberFormat("de-DE").format(account.balance)
		const total = new Intl.NumberFormat("de-DE").format(account.total)

		const card = `
		<div class="card" style="width: 18rem;">
		<div class="card-body">
		<h5 class="card-title">${account.name}</h5>
		<div class="card-text">Incomes:&ensp;$${incomes}</div>
		<div class="card-text">Expenses:&ensp;$${expenses}</div>
		<div class="card-text">Balance:&ensp;$${balance}</div>
		<div class="card-text">Total:&ensp;$${total}</div>
		</div>
		</div>`

		div.innerHTML = card

		document.getElementById("data-containers").appendChild(div)
		//----------------------------------------------------------------- 

		//Render Select box
		const select = document.getElementById("select-accounts");
		const op = document.createElement("option");
		op.setAttribute("value", account["_id"]);
		op.dataset.accountType = account.type;
		op.text = account["name"];
		select.add(op);
	})
}

function renderTransactions(transactions) {
	//console.log(transactions)

	const tbody = document.getElementById("transactions-tbody")
	tbody.innerHTML = ""
	
	for (const prop in transactions) {

		transaction = transactions[prop];

		if(transaction.type === "transfer_in" || transaction.type === "transfer_out"){
			continue;
		}
		const categoryName = transaction.category ? transaction.category.name : "-";
		
		//Styles for type column
		let typeClasses = []
		if (transaction.type == "expense") {
			typeClasses.push("border-bottom")
			typeClasses.push("border-danger")
			typeClasses.push("alert-danger")
		} else if (transaction.type == "income") {
			typeClasses.push("border-bottom")
			typeClasses.push("border-success")
			typeClasses.push("alert-success")
		}

		
		const row = tbody.insertRow(-1)
		
		const cell1 = row.insertCell(0)
		const cell2 = row.insertCell(1)
		const cell3 = row.insertCell(2)
		const cell4 = row.insertCell(3)
		const cell5 = row.insertCell(4)
		const cell6 = row.insertCell(5)
		const cell7 = row.insertCell(6)


		cell1.innerHTML = `<td>${moment
			.utc(transaction.createdAt)
			.format("DD-MMM-YYYY")}</td>`
		cell2.innerHTML = `<td>${moment.utc(transaction.payment_month).format("MMMM")}</td>`
		cell3.innerHTML = `<td>${transaction.type}</td>`
		cell4.innerHTML = `<td>${transaction.account.name}</td>`
		cell5.innerHTML = `<td>${new Intl.NumberFormat("de-DE").format(
			transaction.amount
		)}</td>`
		cell6.innerHTML = `<td>${categoryName}</td>`
		cell7.innerHTML = `<td>${transaction.note}</td>`

		cell3.classList.add(...typeClasses)
		//cell5.classList.add("text-right")
	}
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

function renderBudget(budgetData) {

	const budgetContainer = document.getElementById("budget-container");
	budgetContainer.innerHTML = ""

	const div = document.createElement("div")
	div.classList.add("p-2")
	div.classList.add("bd-highlight")

	//format money values
	const budget = new Intl.NumberFormat("de-DE").format(budgetData.budget)
	const spent = new Intl.NumberFormat("de-DE").format(budgetData.spent)
	const available = new Intl.NumberFormat("de-DE").format(budgetData.budget - budgetData.spent)

	const availableClass = available < 0 ? "alert-danger" : "alert-success";

	const card = `
		<div class="card" style="width: 18rem;">
	    <div class="card-body">
		<h5 class="card-title">Budget</h5>
		<div class="card-text">Budget:&ensp;$${budget}</div>
		<div class="card-text">Gastado:&ensp;$${spent}</div>
		<div class="card-text ${availableClass}">Disponible:&ensp;$${available}</div>
		</div>
		</div>`

	div.innerHTML = card

	budgetContainer.appendChild(div)
}

function renderCuentaAhorrosModal(accountData) {

	const bolsillosData = accountData.pockets;
	let totalBolsillos = bolsillosData.reduce((acc, curr) => {
		return acc + curr.amount
	}, 0)
	let available = accountData.balance - totalBolsillos;

	totalBolsillos = new Intl.NumberFormat("de-DE").format(totalBolsillos);
	available = new Intl.NumberFormat("de-DE").format(available)

	const bolsillosContainer = document.getElementById("bolsillos");
	bolsillosContainer.innerHTML = ""

	bolsillosData.forEach(pocket => {
		const amount = new Intl.NumberFormat("de-DE").format(pocket.amount)
		const pocketDiv = `<div title = "${pocket.description}"><b>${pocket.name}:&nbsp;</b><span>$</span><span>${amount}</span></div>`;
		bolsillosContainer.innerHTML += pocketDiv;
	});

	// add Total
	const totalDiv = `<br><div title = "Total en Bolsillos"><b>Total Bolsillos:&nbsp;</b><span>$</span><span>${totalBolsillos}</span></div><br>`;
	const availableDiv =
		"<div class=\"bg-secondary p-2 text-light\" title = \"Disponible en cuenta\">" +
		`<b>Disponible:&nbsp;</b><span>$</span><span>${available}</span>` +
		"</div>";

	bolsillosContainer.innerHTML += totalDiv;
	bolsillosContainer.innerHTML += availableDiv;

}


function formatNumber() {
	const currentVal = Number(this.value.split(".").join(""))
	const val = new Intl.NumberFormat("de-DE").format(currentVal)
	this.value = val
}

function changeAccountHandler() {

	const typeSelectedAccount = this.options[this.selectedIndex].dataset.accountType;
	const diaCorte = 15; //fecha de corte de la Tarjeta de crédito
	const todayDate = moment().date(); //number day of the month	
	let monthSet;
	if (typeSelectedAccount === "credit card" && todayDate >= diaCorte){
		monthSet = moment().month() + 1;
	}else {
		monthSet = moment().month();
	}

	document.getElementById("month").options[monthSet].selected = true;
}

$(document).ready(function () {
	//API Communications (pending: send useriD to filter)
	getAccounts()
	getTransactions()
	getCategories()
	getBudgetData()

	/* Set current month */
	const currentMonth = moment().month();
	document.getElementById("month").options[currentMonth].selected = true;

	/* onclick Save Transaction  */
	document
		.getElementById("save-transaction")
		.addEventListener("click", saveTransaction)

	/* keyup type input value  */
	document.getElementById("valor").addEventListener("keyup", formatNumber)
	
	/* onchange accounts */
	document.getElementById("select-accounts").addEventListener("change", changeAccountHandler)
	


	/* show modal cuenta de ahorros */
	$('#show-cuenta-de-ahorros').on('show.bs.modal', async function (e) {

		const accountId = e.relatedTarget.dataset.accountId;
		const accountData = await getAccountData(accountId);
		renderCuentaAhorrosModal(accountData);

	})
})
