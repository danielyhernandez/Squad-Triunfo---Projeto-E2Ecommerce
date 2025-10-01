// Global variables
let products = [];
let users = [];
let filteredProducts = [];
let filteredUsers = [];
let categories = new Set();

// DOM elements
const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const sortProducts = document.getElementById('sortProducts');
const userSearch = document.getElementById('userSearch');
const roleFilter = document.getElementById('roleFilter');
const productsTable = document.getElementById('productsTable');
const usersTable = document.getElementById('usersTable');
const confirmModal = document.getElementById('confirmModal');
const userModal = document.getElementById('userModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadProducts();
    loadUsers();
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    if (!userSession) {
        window.location.href = 'login.html';
        return;
    }
    
    const session = JSON.parse(userSession);
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const diffMinutes = (now - loginTime) / (1000 * 60);
    
    // Check if session is still valid (30 minutes)
    if (diffMinutes >= 30) {
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info
    document.getElementById('userEmail').textContent = session.email;
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Product filters
    productSearch.addEventListener('input', debounce(filterProducts, 300));
    categoryFilter.addEventListener('change', filterProducts);
    sortProducts.addEventListener('change', filterProducts);
    
    // User filters
    userSearch.addEventListener('input', debounce(filterUsers, 300));
    roleFilter.addEventListener('change', filterUsers);
    
    // Modal close on outside click
    window.addEventListener('click', function(event) {
        if (event.target === confirmModal) {
            closeModal();
        }
        if (event.target === userModal) {
            closeUserModal();
        }
    });
}

// Switch tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch('https://catalogo-products.pages.dev/api/products');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        
        products = await response.json();
        filteredProducts = [...products];
        
        // Extract categories
        products.forEach(product => {
            if (product.category) {
                categories.add(product.category);
            }
        });
        
        populateCategoryFilter();
        renderProducts();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showError('Erro ao carregar produtos. Tente novamente.');
    }
}

// Load users (simulated)
function loadUsers() {
    // Simulate users data
    users = [
        {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            role: 'cliente',
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            name: 'Maria Santos',
            email: 'maria@email.com',
            role: 'vendedor',
            status: 'active',
            createdAt: '2024-01-10'
        },
        {
            id: '3',
            name: 'Pedro Costa',
            email: 'pedro@email.com',
            role: 'cliente',
            status: 'inactive',
            createdAt: '2024-01-05'
        }
    ];
    
    filteredUsers = [...users];
    renderUsers();
}

// Populate category filter
function populateCategoryFilter() {
    const sortedCategories = Array.from(categories).sort();
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter products
function filterProducts() {
    const searchTerm = productSearch.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const sortBy = sortProducts.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return (a.price || 0) - (b.price || 0);
            case 'stock':
                return (b.stock || 0) - (a.stock || 0);
            default:
                return 0;
        }
    });
    
    renderProducts();
}

// Filter users
function filterUsers() {
    const searchTerm = userSearch.value.toLowerCase().trim();
    const selectedRole = roleFilter.value;
    
    filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !selectedRole || user.role === selectedRole;
        
        return matchesSearch && matchesRole;
    });
    
    renderUsers();
}

