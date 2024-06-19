document.addEventListener("DOMContentLoaded", function() {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const totalExpenseElement = document.getElementById('totalExpense');
    const editModal = document.getElementById('editModal');
    const closeModalButton = document.querySelector('.close');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    let totalExpense = 0;
    let currentEditId = null;
    let expenses = [];

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = new Date().toLocaleDateString();

        const expense = {
            id: Date.now(),
            description,
            amount,
            category,
            date
        };

        expenses.push(expense);
        totalExpense += amount;

        addExpenseToList(expense);
        updateTotalExpense();

        expenseForm.reset();
    });

    function addExpenseToList(expense) {
        const expenseRow = document.createElement('section');
        expenseRow.classList.add('expenses-section');
        expenseRow.setAttribute('data-id', expense.id);

        expenseRow.innerHTML = `
            <div class="col-1">${expenses.length}</div>
            <div class="col-2">${expense.description}</div>
            <div class="col-3">${expense.category}</div>
            <div class="col-4">${expense.date}</div>
            <div class="col-5">$${expense.amount.toFixed(2)}</div>
            <div class="col-6"><button onclick="editExpense(${expense.id})">Edit</button></div>
            <div class="col-7"><button onclick="deleteExpense(${expense.id})">Delete</button></div>
        `;

        expenseList.appendChild(expenseRow);
    }

    function updateTotalExpense() {
        totalExpenseElement.textContent = `$${totalExpense.toFixed(2)}`;
    }

    window.editExpense = function(id) {
        const expense = expenses.find(exp => exp.id === id);
        currentEditId = id;

        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editAmount').value = expense.amount;
        document.getElementById('editCategory').value = expense.category;

        editModal.style.display = 'block';
    }

    saveButton.addEventListener('click', function() {
        const description = document.getElementById('editDescription').value;
        const amount = parseFloat(document.getElementById('editAmount').value);
        const category = document.getElementById('editCategory').value;

        const expense = expenses.find(exp => exp.id === currentEditId);

        totalExpense -= expense.amount;
        totalExpense += amount;

        expense.description = description;
        expense.amount = amount;
        expense.category = category;

        updateExpenseInList(expense);
        updateTotalExpense();

        editModal.style.display = 'none';
    });

    cancelButton.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    closeModalButton.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    window.deleteExpense = function(id) {
        const expenseIndex = expenses.findIndex(exp => exp.id === id);
        const expense = expenses[expenseIndex];

        totalExpense -= expense.amount;
        expenses.splice(expenseIndex, 1);

        updateTotalExpense();
        removeExpenseFromList(id);
    }

    function updateExpenseInList(expense) {
        const expenseRow = document.querySelector(`.expenses-section[data-id="${expense.id}"]`);

        expenseRow.innerHTML = `
            <div class="col-1">${expenses.indexOf(expense) + 1}</div>
            <div class="col-2">${expense.description}</div>
            <div class="col-3">${expense.category}</div>
            <div class="col-4">${expense.date}</div>
            <div class="col-5">$${expense.amount.toFixed(2)}</div>
            <div class="col-6"><button onclick="editExpense(${expense.id})">Edit</button></div>
            <div class="col-7"><button onclick="deleteExpense(${expense.id})">Delete</button></div>
        `;
    }

    function removeExpenseFromList(id) {
        const expenseRow = document.querySelector(`.expenses-section[data-id="${id}"]`);
        expenseList.removeChild(expenseRow);
    }
});
