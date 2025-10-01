// TriunfoShop - Enhanced JavaScript
class TriunfoShop {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.cart = (JSON.parse(localStorage.getItem('cart')) || []).map(item => ({
            ...item,
            quantity: isNaN(parseInt(item.quantity)) ? 1 : parseInt(item.quantity)
        }));
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.currentSearchTerm = '';
        this.currentFilters = {
            category: '',
            priceRange: '',
            sortBy: 'relevance'
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadProducts();
        this.updateCartCount();
        this.updateFavoritesCount();
        this.setupSearchSuggestions();
        this.setupFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', this.debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));
        
        searchBtn.addEventListener('click', () => {
            this.handleSearch(searchInput.value);
        });

        // Header dropdown categories
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('href').replace('#', '');
                this.filterByCategory(category);
            });
        });

        // Quick categories
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const category = card.getAttribute('href').replace('#', '');
                this.filterByCategory(category);
            });
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleView(e.target.dataset.view);
            });
        });

        // Newsletter
        const newsletterBtn = document.getElementById('newsletterBtn');
        newsletterBtn.addEventListener('click', () => {
            this.handleNewsletter();
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFilters');
        clearFiltersBtn.addEventListener('click', () => {
            this.clearFilters();
        });

        // Pagination
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        prevPageBtn.addEventListener('click', () => {
            this.changePage(this.currentPage - 1);
        });
        
        nextPageBtn.addEventListener('click', () => {
            this.changePage(this.currentPage + 1);
        });

        // Modal
        this.setupModal();
    }

    async loadProducts() {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';

        try {
            const response = await fetch('https://catalogo-products.pages.dev/api/products');
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }
            
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            
            this.populateCategories();
            this.renderProducts();
            this.updateProductsCount();
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.loadSampleProducts();
            // Adicionado para garantir que os produtos de exemplo sejam renderizados
            this.filteredProducts = [...this.products];
            this.populateCategories();
            this.renderProducts();
            this.updateProductsCount();
        } finally {
            loading.style.display = 'none';
        }
    }

    loadSampleProducts() {
        this.products = [
            { id: '1', name: 'Smartphone Samsung Galaxy S23', description: 'Smartphone premium com câmera de 50MP', category: 'eletrônicos', price: 2999.99, stock: 15, image: 'https://m.media-amazon.com/images/I/51B-CvsQ07L._AC_SX679_.jpg', status: 'active', isOffer: true, originalPrice: 3499.99, rating: 4.5 },
            { id: '2', name: 'Notebook Dell Inspiron 15', description: 'Notebook para trabalho e estudos', category: 'eletrônicos', price: 2499.99, stock: 8, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', status: 'active', rating: 4.3 },
            { id: '3', name: 'Camiseta Polo Masculina', description: 'Camiseta polo de algodão 100%', category: 'roupas', price: 89.99, stock: 25, image: 'https://cdn.dooca.store/946/products/pt4rix2psxqx5tiiolkkfwwqu9kj1mewowq3_1395x1980.jpg?v=1716475617', status: 'active', rating: 4.2 },
            { id: '4', name: 'Tênis Nike Air Max', description: 'Tênis esportivo confortável', category: 'esportes', price: 399.99, stock: 12, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', status: 'active', isOffer: true, originalPrice: 499.99, rating: 4.6 },
            { id: '5', name: 'Livro: JavaScript Moderno', description: 'Guia completo de JavaScript ES6+', category: 'livros', price: 79.99, stock: 30, image: 'https://a-static.mlcdn.com.br/800x560/typescript-o-javascript-moderno-para-criacao-de-aplicacoes/zambonibooks/61265/e08225b07350355b3b75c2b6232dadc6.jpeg', status: 'active', rating: 4.4 },
            { id: '6', name: 'Creme Hidratante Facial', description: 'Creme hidratante para todos os tipos de pele', category: 'beleza', price: 45.99, stock: 20, image: 'https://bemestarlifeloja.com.br/imagensProdutos/HidratanteFacial1.webp', status: 'active', rating: 4.1 },
            { id: '7', name: 'Fone de Ouvido Bluetooth', description: 'Fone sem fio com cancelamento de ruído', category: 'eletrônicos', price: 299.99, stock: 18, image: 'https://m.media-amazon.com/images/I/51lsPHwhdmL._AC_SY300_SX300_QL70_ML2_.jpg', status: 'active', rating: 4.3 },
            { id: '8', name: 'Camiseta Feminina Estampada', description: 'Camiseta leve com estampas modernas', category: 'roupas', price: 59.99, stock: 35, image: 'https://d3vnyi5j6ba1mc.cloudfront.net/Custom/Content/Products/23/79/2379435_camiseta-feminina-reta-estampada-manga-curta-340106783_l1_638868629126699170.webp', status: 'active', rating: 4.0 },
            { id: '9', name: 'Bola de Futebol Adidas', description: 'Bola oficial para treinos e partidas', category: 'esportes', price: 129.99, stock: 10, image: 'https://www.sportsdirect.com/images/products/82121001_l.jpg', status: 'active', rating: 4.5 },
            { id: '10', name: 'Livro: Aprenda Python', description: 'Livro introdutório de Python', category: 'livros', price: 69.99, stock: 28, image: 'https://m.media-amazon.com/images/I/71wZU05TyJL._SL1500_.jpg', status: 'active', rating: 4.2 },
            { id: '11', name: 'Perfume Masculino', description: 'Fragrância amadeirada sofisticada', category: 'beleza', price: 199.99, stock: 15, image: 'https://blog.mensmarket.com.br/wp-content/uploads/2019/05/perfumes-masculinos-importados-chanel-600x600.jpg', status: 'active', rating: 4.4 },
            { id: '12', name: 'Tablet Samsung Galaxy Tab', description: 'Tablet com tela de 10,5 polegadas', category: 'eletrônicos', price: 1599.99, stock: 9, image: 'https://tse4.mm.bing.net/th/id/OIP.QDawNPiNpD5ylRtSWIOOTQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.1 },
            { id: '13', name: 'Calça Jeans Masculina', description: 'Calça jeans confortável e resistente', category: 'roupas', price: 129.99, stock: 22, image: 'https://tse4.mm.bing.net/th/id/OIP.wRwL50wzHk4-POfcfkCWuwHaKX?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.3 },
            { id: '14', name: 'Tênis Adidas Running', description: 'Tênis para corrida com amortecimento', category: 'esportes', price: 349.99, stock: 14, image: 'https://tse1.mm.bing.net/th/id/OIP.YayBdNwJUnzRexMHGaFSEAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.5 },
            { id: '15', name: 'Livro: CSS e HTML Moderno', description: 'Aprenda a criar sites modernos', category: 'livros', price: 79.99, stock: 30, image: 'https://http2.mlstatic.com/D_NQ_NP_860203-MLB44930103102_022021-F.jpg', status: 'active', rating: 4.2 },
            { id: '16', name: 'Batom Hidratante', description: 'Batom com cores vibrantes', category: 'beleza', price: 29.99, stock: 40, image: 'https://tse3.mm.bing.net/th/id/OIP.6XA58Hi8t8Le6sXsVPrmDwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.0 },
            { id: '17', name: 'Monitor LG 24"', description: 'Monitor Full HD para escritório', category: 'eletrônicos', price: 799.99, stock: 10, image: 'https://tse3.mm.bing.net/th/id/OIP.D104muCPgGbdTSR8CEwvmAHaE6?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.4 },
            { id: '18', name: 'Blusa Feminina de Tricô', description: 'Blusa confortável para o inverno', category: 'roupas', price: 99.99, stock: 20, image: 'https://tse1.mm.bing.net/th/id/OIP.w1NwX7Zzbz2wEH18MNzgOgHaLD?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.1 },
            { id: '19', name: 'Raquete de Tênis Wilson', description: 'Raquete profissional para treinos', category: 'esportes', price: 399.99, stock: 7, image: 'https://tse3.mm.bing.net/th/id/OIP.ISSAoXIZ5TQaCauDNXPrwQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.6 },
            { id: '20', name: 'Livro: Algoritmos em Java', description: 'Aprenda algoritmos e lógica de programação', category: 'livros', price: 89.99, stock: 25, image: 'https://m.media-amazon.com/images/I/610D1O8WWOL._SY425_.jpg', status: 'active', rating: 4.3 },
            { id: '21', name: 'Creme Corporal', description: 'Hidratação para todos os tipos de pele', category: 'beleza', price: 39.99, stock: 30, image: 'https://down-br.img.susercontent.com/file/880a969ca536cad23aceb24a571534d1', status: 'active', rating: 4.2 },
            { id: '22', name: 'Smartwatch Xiaomi', description: 'Relógio inteligente com monitoramento de saúde', category: 'eletrônicos', price: 499.99, stock: 12, image: 'https://m.media-amazon.com/images/I/51IGruZ+mGL._AC_SL1000_.jpg', status: 'active', isOffer: true, originalPrice: 599.99, rating: 4.4 },
            { id: '23', name: 'Shorts Masculino Esportivo', description: 'Shorts leve para treinos e corridas', category: 'roupas', price: 69.99, stock: 25, image: 'https://tse2.mm.bing.net/th/id/OIP.NptVMDSWfQnXVsdCcr2m8gHaJo?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.1 },
            { id: '24', name: 'Bola de Basquete Spalding', description: 'Bola oficial para quadra', category: 'esportes', price: 149.99, stock: 10, image: 'https://m.media-amazon.com/images/I/71zkIYTSiyL._AC_SY300_SX300_QL70_ML2_.jpg', status: 'active', rating: 4.5 },
            { id: '25', name: 'Livro: React do Zero', description: 'Aprenda React passo a passo', category: 'livros', price: 99.99, stock: 20, image: 'https://www.topleituras.com/livros/react-native-iniciantes-desenvolva-apps-zero-805f-capa.jpg', status: 'active', rating: 4.3 },
            { id: '26', name: 'Shampoo Hidratante', description: 'Shampoo para todos os tipos de cabelo', category: 'beleza', price: 34.99, stock: 35, image: 'https://tse4.mm.bing.net/th/id/OIP.yZg6Mvd7wtn96tAEi6L5NAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.0 },
            { id: '27', name: 'Câmera Canon EOS', description: 'Câmera profissional para fotografia', category: 'eletrônicos', price: 4499.99, stock: 5, image: 'https://tse1.mm.bing.net/th/id/OIP.2R7-GOPwjhm90vSoC7DxCwHaFn?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.7 },
            { id: '28', name: 'Vestido Feminino Casual', description: 'Vestido leve e confortável', category: 'roupas', price: 149.99, stock: 18, image: 'https://tse3.mm.bing.net/th/id/OIP.1Nt59nqV0XyJyQ6rQfcfbAHaNK?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.2 },
            { id: '29', name: 'Tênis Esportivo Puma', description: 'Tênis para treinos e corrida', category: 'esportes', price: 299.99, stock: 12, image: 'https://cdnv2.moovin.com.br/simiaocalcados/imagens/produtos/det/tenis-esportivo-puma-st-runner-v2-mesh-bdp-375571-090b78afbd8265e19395ac696671ac09.jpg', status: 'active', rating: 4.3 },
            { id: '30', name: 'Livro: HTML5 e CSS3 Avançado', description: 'Crie sites modernos e responsivos', category: 'livros', price: 79.99, stock: 30, image: 'https://m.media-amazon.com/images/I/61025uGTYlL._SY466_.jpg', status: 'active', rating: 4.4 },
            { id: '31', name: 'Batom Matte', description: 'Batom com acabamento matte', category: 'beleza', price: 29.99, stock: 40, image: 'https://tse2.mm.bing.net/th/id/OIP.tlEGT3LLXUUmlUtUajPdiAHaHa?w=2656&h=2656&rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.1 },
            { id: '32', name: 'Fone de Ouvido JBL', description: 'Fone sem fio resistente à água', category: 'eletrônicos', price: 349.99, stock: 15, image: 'https://tse3.mm.bing.net/th/id/OIP.xYKEbKeiv-46mogkGiHzTAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.5 },
            { id: '33', name: 'Camisa Social Masculina', description: 'Camisa elegante para o trabalho', category: 'roupas', price: 129.99, stock: 20, image: 'https://www.ricardoalmeida.com.br/cdn/shop/files/010_000060_01_0020SE_15231010_53994_1.png?v=1758979842', status: 'active', rating: 4.3 },
            { id: '34', name: 'Raquete de Badminton', description: 'Raquete leve para iniciantes', category: 'esportes', price: 79.99, stock: 15, image: 'https://static.netshoes.com.br/produtos/raquete-de-badminton-yonex-b4000-vermelha/60/595-0564-060/595-0564-060_zoom1.jpg?ims=1088x', status: 'active', rating: 4.0 },
            { id: '35', name: 'Livro: Python Avançado', description: 'Aprenda conceitos avançados de Python', category: 'livros', price: 99.99, stock: 25, image: 'https://www.topleituras.com/livros/programacao-orientada-objetos-python-basico-avancado-5f17-capa.jpg', status: 'active', rating: 4.4 },
            { id: '36', name: 'Máscara Facial Hidratante', description: 'Máscara nutritiva para a pele', category: 'beleza', price: 39.99, stock: 30, image: 'https://tse1.mm.bing.net/th/id/OIP.p0SgU7ak38mYdAErjueLPQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.2 },
            { id: '37', name: 'Notebook HP Pavilion', description: 'Notebook potente para estudos e trabalho', category: 'eletrônicos', price: 2799.99, stock: 7, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', status: 'active', rating: 4.3 },
            { id: '38', name: 'Blusa Feminina Casual', description: 'Blusa confortável para o dia a dia', category: 'roupas', price: 99.99, stock: 20, image: 'https://tse1.mm.bing.net/th/id/OIP.fwuas-Ih5Z3cTysEnMFryAHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.1 },
            { id: '39', name: 'Bola de Vôlei', description: 'Bola oficial para treinos e jogos', category: 'esportes', price: 129.99, stock: 12, image: 'https://carrefourbr.vtexassets.com/arquivos/ids/202802345/image-0.jpg?v=638937720783630000', status: 'active', rating: 4.4 },
            { id: '40', name: 'Livro: JavaScript para Iniciantes', description: 'Aprenda JavaScript do zero', category: 'livros', price: 79.99, stock: 30, image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1689509663i/191007524.jpg', status: 'active', rating: 4.2 },
            { id: '41', name: 'Creme Anti-Idade', description: 'Creme facial para prevenção de rugas', category: 'beleza', price: 59.99, stock: 20, image: 'https://promoon.com.br/wp-content/uploads/2024/05/kit-1-14.png', status: 'active', rating: 4.3 },
            { id: '42', name: 'Tablet Apple iPad', description: 'Tablet com iOS e tela Retina', category: 'eletrônicos', price: 3499.99, stock: 6, image: 'https://tse1.mm.bing.net/th/id/OIP.kdTyWTQaNTiR8rixXtE-vAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.6 },
            { id: '43', name: 'Calça Legging Feminina', description: 'Legging confortável para exercícios', category: 'roupas', price: 79.99, stock: 25, image: 'https://tse4.mm.bing.net/th/id/OIP.FrNVfaeqavmEtNrmYEftVQHaLH?w=2000&h=3000&rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.0 },
            { id: '44', name: 'Tênis Esportivo Asics', description: 'Tênis leve para corrida', category: 'esportes', price: 319.99, stock: 10, image: 'https://oscarcalcados.vtexassets.com/arquivos/ids/5109132/Tenis-Esportivo-Asics-Gel-Shogun-5-Preto-e-Laranja-Masculino.jpg?v=638330541008600000', status: 'active', rating: 4.4 },
            { id: '45', name: 'Livro: CSS Avançado', description: 'Aprenda CSS para sites modernos', category: 'livros', price: 79.99, stock: 30, image: 'https://combofrontend.com.br/wp-content/uploads/2023/05/rabbit3d.png', status: 'active', rating: 4.3 },
            { id: '46', name: 'Batom Gloss', description: 'Batom com brilho intenso', category: 'beleza', price: 29.99, stock: 40, image: 'https://http2.mlstatic.com/D_NQ_NP_889923-MLB46997285415_082021-F.jpg', status: 'active', rating: 4.1 },
            { id: '47', name: 'Câmera Sony Alpha', description: 'Câmera mirrorless profissional', category: 'eletrônicos', price: 4999.99, stock: 5, image: 'https://th.bing.com/th/id/R.628bf85d52c7eb9456e3d319b77445fe?rik=skfOydlLRQfAcw&pid=ImgRaw&r=0', status: 'active', rating: 4.7 },
            { id: '48', name: 'Vestido Feminino de Festa', description: 'Vestido elegante para ocasiões especiais', category: 'roupas', price: 249.99, stock: 12, image: 'https://www.dicasdemulher.com.br/wp-content/uploads/2018/11/vestido-de-festa-2019-104.jpg', status: 'active', rating: 4.5 },
            { id: '49', name: 'Raquete de Squash', description: 'Raquete para prática de squash', category: 'esportes', price: 199.99, stock: 8, image: 'https://tse4.mm.bing.net/th/id/OIP.8v9AD2Ydf6bX05qFgwNc6AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', status: 'active', rating: 4.2 },
            { id: '50', name: 'Livro: Node.js Avançado', description: 'Aprenda Node.js para back-end', category: 'livros', price: 99.99, stock: 20, image: 'https://m.media-amazon.com/images/I/71Hks+N9ESL._SL1500_.jpg', status: 'active', rating: 4.4 }
        ];

        this.filteredProducts = [...this.products];
        
        this.populateCategories();
        this.renderProducts();
        this.updateProductsCount();
        
        console.log('Carregados 50 produtos cadastrados');
    }

    populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const categories = [...new Set(this.products.map(p => p.category))];
        
        // Clear existing options except the first one
        categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.capitalizeFirst(category);
            categoryFilter.appendChild(option);
        });
    }

    setupFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceRange = document.getElementById('priceRange');
        const sortBy = document.getElementById('sortBy');

        [categoryFilter, priceRange, sortBy].forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        // Update current filters
        this.currentFilters.category = document.getElementById('categoryFilter').value;
        this.currentFilters.priceRange = document.getElementById('priceRange').value;
        this.currentFilters.sortBy = document.getElementById('sortBy').value;

        // Start with all products
        let filtered = [...this.products];

        // Apply search filter first
        if (this.currentSearchTerm.trim()) {
            const searchTerm = this.currentSearchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => product.category === this.currentFilters.category);
        }
        
        // Apply price range filter
        if (this.currentFilters.priceRange) {
            const priceRangeParts = this.currentFilters.priceRange.split('-');
            let min, max;
            
            if (priceRangeParts.length === 2) {
                min = priceRangeParts[0] === '+' ? Infinity : parseInt(priceRangeParts[0]);
                max = priceRangeParts[1] === '+' ? Infinity : parseInt(priceRangeParts[1]);
            } else if (this.currentFilters.priceRange.endsWith('+')) {
                min = parseInt(this.currentFilters.priceRange.replace('+', ''));
                max = Infinity;
            } else {
                min = 0;
                max = parseInt(this.currentFilters.priceRange);
            }
            
            filtered = filtered.filter(product => {
                const price = parseFloat(product.price);
                return price >= min && (max === Infinity || price <= max);
            });
        }
        

        this.filteredProducts = filtered;

        // Sort products
        this.sortProducts(this.currentFilters.sortBy);
        
        console.log('Filtros aplicados:', {
            searchTerm: this.currentSearchTerm,
            filters: this.currentFilters,
            totalProducts: this.products.length,
            filteredProducts: this.filteredProducts.length
        });
        
        this.currentPage = 1;
        this.renderProducts();
        this.updateProductsCount();
        this.updatePagination();
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-asc':
                this.filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default: // relevance
                // Keep original order or implement relevance algorithm
                break;
        }
    }

    handleSearch(query) {
        this.currentSearchTerm = query;
        this.applyFilters(); // This will apply both search and filters
    }

    filterByCategory(category) {
        // Update the category filter dropdown
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        
        // Update current filters
        this.currentFilters.category = category;
        this.applyFilters();
        
        // Scroll to products section
        document.querySelector('.products').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Show feedback
        const categoryName = this.capitalizeFirst(category);
    }

    setupSearchSuggestions() {
        const searchInput = document.getElementById('searchInput');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });
        
        searchInput.addEventListener('blur', (e) => {
            // Delay to allow clicking on suggestions
            setTimeout(() => {
                suggestionsContainer.style.display = 'none';
            }, 200);
        });
    }

    showSearchSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        const popularSearches = [
            'smartphone', 'notebook', 'fone de ouvido', 'smartwatch',
            'câmera', 'tablet', 'mouse', 'teclado'
        ];
        
        suggestionsContainer.innerHTML = popularSearches.map(term => 
            `<div class="suggestion-item" onclick="this.handleSearchSuggestion('${term}')">${term}</div>`
        ).join('');
        
        suggestionsContainer.style.display = 'block';
    }

    handleSearchSuggestion(term) {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = term;
        this.currentSearchTerm = term;
        this.applyFilters();
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Tente ajustar os filtros ou fazer uma nova busca</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners to product cards
        productsGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-actions')) {
                    this.openProductModal(product);
                }
            });
        });

        // Add event listeners to action buttons
        productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.addToCart(productId);
            });
        });

        productsGrid.querySelectorAll('.add-to-favorites').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.toggleFavorite(productId);
            });
        });
    }

    createProductCard(product) {
        const isInCart = this.cart.some(item => item.id === product.id);
        const isFavorite = this.favorites.includes(product.id);
        const discount = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image || this.getDefaultImage(product.category)}" 
                         alt="${product.name}" 
                         onerror="this.src='${this.getDefaultImage(product.category)}'">
                    <div class="product-badges">
                        ${product.isOffer ? '<span class="product-badge sale">Oferta</span>' : ''}
                        ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
                        ${product.isNew ? '<span class="product-badge new">Novo</span>' : ''}
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${this.capitalizeFirst(product.category)}</p>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStars(product.rating || 4.2)}
                        </div>
                        <span class="rating-text">(${product.rating || 4.2}) • ${Math.floor(Math.random() * 200) + 50} avaliações</span>
                    </div>
                    <div class="product-price">
                        <span class="price">R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</span>
                        ${product.originalPrice ? 
                            `<span class="price-original">R$ ${parseFloat(product.originalPrice).toFixed(2).replace('.', ',')}</span>` : 
                            ''
                        }
                    </div>
                    <div class="product-stock">
                        Estoque: ${product.stock} unidades
                    </div>
                    <div class="product-actions">
                        <button class="btn-primary add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            ${isInCart ? 'No Carrinho' : 'Adicionar'}
                        </button>
                        <button class="btn-favorite add-to-favorites ${isFavorite ? 'active' : ''}" 
                                data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    getDefaultImage(category) {
        const defaultImages = {
            'electronics': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
            'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
            'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
            'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
            'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
            'books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
        };
        
        return defaultImages[category] || defaultImages['electronics'];
    }

    toggleView(view) {
        this.currentView = view;
        const productsGrid = document.getElementById('productsGrid');
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        productsGrid.classList.toggle('list-view', view === 'list');
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderProducts();
        this.updatePagination();
        
        // Scroll to top of products section
        document.querySelector('.products').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageNumbers = document.getElementById('pageNumbers');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        // Generate page numbers
        let pageNumbersHtml = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbersHtml += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="triunfoShop.changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        pageNumbers.innerHTML = pageNumbersHtml;
    }

    updateProductsCount() {
        const countElement = document.getElementById('productsCount');
        const count = this.filteredProducts.length;
        countElement.textContent = `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity = isNaN(parseInt(existingItem.quantity)) ? 2 : parseInt(existingItem.quantity) + 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.renderProducts(); // Update button state
    }

    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(productId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.renderProducts(); // Update button state
    }

    updateCartCount() {
    const cartCount = this.cart.reduce((total, item) => total + (isNaN(parseInt(item.quantity)) ? 0 : parseInt(item.quantity)), 0);
    document.querySelector('.cart-count').textContent = cartCount;
    }

    updateFavoritesCount() {
        // Update favorites button if needed
        const favoritesBtn = document.querySelector('.favorites-btn');
        if (this.favorites.length > 0) {
            favoritesBtn.style.color = '#e74c3c';
        } else {
            favoritesBtn.style.color = 'white';
        }
    }

    clearFilters() {
        document.getElementById('categoryFilter').value = '';
        document.getElementById('priceRange').value = '';
        document.getElementById('sortBy').value = 'relevance';
        document.getElementById('searchInput').value = '';
        
        this.currentSearchTerm = '';
        this.currentFilters = {
            category: '',
            priceRange: '',
            sortBy: 'relevance'
        };
        
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.renderProducts();
        this.updateProductsCount();
        this.updatePagination();
    }

    setupModal() {
        const modal = document.getElementById('productModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    openProductModal(product) {
        const modal = document.getElementById('productModal');
        const modalImage = document.getElementById('modalProductImage');
        const modalName = document.getElementById('modalProductName');
        const modalDescription = document.getElementById('modalProductDescription');
        const modalPrice = document.getElementById('modalProductPrice');
        const modalPriceOriginal = document.getElementById('modalProductPriceOriginal');
        const modalStock = document.getElementById('modalProductStock');
        const modalBadges = document.getElementById('modalProductBadges');
        
        modalImage.src = product.image || this.getDefaultImage(product.category);
        modalImage.alt = product.name;
        modalName.textContent = product.name;
        modalDescription.textContent = product.description || 'Descrição não disponível.';
        modalPrice.textContent = `R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}`;
        modalStock.textContent = `${product.stock} unidades`;
        
        // Price original
        if (product.originalPrice) {
            modalPriceOriginal.textContent = `R$ ${parseFloat(product.originalPrice).toFixed(2).replace('.', ',')}`;
            modalPriceOriginal.style.display = 'inline';
        } else {
            modalPriceOriginal.style.display = 'none';
        }
        
        // Badges
        const discount = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        modalBadges.innerHTML = `
            ${product.isOffer ? '<span class="product-badge sale">Oferta</span>' : ''}
            ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
            ${product.isNew ? '<span class="product-badge new">Novo</span>' : ''}
        `;
        
        // Update action buttons
        const buyBtn = document.getElementById('buyBtn');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
        
        const isInCart = this.cart.some(item => item.id === product.id);
        const isFavorite = this.favorites.includes(product.id);
        
        addToCartBtn.innerHTML = `<i class="fas fa-${isInCart ? 'check' : 'plus'}"></i> ${isInCart ? 'No Carrinho' : 'Adicionar ao Carrinho'}`;
        addToFavoritesBtn.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite ? 'Favoritado' : 'Favoritar'}`;
        addToFavoritesBtn.classList.toggle('active', isFavorite);
        
        // Event listeners
        buyBtn.onclick = () => {
            this.addToCart(product.id);
            modal.style.display = 'none';
        };
        
        addToCartBtn.onclick = () => {
            this.addToCart(product.id);
        };
        
        addToFavoritesBtn.onclick = () => {
            this.toggleFavorite(product.id);
        };
        
        modal.style.display = 'block';
    }

    handleNewsletter() {
        const email = document.getElementById('newsletterEmail').value;
        
        if (!this.isValidEmail(email)) {
            return;
        }
        
        // Simulate newsletter subscription
        document.getElementById('newsletterEmail').value = '';
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    debounce(func, wait) {
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
}

// Initialize the application
const triunfoShop = new TriunfoShop();

// Make handleSearchSuggestion available globally
window.handleSearchSuggestion = (term) => {
    triunfoShop.handleSearchSuggestion(term);
};