// Render products
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsTable.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }
    
    productsTable.innerHTML = filteredProducts.map(product => `
        <div class="table-row products-row">
            <div class="table-cell">
                <img src="${getProductImage(product)}" alt="${product.name}" class="product-image">
            </div>
            <div class="table-cell">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category || 'Sem categoria'}</div>
            </div>
            <div class="table-cell">${product.category || 'Sem categoria'}</div>
            <div class="table-cell">
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
            <div class="table-cell">
                <div class="stock-controls">
                    <input type="number" class="stock-input" value="10" min="10" step="10" id="stock-${product.id}">
                    <button class="btn-stock" onclick="addStock('${product.id}')">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                    Estoque atual: ${product.stock || 0} unidades
                </div>
            </div>
            <div class="table-cell">
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render users
function renderUsers() {
    if (filteredUsers.length === 0) {
        usersTable.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
                <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum usuário encontrado</p>
            </div>
        `;
        return;
    }
    
    usersTable.innerHTML = filteredUsers.map(user => `
        <div class="table-row users-row">
            <div class="table-cell">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="user-name">${user.name}</div>
                </div>
            </div>
            <div class="table-cell">
                <div class="user-email">${user.email}</div>
            </div>
            <div class="table-cell">
                <span class="user-role role-${user.role}">${user.role}</span>
            </div>
            <div class="table-cell">
                <span class="status-badge status-${user.status}">${user.status === 'active' ? 'Ativo' : 'Inativo'}</span>
            </div>
            <div class="table-cell">
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add stock to product
async function addStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const stockInput = document.getElementById(`stock-${productId}`);
    const stockToAdd = parseInt(stockInput.value);
    
    // Validate stock addition
    if (!stockToAdd || stockToAdd < 10 || stockToAdd % 10 !== 0) {
        showNotification('O acréscimo deve ser em lotes de 10 unidades (10, 20, 30...)', 'error');
        return;
    }
    
    // Check if product is active
    if (product.status === 'inactive') {
        showNotification('Produto inativo: não é possível ajustar estoque', 'error');
        return;
    }
    
    // Show confirmation modal
    showConfirmModal(
        'Confirmar Acréscimo de Estoque',
        `Adicionar +${stockToAdd} ao estoque do produto "${product.name}"?`,
        () => confirmAddStock(productId, stockToAdd)
    );
}

// Confirm add stock
async function confirmAddStock(productId, stockToAdd) {
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update product stock
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock = (product.stock || 0) + stockToAdd;
        }
        
        // Update filtered products
        const filteredProduct = filteredProducts.find(p => p.id === productId);
        if (filteredProduct) {
            filteredProduct.stock = (filteredProduct.stock || 0) + stockToAdd;
        }
        
        // Re-render products
        renderProducts();
        
        showNotification(`Estoque atualizado com sucesso! +${stockToAdd} unidades adicionadas.`, 'success');
        
    } catch (error) {
        showNotification('Falha ao atualizar estoque. Tente novamente.', 'error');
    }
}

// View product details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showConfirmModal(
        'Detalhes do Produto',
        `
        <div style="text-align: left;">
            <p><strong>Nome:</strong> ${product.name}</p>
            <p><strong>Descrição:</strong> ${product.description || 'Não informada'}</p>
            <p><strong>Categoria:</strong> ${product.category || 'Não informada'}</p>
            <p><strong>Preço:</strong> ${formatPrice(product.price)}</p>
            <p><strong>Estoque:</strong> ${product.stock || 0} unidades</p>
            <p><strong>Status:</strong> ${product.status === 'active' ? 'Ativo' : 'Inativo'}</p>
        </div>
        `,
        null,
        true
    );
}

// Open user modal
function openUserModal() {
    document.getElementById('userForm').reset();
    userModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close user modal
function closeUserModal() {
    userModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Save user
async function saveUser() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.userName || !data.userEmail || !data.userPassword || !data.userRole) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Validate email format
    if (!validateEmail(data.userEmail)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === data.userEmail)) {
        showNotification('Este e-mail já está cadastrado.', 'error');
        return;
    }
    
    // Validate password
    if (data.userPassword.length < 10) {
        showNotification('A senha deve ter pelo menos 10 caracteres.', 'error');
        return;
    }
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: data.userName,
            email: data.userEmail,
            role: data.userRole,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        users.push(newUser);
        filteredUsers = [...users];
        renderUsers();
        
        closeUserModal();
        showNotification('Usuário criado com sucesso!', 'success');
        
    } catch (error) {
        showNotification('Erro ao criar usuário. Tente novamente.', 'error');
    }
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    showNotification('Funcionalidade de edição será implementada em breve!', 'error');
}

// Delete user
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
        () => confirmDeleteUser(userId)
    );
}

// Confirm delete user
async function confirmDeleteUser(userId) {
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove user from arrays
        users = users.filter(u => u.id !== userId);
        filteredUsers = filteredUsers.filter(u => u.id !== userId);
        
        renderUsers();
        showNotification('Usuário excluído com sucesso!', 'success');
        
    } catch (error) {
        showNotification('Erro ao excluir usuário. Tente novamente.', 'error');
    }
}

// Show confirmation modal
function showConfirmModal(title, message, onConfirm, isInfo = false) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').innerHTML = message;
    
    const confirmButton = document.getElementById('confirmButton');
    if (isInfo) {
        confirmButton.style.display = 'none';
    } else {
        confirmButton.style.display = 'block';
        confirmButton.onclick = () => {
            if (onConfirm) onConfirm();
            closeModal();
        };
    }
    
    confirmModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    confirmModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Logout
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    window.location.href = 'login.html';
}

// Utility functions
function getProductImage(product) {
    // First try to use the image from the API
    if (product.image && product.image.trim() !== '') {
        return product.image;
    }
    
    // Fallback to category-based images if no image in API
    const categoryImages = {
        'eletrônicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop',
        'eletronicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop',
        'roupas': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
        'casa': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
        'esportes': 'https://images.unsplash.com/photo-1571019613454-1cb2c045efd7?w=100&h=100&fit=crop',
        'livros': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop',
        'beleza': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
        'automóveis': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
        'automoveis': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
        'jogos': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop',
        'games': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop'
    };
    
    const category = product.category ? product.category.toLowerCase() : '';
    return categoryImages[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
}

function formatPrice(price) {
    if (!price) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function showError(message) {
    showNotification(message, 'error');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
