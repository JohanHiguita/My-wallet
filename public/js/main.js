$(document).ready(async function () {


    var rootUrlApi = "http://localhost:3000"
    
    const accountsData = await $.get(`${rootUrlApi}/accounts`);
    renderAccounts(accountsData);

    const transactionsData = await $.get(`${rootUrlApi}/transactions`);
    renderTransactions(transactionsData);
    

    function renderAccounts(data){
        console.log("Data:",data);
    }

    function renderTransactions(data){
        console.log("Data:",data);
    }
    

})
