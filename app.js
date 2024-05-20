let budget = 0;
let totalAmount = 0;
let items = [];
let categories = [];
let sessionItemsCount = 0; // Track the length of items added during the current session

// Load data from localStorage on page load
window.onload = function() {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
        items = JSON.parse(savedItems);
        sessionItemsCount = items.length; // Set sessionItemsCount to the length of stored items
        renderItems();
    }

    loadStoredBudget(); // Load stored budget on page load
}

function setBudget() {
    const budgetInput = document.getElementById('budget');
    budget = parseFloat(budgetInput.value);
    localStorage.setItem('budget', budget);
    totalAmount = 0; // Reset totalAmount when setting a new budget
    updateTotal();
}

function loadStoredBudget() {
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
        budget = parseFloat(savedBudget);
        document.getElementById('budget').value = budget;
    } else {
        alert('No stored budget found.');
    }
}

function addItem() {
    const itemNameInput = document.getElementById('itemName');
    const itemAmountInput = document.getElementById('itemAmount');
    const itemCategoryInput = document.getElementById('itemCategory');
    const budgetInput = document.getElementById('budget');
    const budget = parseFloat(budgetInput.value);

    const itemName = itemNameInput.value;
    const itemAmount = parseFloat(itemAmountInput.value);

    if (itemName.trim() === '' || isNaN(itemAmount) || itemAmount <= 0 || itemCategoryInput.value.trim() === '') {
        alert('Please enter valid item name, amount, and category.');
        return;
    }

    // Check if adding the item exceeds the budget
    if (totalAmount + itemAmount > budget) {
        alert('Warning: Adding this item will exceed your budget!');
    }

    items.push({ name: itemName, amount: itemAmount, category: itemCategoryInput.value.trim() });
    localStorage.setItem('items', JSON.stringify(items));

    renderItems();

    totalAmount += itemAmount;
    updateTotal();

    if (totalAmount > budget) {
        // Change the color of total amount and new items to red
        document.getElementById('total').style.color = 'red';
        document.querySelectorAll('.item').forEach(item => {
            item.style.color = 'red';
        });
    }

    itemNameInput.value = '';
    itemAmountInput.value = '';
    itemCategoryInput.value = '';
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All</option>';
    categories.forEach(category => {
        categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function filterItems() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    renderItems(categoryFilter);
}

function renderItems(categoryFilter = 'all') {
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';
    items.forEach((item, index) => {
        if (categoryFilter === 'all' || item.category === categoryFilter) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const itemNameSpan = document.createElement('span');
            itemNameSpan.classList.add('item-name');
            itemNameSpan.textContent = item.name;

            const itemAmountSpan = document.createElement('span');
            itemAmountSpan.classList.add('item-amount');
            itemAmountSpan.textContent = item.amount.toFixed(2);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                // Check if the item's index is within the range of the items added during the current session
                if (index < sessionItemsCount) {
                    totalAmount -= item.amount;
                    updateTotal();
                }
                items.splice(index, 1);
                localStorage.setItem('items', JSON.stringify(items));
                renderItems(categoryFilter);
            });

            itemDiv.appendChild(itemNameSpan);
            itemDiv.appendChild(document.createTextNode(': '));
            itemDiv.appendChild(itemAmountSpan);
            itemDiv.appendChild(deleteBtn);

            itemsList.appendChild(itemDiv);
        }
    });
}

function updateTotal() {
    const budgetInput = document.getElementById('budget');
    const budget = parseFloat(budgetInput.value);
    const totalDiv = document.getElementById('total');
    totalDiv.textContent = `Total: ${totalAmount.toFixed(2)} / ${budget.toFixed(2)}`;
}
