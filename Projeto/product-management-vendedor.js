// product-management-vendedor.js
// Script para Gestão de Produtos (Vendedor) - Consulta e acréscimo de estoque em múltiplos de 10

// Simulação de produtos (substitua por integração real com backend/MySQL)
const produtos = [
    { id: 1, nome: 'Smartphone Samsung Galaxy S23', descricao: 'Smartphone premium com câmera de 50MP', categoria: 'eletrônicos', preco: 2999.99, estoque: 15, imagem: 'https://m.media-amazon.com/images/I/51B-CvsQ07L._AC_SX679_.jpg', ativo: true, limiteMax: 100 },
    { id: 2, nome: 'Notebook Dell Inspiron 15', descricao: 'Notebook para trabalho e estudos', categoria: 'eletrônicos', preco: 2499.99, estoque: 8, imagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', ativo: true, limiteMax: 50 },
    { id: 3, nome: 'Camiseta Polo Masculina', descricao: 'Camiseta polo de algodão 100%', categoria: 'roupas', preco: 89.99, estoque: 25, imagem: 'https://cdn.dooca.store/946/products/pt4rix2psxqx5tiiolkkfwwqu9kj1mewowq3_1395x1980.jpg?v=1716475617', ativo: true, limiteMax: 200 },
    { id: 4, nome: 'Tênis Nike Air Max', descricao: 'Tênis esportivo confortável', categoria: 'esportes', preco: 399.99, estoque: 12, imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', ativo: true, limiteMax: 80 },
    { id: 5, nome: 'Livro: JavaScript Moderno', descricao: 'Guia completo de JavaScript ES6+', categoria: 'livros', preco: 79.99, estoque: 30, imagem: 'https://a-static.mlcdn.com.br/800x560/typescript-o-javascript-moderno-para-criacao-de-aplicacoes/zambonibooks/61265/e08225b07350355b3b75c2b6232dadc6.jpeg', ativo: true, limiteMax: 150 },
    { id: 6, nome: 'Creme Hidratante Facial', descricao: 'Creme hidratante para todos os tipos de pele', categoria: 'beleza', preco: 45.99, estoque: 20, imagem: 'https://bemestarlifeloja.com.br/imagensProdutos/HidratanteFacial1.webp', ativo: true, limiteMax: 100 },
    { id: 7, nome: 'Fone de Ouvido Bluetooth', descricao: 'Fone sem fio com cancelamento de ruído', categoria: 'eletrônicos', preco: 299.99, estoque: 18, imagem: 'https://m.media-amazon.com/images/I/51lsPHwhdmL._AC_SY300_SX300_QL70_ML2_.jpg', ativo: true, limiteMax: 60 },
    { id: 8, nome: 'Camiseta Feminina Estampada', descricao: 'Camiseta leve com estampas modernas', categoria: 'roupas', preco: 59.99, estoque: 35, imagem: 'https://d3vnyi5j6ba1mc.cloudfront.net/Custom/Content/Products/23/79/2379435_camiseta-feminina-reta-estampada-manga-curta-340106783_l1_638868629126699170.webp', ativo: true, limiteMax: 120 },
    { id: 9, nome: 'Bola de Futebol Adidas', descricao: 'Bola oficial para treinos e partidas', categoria: 'esportes', preco: 129.99, estoque: 10, imagem: 'https://www.sportsdirect.com/images/products/82121001_l.jpg', ativo: true, limiteMax: 50 },
    { id: 10, nome: 'Livro: Aprenda Python', descricao: 'Livro introdutório de Python', categoria: 'livros', preco: 69.99, estoque: 28, imagem: 'https://m.media-amazon.com/images/I/71wZU05TyJL._SL1500_.jpg', ativo: true, limiteMax: 100 },
    { id: 11, nome: 'Perfume Masculino', descricao: 'Fragrância amadeirada sofisticada', categoria: 'beleza', preco: 199.99, estoque: 15, imagem: 'https://blog.mensmarket.com.br/wp-content/uploads/2019/05/perfumes-masculinos-importados-chanel-600x600.jpg', ativo: false, limiteMax: 80 },
    { id: 12, nome: 'Tablet Samsung Galaxy Tab', descricao: 'Tablet com tela de 10,5 polegadas', categoria: 'eletrônicos', preco: 1599.99, estoque: 9, imagem: 'https://tse4.mm.bing.net/th/id/OIP.QDawNPiNpD5ylRtSWIOOTQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 30 },
    { id: 13, nome: 'Calça Jeans Masculina', descricao: 'Calça jeans confortável e resistente', categoria: 'roupas', preco: 129.99, estoque: 22, imagem: 'https://tse4.mm.bing.net/th/id/OIP.wRwL50wzHk4-POfcfkCWuwHaKX?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 100 },
    { id: 14, nome: 'Tênis Adidas Running', descricao: 'Tênis para corrida com amortecimento', categoria: 'esportes', preco: 349.99, estoque: 14, imagem: 'https://tse1.mm.bing.net/th/id/OIP.YayBdNwJUnzRexMHGaFSEAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 70 },
    { id: 15, nome: 'Livro: CSS e HTML Moderno', descricao: 'Aprenda a criar sites modernos', categoria: 'livros', preco: 79.99, estoque: 30, imagem: 'https://http2.mlstatic.com/D_NQ_NP_860203-MLB44930103102_022021-F.jpg', ativo: true, limiteMax: 150 },
    { id: 16, nome: 'Batom Hidratante', descricao: 'Batom com cores vibrantes', categoria: 'beleza', preco: 29.99, estoque: 40, imagem: 'https://tse3.mm.bing.net/th/id/OIP.6XA58Hi8t8Le6sXsVPrmDwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 200 },
    { id: 17, nome: 'Monitor LG 24"', descricao: 'Monitor Full HD para escritório', categoria: 'eletrônicos', preco: 799.99, estoque: 10, imagem: 'https://tse3.mm.bing.net/th/id/OIP.D104muCPgGbdTSR8CEwvmAHaE6?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 40 },
    { id: 18, nome: 'Blusa Feminina de Tricô', descricao: 'Blusa confortável para o inverno', categoria: 'roupas', preco: 99.99, estoque: 20, imagem: 'https://tse1.mm.bing.net/th/id/OIP.w1NwX7Zzbz2wEH18MNzgOgHaLD?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 80 },
    { id: 19, nome: 'Raquete de Tênis Wilson', descricao: 'Raquete profissional para treinos', categoria: 'esportes', preco: 399.99, estoque: 7, imagem: 'https://tse3.mm.bing.net/th/id/OIP.ISSAoXIZ5TQaCauDNXPrwQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 30 },
    { id: 20, nome: 'Livro: Algoritmos em Java', descricao: 'Aprenda algoritmos e lógica de programação', categoria: 'livros', preco: 89.99, estoque: 25, imagem: 'https://m.media-amazon.com/images/I/610D1O8WWOL._SY425_.jpg', ativo: true, limiteMax: 100 },
    { id: 21, nome: 'Creme Corporal', descricao: 'Hidratação para todos os tipos de pele', categoria: 'beleza', preco: 39.99, estoque: 30, imagem: 'https://down-br.img.susercontent.com/file/880a969ca536cad23aceb24a571534d1', ativo: true, limiteMax: 150 },
    { id: 22, nome: 'Smartwatch Xiaomi', descricao: 'Relógio inteligente com monitoramento de saúde', categoria: 'eletrônicos', preco: 499.99, estoque: 12, imagem: 'https://m.media-amazon.com/images/I/51IGruZ+mGL._AC_SL1000_.jpg', ativo: true, limiteMax: 50 },
    { id: 23, nome: 'Shorts Masculino Esportivo', descricao: 'Shorts leve para treinos e corridas', categoria: 'roupas', preco: 69.99, estoque: 25, imagem: 'https://tse2.mm.bing.net/th/id/OIP.NptVMDSWfQnXVsdCcr2m8gHaJo?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 100 },
    { id: 24, nome: 'Bola de Basquete Spalding', descricao: 'Bola oficial para quadra', categoria: 'esportes', preco: 149.99, estoque: 10, imagem: 'https://m.media-amazon.com/images/I/71zkIYTSiyL._AC_SY300_SX300_QL70_ML2_.jpg', ativo: true, limiteMax: 40 },
    { id: 25, nome: 'Livro: React do Zero', descricao: 'Aprenda React passo a passo', categoria: 'livros', preco: 99.99, estoque: 20, imagem: 'https://www.topleituras.com/livros/react-native-iniciantes-desenvolva-apps-zero-805f-capa.jpg', ativo: true, limiteMax: 80 },
    { id: 26, nome: 'Shampoo Hidratante', descricao: 'Shampoo para todos os tipos de cabelo', categoria: 'beleza', preco: 34.99, estoque: 35, imagem: 'https://tse4.mm.bing.net/th/id/OIP.yZg6Mvd7wtn96tAEi6L5NAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 150 },
    { id: 27, nome: 'Câmera Canon EOS', descricao: 'Câmera profissional para fotografia', categoria: 'eletrônicos', preco: 4499.99, estoque: 5, imagem: 'https://tse1.mm.bing.net/th/id/OIP.2R7-GOPwjhm90vSoC7DxCwHaFn?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 20 },
    { id: 28, nome: 'Vestido Feminino Casual', descricao: 'Vestido leve e confortável', categoria: 'roupas', preco: 149.99, estoque: 18, imagem: 'https://tse3.mm.bing.net/th/id/OIP.1Nt59nqV0XyJyQ6rQfcfbAHaNK?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 70 },
    { id: 29, nome: 'Tênis Esportivo Puma', descricao: 'Tênis para treinos e corrida', categoria: 'esportes', preco: 299.99, estoque: 12, imagem: 'https://cdnv2.moovin.com.br/simiaocalcados/imagens/produtos/det/tenis-esportivo-puma-st-runner-v2-mesh-bdp-375571-090b78afbd8265e19395ac696671ac09.jpg', ativo: true, limiteMax: 60 },
    { id: 30, nome: 'Livro: HTML5 e CSS3 Avançado', descricao: 'Crie sites modernos e responsivos', categoria: 'livros', preco: 79.99, estoque: 30, imagem: 'https://m.media-amazon.com/images/I/61025uGTYlL._SY466_.jpg', ativo: true, limiteMax: 120 },
    { id: 31, nome: 'Batom Matte', descricao: 'Batom com acabamento matte', categoria: 'beleza', preco: 29.99, estoque: 40, imagem: 'https://tse2.mm.bing.net/th/id/OIP.tlEGT3LLXUUmlUtUajPdiAHaHa?w=2656&h=2656&rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 200 },
    { id: 32, nome: 'Fone de Ouvido JBL', descricao: 'Fone sem fio resistente à água', categoria: 'eletrônicos', preco: 349.99, estoque: 15, imagem: 'https://tse3.mm.bing.net/th/id/OIP.xYKEbKeiv-46mogkGiHzTAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 60 },
    { id: 33, nome: 'Camisa Social Masculina', descricao: 'Camisa elegante para o trabalho', categoria: 'roupas', preco: 129.99, estoque: 20, imagem: 'https://www.ricardoalmeida.com.br/cdn/shop/files/010_000060_01_0020SE_15231010_53994_1.png?v=1758979842', ativo: true, limiteMax: 80 },
    { id: 34, nome: 'Raquete de Badminton', descricao: 'Raquete leve para iniciantes', categoria: 'esportes', preco: 79.99, estoque: 15, imagem: 'https://static.netshoes.com.br/produtos/raquete-de-badminton-yonex-b4000-vermelha/60/595-0564-060/595-0564-060_zoom1.jpg?ims=1088x', ativo: true, limiteMax: 50 },
    { id: 35, nome: 'Livro: Python Avançado', descricao: 'Aprenda conceitos avançados de Python', categoria: 'livros', preco: 99.99, estoque: 25, imagem: 'https://www.topleituras.com/livros/programacao-orientada-objetos-python-basico-avancado-5f17-capa.jpg', ativo: true, limiteMax: 100 },
    { id: 36, nome: 'Máscara Facial Hidratante', descricao: 'Máscara nutritiva para a pele', categoria: 'beleza', preco: 39.99, estoque: 30, imagem: 'https://tse1.mm.bing.net/th/id/OIP.p0SgU7ak38mYdAErjueLPQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 150 },
    { id: 37, nome: 'Notebook HP Pavilion', descricao: 'Notebook potente para estudos e trabalho', categoria: 'eletrônicos', preco: 2799.99, estoque: 7, imagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', ativo: true, limiteMax: 30 },
    { id: 38, nome: 'Blusa Feminina Casual', descricao: 'Blusa confortável para o dia a dia', categoria: 'roupas', preco: 99.99, estoque: 20, imagem: 'https://tse1.mm.bing.net/th/id/OIP.fwuas-Ih5Z3cTysEnMFryAHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 80 },
    { id: 39, nome: 'Bola de Vôlei', descricao: 'Bola oficial para treinos e jogos', categoria: 'esportes', preco: 129.99, estoque: 12, imagem: 'https://carrefourbr.vtexassets.com/arquivos/ids/202802345/image-0.jpg?v=638937720783630000', ativo: true, limiteMax: 50 },
    { id: 40, nome: 'Livro: JavaScript para Iniciantes', descricao: 'Aprenda JavaScript do zero', categoria: 'livros', preco: 79.99, estoque: 30, imagem: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1689509663i/191007524.jpg', ativo: true, limiteMax: 120 },
    { id: 41, nome: 'Creme Anti-Idade', descricao: 'Creme facial para prevenção de rugas', categoria: 'beleza', preco: 59.99, estoque: 20, imagem: 'https://promoon.com.br/wp-content/uploads/2024/05/kit-1-14.png', ativo: true, limiteMax: 100 },
    { id: 42, nome: 'Tablet Apple iPad', descricao: 'Tablet com iOS e tela Retina', categoria: 'eletrônicos', preco: 3499.99, estoque: 6, imagem: 'https://tse1.mm.bing.net/th/id/OIP.kdTyWTQaNTiR8rixXtE-vAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 25 },
    { id: 43, nome: 'Calça Legging Feminina', descricao: 'Legging confortável para exercícios', categoria: 'roupas', preco: 79.99, estoque: 25, imagem: 'https://tse4.mm.bing.net/th/id/OIP.FrNVfaeqavmEtNrmYEftVQHaLH?w=2000&h=3000&rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 100 },
    { id: 44, nome: 'Tênis Esportivo Asics', descricao: 'Tênis leve para corrida', categoria: 'esportes', preco: 319.99, estoque: 10, imagem: 'https://oscarcalcados.vtexassets.com/arquivos/ids/5109132/Tenis-Esportivo-Asics-Gel-Shogun-5-Preto-e-Laranja-Masculino.jpg?v=638330541008600000', ativo: true, limiteMax: 50 },
    { id: 45, nome: 'Livro: CSS Avançado', descricao: 'Aprenda CSS para sites modernos', categoria: 'livros', preco: 79.99, estoque: 30, imagem: 'https://combofrontend.com.br/wp-content/uploads/2023/05/rabbit3d.png', ativo: true, limiteMax: 120 },
    { id: 46, nome: 'Batom Gloss', descricao: 'Batom com brilho intenso', categoria: 'beleza', preco: 29.99, estoque: 40, imagem: 'https://http2.mlstatic.com/D_NQ_NP_889923-MLB46997285415_082021-F.jpg', ativo: true, limiteMax: 200 },
    { id: 47, nome: 'Câmera Sony Alpha', descricao: 'Câmera mirrorless profissional', categoria: 'eletrônicos', preco: 4999.99, estoque: 5, imagem: 'https://th.bing.com/th/id/R.628bf85d52c7eb9456e3d319b77445fe?rik=skfOydlLRQfAcw&pid=ImgRaw&r=0', ativo: true, limiteMax: 20 },
    { id: 48, nome: 'Vestido Feminino de Festa', descricao: 'Vestido elegante para ocasiões especiais', categoria: 'roupas', preco: 249.99, estoque: 12, imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2018/11/vestido-de-festa-2019-104.jpg', ativo: true, limiteMax: 50 },
    { id: 49, nome: 'Raquete de Squash', descricao: 'Raquete para prática de squash', categoria: 'esportes', preco: 199.99, estoque: 8, imagem: 'https://tse4.mm.bing.net/th/id/OIP.8v9AD2Ydf6bX05qFgwNc6AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', ativo: true, limiteMax: 30 },
    { id: 50, nome: 'Livro: Node.js Avançado', descricao: 'Aprenda Node.js para back-end', categoria: 'livros', preco: 99.99, estoque: 20, imagem: 'https://m.media-amazon.com/images/I/71Hks+N9ESL._SL1500_.jpg', ativo: true, limiteMax: 80 }
];

let paginaAtual = 1;
const itensPorPagina = 6;
let filtroNome = "";
let filtroCategoria = "";

function filtrarProdutos() {
    let filtrados = produtos.filter(p => p.nome.toLowerCase().includes(filtroNome.toLowerCase()));
    if (filtroCategoria) {
        filtrados = filtrados.filter(p => p.categoria === filtroCategoria);
    }
    return filtrados;
}

function renderCategorias() {
    const select = document.getElementById('categoryFilter');
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    select.innerHTML = '<option value="">Todas as categorias</option>' +
        categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function renderProdutos() {
    const grid = document.getElementById('productsGrid');
    const produtosFiltrados = filtrarProdutos();
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const pagina = produtosFiltrados.slice(inicio, fim);
    grid.innerHTML = pagina.map(produto => `
        <div class="product-card" style="min-height: 350px;">
            <div class="product-image">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="product-info">
                <span class="product-name">${produto.nome}</span>
                <span class="product-category">${produto.categoria}</span>
                <span class="product-price">R$ ${produto.preco.toFixed(2)}</span>
                <span class="product-stock">Estoque: ${produto.estoque}</span>
                <button class="btn-primary" onclick="abrirModal(${produto.id})" ${!produto.ativo ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''}>Ver Detalhes</button>
                ${!produto.ativo ? '<span style="color:#e74c3c;font-weight:bold;">Produto inativo</span>' : ''}
            </div>
        </div>
    `).join('');
    renderPaginacao(produtosFiltrados.length);
}

function renderPaginacao(total) {
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const totalPages = Math.ceil(total / itensPorPagina);
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-number' + (i === paginaAtual ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => { paginaAtual = i; renderProdutos(); };
        pageNumbers.appendChild(btn);
    }
    prevBtn.disabled = paginaAtual === 1;
    nextBtn.disabled = paginaAtual === totalPages;
    prevBtn.onclick = () => { if (paginaAtual > 1) { paginaAtual--; renderProdutos(); } };
    nextBtn.onclick = () => { if (paginaAtual < totalPages) { paginaAtual++; renderProdutos(); } };
}

document.getElementById('searchInput').addEventListener('input', function(e) {
    filtroNome = e.target.value;
    paginaAtual = 1;
    renderProdutos();
});
document.getElementById('categoryFilter').addEventListener('change', function(e) {
    filtroCategoria = e.target.value;
    paginaAtual = 1;
    renderProdutos();
});


function abrirModal(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    document.getElementById('modalProductName').textContent = produto.nome;
    document.getElementById('modalProductDesc').textContent = produto.descricao;
    document.getElementById('modalProductImage').src = produto.imagem;
    document.getElementById('modalProductCategory').textContent = produto.categoria;
    document.getElementById('modalProductPrice').textContent = `R$ ${produto.preco.toFixed(2)}`;
    document.getElementById('modalProductStock').textContent = produto.estoque;
    document.getElementById('modalProductStatus').textContent = produto.ativo ? 'Ativo' : 'Inativo';
    document.getElementById('modalProductStatus').style.background = produto.ativo ? '#eafbe7' : '#fbeaea';
    document.getElementById('modalProductStatus').style.color = produto.ativo ? '#1bc47d' : '#e74c3c';
    document.getElementById('stockIncrement').value = "10";

    // Lógica do Toggle de Status
    const statusToggle = document.getElementById('productStatusToggle');
    statusToggle.checked = produto.ativo;
    // Remove listener antigo para evitar múltiplos eventos
    statusToggle.onchange = null; 
    statusToggle.onchange = function() {
        produto.ativo = this.checked;
        document.getElementById('modalProductStatus').textContent = produto.ativo ? 'Ativo' : 'Inativo';
        document.getElementById('modalProductStatus').style.background = produto.ativo ? '#eafbe7' : '#fbeaea';
        document.getElementById('modalProductStatus').style.color = produto.ativo ? '#1bc47d' : '#e74c3c';
        showToast(`Produto ${produto.ativo ? 'ativado' : 'inativado'} com sucesso.`, 'success');
        renderProdutos(); // Re-renderiza a lista para atualizar o estado do botão
    };

    document.getElementById('confirmAddStock').onclick = function() { abrirConfirmacao(produto.id); };
    document.getElementById('stockModal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('stockModal').style.display = 'none';
    // Limpa o evento onchange para evitar que o toggle do produto anterior afete o próximo
    const statusToggle = document.getElementById('productStatusToggle');
    if (statusToggle) statusToggle.onchange = null;
};

window.onclick = function(event) {
    if (event.target === document.getElementById('stockModal')) {
        document.getElementById('stockModal').style.display = 'none';
    }
};


function abrirConfirmacao(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    if (!produto.ativo) {
        showToast('Produto inativo: não é possível ajustar estoque', 'error');
        return;
    }
    const valor = parseInt(document.getElementById('stockIncrement').value, 10);
    if (isNaN(valor) || valor % 10 !== 0) {
        showToast('Acréscimo deve ser em lotes de 10 (10, 20, 30...)', 'error');
        return;
    }
    if (produto.limiteMax && produto.estoque + valor > produto.limiteMax) {
        showToast(`Operação ultrapassa o limite de estoque (máx. ${produto.limiteMax}).`, 'error');
        return;
    }
    // Preenche modal de confirmação visual
    document.getElementById('confirmProductName').textContent = produto.nome;
    document.getElementById('confirmOperation').textContent = `Adicionar +${valor} unidades`;
    document.getElementById('confirmNewStock').textContent = `${produto.estoque + valor} unidades`;
    document.getElementById('stockModal').style.display = 'none';
    document.getElementById('confirmModal').style.display = 'block';
    // Botões
    document.getElementById('cancelConfirm').onclick = function() {
        document.getElementById('confirmModal').style.display = 'none';
        document.getElementById('stockModal').style.display = 'block';
    };
    document.getElementById('doConfirm').onclick = function() {
        document.getElementById('confirmModal').style.display = 'none';
        // Simulação de atualização (substitua por chamada AJAX/fetch real)
        setTimeout(() => {
            produto.estoque += valor;
            document.getElementById('modalProductStock').textContent = produto.estoque;
            renderProdutos();
            showToast('Estoque atualizado com sucesso', 'success');
        }, 500);
    };
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✔️' : type === 'error' ? '❌' : 'ℹ️'}</span><span class="toast-content">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // A classe userManagement é carregada pelo script user-management.js
        userManagement.logout();
        window.location.href = '../index.html';
    }
}

// Inicialização
renderCategorias();
renderProdutos();
