var rootUrlApi = "http://localhost:3000"
var user = {
	_id: "5e407974abe2d24226922d8a",
	name: "User Test",
	email: "test@email.com",
}

function renderAccounts(accounts) {
	const select = document.getElementById("select-accounts")
	accounts.forEach((accounts) => {
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

	transactions.forEach((trans) => {
		//const date = new Date(trans.date)
		const row = table.insertRow(-1)

		const cell1 = row.insertCell(0)
		const cell2 = row.insertCell(1)
		const cell3 = row.insertCell(2)
		const cell4 = row.insertCell(3)
		const cell5 = row.insertCell(4)
		const cell6 = row.insertCell(5)

		cell1.innerHTML = `<td>${getFormatedDate(new Date(trans.date))}</td>`;
		cell2.innerHTML = `<td>${trans.type}</td>`;
		cell3.innerHTML = `<td>${trans.account.name}</td>`;
		cell4.innerHTML = `<td>${trans.amount}</td>`;
		cell5.innerHTML = `<td>${trans.category.name}</td>`;
		cell6.innerHTML = `<td>${trans.note}</td>`;
		

		/* const tds = []
		//let tr = "<tr>";
		tds.push(`<td>${trans.date}</td>`)
		tds.push(`<td>${trans.date}</td>`)
		tds.push(`<td>${trans.date}</td>`)
		tds.push(`<td>${trans.type}</td>`)
		tds.push(`<td>${trans.account.name}</td>`)
		tds.push(`<td>${trans.amount}</td>`)
		tds.push(`<td>${trans.category.name}</td>`)
		tds.push(`<td>${trans.note}</td>`)
		const tr = "<tr>".concat(...tds, "</tr>")
		console.log(tr)
		//table.appendChild(tr)
		table.add(tr) */
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
		//close modal
		$("#agregar-modal").modal("hide")
	}
}

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

$(document).ready(async function () {
	//set date input today by default
	//console.log(getToday())
	const today = new Date();
	const d = document.getElementById("fecha").setAttribute("value", getFormatedDate(today))
	//d.value = getToday();
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
