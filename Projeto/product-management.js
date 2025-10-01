// Sistema de Gestão de Produtos
class ProductManagement {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.init();
    }

    init() {
        this.loadSampleProducts();
    }

    loadSampleProducts() {
        if (this.products.length === 0) {
            this.products = [
                { id: '1', name: 'Smartphone Samsung Galaxy S23', description: 'Smartphone premium com câmera de 50MP', category: 'eletrônicos', price: 2999.99, stock: 15, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', status: 'active', isOffer: true, originalPrice: 3499.99, rating: 4.5, maxStock: 100 },
                { id: '2', name: 'Notebook Dell Inspiron 15', description: 'Notebook para trabalho e estudos', category: 'eletrônicos', price: 2499.99, stock: 8, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', status: 'active', rating: 4.3, maxStock: 50 },
                { id: '3', name: 'Camiseta Polo Masculina', description: 'Camiseta polo de algodão 100%', category: 'roupas', price: 89.99, stock: 25, image: 'https://cdn.dooca.store/946/products/pt4rix2psxqx5tiiolkkfwwqu9kj1mewowq3_1395x1980.jpg?v=1716475617', status: 'active', rating: 4.2, maxStock: 200 },
                { id: '4', name: 'Tênis Nike Air Max', description: 'Tênis esportivo confortável', category: 'esportes', price: 399.99, stock: 12, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', status: 'active', isOffer: true, originalPrice: 499.99, rating: 4.6, maxStock: 80 },
                { id: '5', name: 'Livro: JavaScript Moderno', description: 'Guia completo de JavaScript ES6+', category: 'livros', price: 79.99, stock: 30, image: 'https://a-static.mlcdn.com.br/800x560/typescript-o-javascript-moderno-para-criacao-de-aplicacoes/zambonibooks/61265/e08225b07350355b3b75c2b6232dadc6.jpeg', status: 'active', rating: 4.4, maxStock: 150 },
                { id: '6', name: 'Creme Hidratante Facial', description: 'Creme hidratante para todos os tipos de pele', category: 'beleza', price: 45.99, stock: 20, image: 'https://bemestarlifeloja.com.br/imagensProdutos/HidratanteFacial1.webp', status: 'active', rating: 4.1, maxStock: 100 },
                { id: '7', name: 'Fone de Ouvido Bluetooth', description: 'Fone sem fio com cancelamento de ruído', category: 'eletrônicos', price: 299.99, stock: 18, image: 'https://m.media-amazon.com/images/I/51lsPHwhdmL._AC_SY300_SX300_QL70_ML2_.jpg', status: 'active', rating: 4.3, maxStock: 60 },
                { id: '8', name: 'Camiseta Feminina Estampada', description: 'Camiseta leve com estampas modernas', category: 'roupas', price: 59.99, stock: 35, image: 'https://d3vnyi5j6ba1mc.cloudfront.net/Custom/Content/Products/23/79/2379435_camiseta-feminina-reta-estampada-manga-curta-340106783_l1_638868629126699170.webp', status: 'active', rating: 4.0, maxStock: 120 },
                { id: '9', name: 'Bola de Futebol Adidas', description: 'Bola oficial para treinos e partidas', category: 'esportes', price: 129.99, stock: 10, image: 'https://th.bing.com/th?id=OIF.RTDSECphKTxfD2ydm%2bLqPA&rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.5, maxStock: 50 },
                { id: '10', name: 'Livro: Aprenda Python', description: 'Livro introdutório de Python', category: 'livros', price: 69.99, stock: 28, image: 'https://m.media-amazon.com/images/I/71wZU05TyJL._SL1500_.jpg', status: 'active', rating: 4.2, maxStock: 100 },
                { id: '11', name: 'Perfume Masculino', description: 'Fragrância amadeirada sofisticada', category: 'beleza', price: 199.99, stock: 15, image: 'https://blog.mensmarket.com.br/wp-content/uploads/2019/05/perfumes-masculinos-importados-chanel-600x600.jpg', status: 'inactive', rating: 4.4, maxStock: 80 },
                { id: '12', name: 'Tablet Samsung Galaxy Tab', description: 'Tablet com tela de 10,5 polegadas', category: 'eletrônicos', price: 1599.99, stock: 9, image: 'https://tse4.mm.bing.net/th/id/OIP.QDawNPiNpD5ylRtSWIOOTQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.1, maxStock: 30 }
            ];
            this.saveProducts();
        }
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    filterProductsByCategory(category) {
        if (!category) return this.products;
        return this.products.filter(product => product.category === category);
    }

    sortProducts(products, sortBy) {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'name':
                return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            case 'price-asc':
                return sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            case 'price-desc':
                return sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            case 'stock-asc':
                return sortedProducts.sort((a, b) => a.stock - b.stock);
            case 'stock-desc':
                return sortedProducts.sort((a, b) => b.stock - a.stock);
            default:
                return sortedProducts;
        }
    }

    createProduct(productData) {
        const { name, category, price, stock } = productData;

        if (!name || !category || price === undefined || stock === undefined) {
            return { success: false, message: 'Nome, categoria, preço e estoque são obrigatórios.' };
        }
        if (price < 0 || stock < 0) {
            return { success: false, message: 'Preço и estoque não podem ser negativos.' };
        }

        const newProduct = {
            id: Date.now().toString(),
            name: name,
            description: productData.description || '',
            category: category,
            price: parseFloat(price),
            stock: parseInt(stock),
            image: productData.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
            status: productData.status || 'active',
            rating: 0,
            createdAt: new Date().toISOString()
        };

        this.products.unshift(newProduct); // Adiciona no início da lista
        this.saveProducts();

        return { success: true, message: 'Produto criado com sucesso!', product: newProduct };
    }

    validateStockIncrease(productId, increaseAmount) {
        const product = this.getProductById(productId);
        
        if (!product) {
            return { isValid: false, message: 'Produto não encontrado' };
        }

        if (product.status !== 'active') {
            return { isValid: false, message: 'Produto inativo: não é possível ajustar estoque' };
        }

        if (increaseAmount % 10 !== 0) {
            return { isValid: false, message: 'Acréscimo deve ser em lotes de 10 (10, 20, 30...)' };
        }

        if (increaseAmount <= 0) {
            return { isValid: false, message: 'Valor de acréscimo deve ser positivo' };
        }

        if (product.maxStock && (product.stock + increaseAmount) > product.maxStock) {
            return { 
                isValid: false, 
                message: `Operação ultrapassa o limite de estoque (máx. ${product.maxStock})` 
            };
        }

        return { isValid: true, message: 'Validação aprovada' };
    }

    increaseStock(productId, increaseAmount) {
        const validation = this.validateStockIncrease(productId, increaseAmount);
        
        if (!validation.isValid) {
            return { success: false, message: validation.message };
        }

        try {
            const product = this.getProductById(productId);
            const oldStock = product.stock;
            product.stock += increaseAmount;
            
            this.saveProducts();
            
            return { 
                success: true, 
                message: 'Estoque atualizado com sucesso',
                oldStock,
                newStock: product.stock,
                increaseAmount
            };
        } catch (error) {
            return { 
                success: false, 
                message: 'Falha ao atualizar estoque. Tente novamente.' 
            };
        }
    }

    getStockIncreaseOptions() {
        return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    getCategories() {
        const categories = [...new Set(this.products.map(product => product.category))];
        return categories.map(category => ({
            value: category,
            label: this.capitalizeFirst(category)
        }));
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Inicializar sistema de produtos
window.productManagement = new ProductManagement();
