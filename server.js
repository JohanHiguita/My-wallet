const http = require("http")
const fs = require("fs")
const express = require("express")
const axios = require('axios');
const app = express()
const path = require('path');
const rootUrlApi = "http://localhost:3000";



app.set('view engine', 'ejs');
app.use(express.static("public"))

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.get("/index2", async function (req, res) {

	const data = {};

		axios.all([getAccounts(), getBudgetData()])
			.then(axios.spread(function (accountsResponse, budgetResponse) {

				const accountsData = accountsResponse.data;
				const budgetData   = budgetResponse.data;

				data.accounts = accountsData.map(account =>{
					account.expenses = formatMoney(account.expenses)
					account.incomes  = formatMoney(account.incomes)
					account.balance  = formatMoney(account.balance)
					account.total    = formatMoney(account.total)
					return account;
				})
				
				const _available     = budgetData.budget - budgetData.spent;
				const budget         = formatMoney(budgetData.budget);
				const spent          = formatMoney(budgetData.spent);
				const available      = formatMoney(_available);
				const availableClass = _available < 0 ? "alert-danger" : "alert-success"

				data.budget = {budget, spent, available, availableClass}
				console.log(data);
				

				res.render('index', data)
			}))
			.catch(error => {
				console.error(error);
			})

})

app.get("/categories", function (req, res) {
	//res.sendFile(path.join(__dirname+'/index.html'));
	const categories = getCategories();
	res.render('categories', categories);
})


app.listen(8080, function () {
	console.log("Listening on port 8080")
})

function getAccounts() {
	const url = `${rootUrlApi}/accounts`;
	return axios.get(url)
}

function getBudgetData() {
	const url = `${rootUrlApi}/budget`;
	return axios.get(url)
}
function formatMoney(value){
	
	let formatedValue = value;
	if(value < 0){
		formatedValue = formatedValue*(-1);
		formatedValue = new Intl.NumberFormat("de-DE").format(formatedValue);
		formatedValue = `-\$${formatedValue}`
	}else {
		formatedValue = new Intl.NumberFormat("de-DE").format(formatedValue);
		formatedValue = `\$${formatedValue}`
	}

	return formatedValue;
}