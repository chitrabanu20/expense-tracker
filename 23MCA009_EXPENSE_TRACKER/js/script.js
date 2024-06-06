
$(document).ready(function() {
    const balance = $("#balance");
    const inc_amt = $("#inc-amt");
    const exp_amt = $("#exp-amt");
    const trans = $("#trans");
    const form = $("#form");
    const description = $("#desc");
    const amount = $("#amount");
  
    const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
    let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];
  
    console.log("Initial transactions from localStorage:", transactions);
  
    // Load transaction details into the DOM
    function loadTransactionDetails(transaction) {
        const sign = transaction.amount < 0 ? "-" : "+";
        const item = $("<li>").addClass(transaction.amount < 0 ? "exp" : "inc").html(`
            ${transaction.description}
            <span>${sign} ${Math.abs(transaction.amount)}</span>
            <button class="btn-del" data-id="${transaction.id}">x</button>
        `);
        trans.append(item);
    }
  
    // Remove a transaction
    function removeTrans(id) {
        if (confirm("Are you sure you want to delete this transaction?")) {
            transactions = transactions.filter((transaction) => transaction.id !== id);
            console.log("Transactions after deletion:", transactions);
            config();
            updateLocalStorage();
        }
    }
  
    // Update the amounts (balance, income, expenses)
    function updateAmount() {
        const amounts = transactions.map((transaction) => transaction.amount);
        const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
        balance.text(`₹ ${total}`);
  
        const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
        inc_amt.text(`₹ ${income}`);
  
        const expense = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0).toFixed(2);
        exp_amt.text(`₹ ${Math.abs(expense)}`);
    }
  
    // Configure the transactions
    function config() {
        trans.html("");
        transactions.forEach(loadTransactionDetails);
        updateAmount();
    }
  
    // Add a new transaction
    function addTransaction(e) {
        e.preventDefault();
        if (description.val().trim() === "" || amount.val().trim() === "") {
            alert("Please Enter Description and amount");
            return;
        }
  
        const transaction = {
            id: uniqueId(),
            description: description.val(),
            amount: parseFloat(amount.val())
        };
  
        console.log("Adding transaction:", transaction);
  
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        description.val("");
        amount.val("");
        updateAmount();
        updateLocalStorage();
    }
  
    // Generate a unique ID
    function uniqueId() {
        return Math.floor(Math.random() * 10000000);
    }
  
    // Update localStorage with transactions
    function updateLocalStorage() {
        localStorage.setItem("trans", JSON.stringify(transactions));
        console.log("Updated localStorage:", JSON.parse(localStorage.getItem("trans")));
    }
  
    // Initialize the transaction list and amounts
    config();
  
    // Form submission event
    form.on("submit", addTransaction);
  
    // Event delegation for delete buttons
    trans.on("click", ".btn-del", function() {
        const id = parseInt($(this).data("id"), 10);
        console.log("Deleting transaction with ID:", id);
        removeTrans(id);
    });
  });
  