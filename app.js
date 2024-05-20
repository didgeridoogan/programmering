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

    const itemName = itemNameInput.value;
    const itemAmount = parseFloat(itemAmountInput.value);
    const itemCategory = itemCategoryInput.value.trim();

    if (itemName.trim() === '' || isNaN(itemAmount) || itemAmount <= 0 || itemCategory === '') {
        alert('Please enter valid item name, amount, and category.');
        return;
    }

    items.push({ name: itemName, amount: itemAmount, category: itemCategory });
    localStorage.setItem('items', JSON.stringify(items));

    if (!categories.includes(itemCategory)) {
        categories.push(itemCategory);
        updateCategoryFilter();
    }

    renderItems();

    totalAmount += itemAmount;
    updateTotal();

    sessionItemsCount++; // Increment sessionItemsCount for each added item

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
    const totalDiv = document.getElementById('total');
    totalDiv.textContent = `Total: ${totalAmount.toFixed(2)}`;
}
