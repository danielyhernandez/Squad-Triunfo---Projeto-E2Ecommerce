# Magalu Store - E-commerce Platform

Uma plataforma de e-commerce moderna baseada no design do Magazine Luiza, desenvolvida com HTML, CSS e JavaScript puro.

## 🚀 Funcionalidades

### Página Inicial (index.html)
- ✅ Listagem de produtos com imagens, preços e botões de compra
- ✅ Integração com API pública de produtos ([https://catalogo-products.pages.dev/api/products](https://catalogo-products.pages.dev/api/products))
- ✅ Sistema de busca e filtros por categoria
- ✅ Ordenação por nome, preço e estoque
- ✅ Modal de detalhes do produto
- ✅ Design responsivo baseado no Magazine Luiza
- ✅ **Imagens dos produtos**: Prioriza imagens da API, com fallback para imagens por categoria

### Sistema de Autenticação
- ✅ **Login (login.html)**: Página de login com validações
- ✅ **Cadastro (register.html)**: Página de cadastro com validações robustas
  - Validação de senha segura (mínimo 10 caracteres, números, letras e caracteres especiais)
  - Validação de e-mail único
  - Indicador de força da senha em tempo real
  - Perfis de usuário (Cliente/Vendedor)

### Painel Administrativo (admin.html)
- ✅ **Gestão de Produtos**:
  - Consultar e listar produtos
  - Buscar por nome e filtrar por categoria
  - Ver detalhes completos do produto
  - Aumentar estoque em lotes de 10 unidades
  - Validações de negócio (produtos inativos, limites de estoque)
  - Confirmação antes de aplicar acréscimos

- ✅ **Gestão de Usuários**:
  - Criar novos usuários
  - Listar e buscar usuários
  - Filtrar por perfil (Cliente/Vendedor)
  - Exclusão com confirmação
  - Validações de segurança

## 🎨 Design e UX

### Estilo Visual
- **Cores**: Gradientes laranja/vermelho inspirados no Magazine Luiza
- **Tipografia**: Segoe UI para melhor legibilidade
- **Componentes**: Cards, botões e modais modernos
- **Responsividade**: Design adaptável para mobile e desktop

### Experiência do Usuário
- **Navegação intuitiva** com menu claro
- **Feedback visual** em todas as ações
- **Notificações** para sucesso e erro
- **Loading states** durante carregamentos
- **Validações em tempo real** nos formulários

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades avançadas
- **Font Awesome**: Ícones
- **API Externa**: Integração com catálogo de produtos

## 📁 Estrutura do Projeto

```
exemplo/
├── index.html          # Página inicial com produtos
├── login.html          # Página de login
├── register.html       # Página de cadastro
├── admin.html          # Painel administrativo
├── test-api.html       # Página de teste da API
├── styles.css          # Estilos globais
├── script.js           # JavaScript da página inicial
├── admin-script.js     # JavaScript do painel admin
└── README.md           # Documentação
```

## 🚀 Como Usar

### 1. Acessar a Página Inicial
- Abra `index.html` no navegador
- Navegue pelos produtos
- Use a busca e filtros para encontrar produtos específicos

### 2. Fazer Login
- Acesse `login.html`
- Use as credenciais de teste:
  - **Admin**: admin@magalu.com / admin123
  - **Vendedor**: vendedor@magalu.com / vendedor123
  - **Cliente**: cliente@magalu.com / cliente123

### 3. Cadastrar Novo Usuário
- Acesse `register.html`
- Preencha o formulário com validações em tempo real
- Escolha o perfil (Cliente ou Vendedor)

### 4. Painel Administrativo
- Faça login como admin
- Acesse `admin.html`
- Gerencie produtos e usuários

### 5. Teste da API
- Acesse `test-api.html` para verificar a integração com a API
- Visualize estatísticas dos produtos
- Verifique se as imagens estão sendo carregadas corretamente

## 🔒 Regras de Negócio Implementadas

### Gestão de Produtos
1. **Somente acréscimo em lotes de 10** é permitido
2. **Estoque nunca pode ser negativo**
3. **Produtos inativos** não podem receber acréscimo
4. **Confirmação obrigatória** antes de aplicar acréscimos
5. **Mensagens de erro claras** para falhas

### Gestão de Usuários
1. **E-mail único** no sistema
2. **Senha segura** com validações robustas
3. **Perfis distintos** (Cliente/Vendedor)
4. **Confirmação antes da exclusão**
5. **Sessão automática** de 30 minutos

## 🎯 Funcionalidades Avançadas

### Validações de Formulário
- **E-mail**: Formato válido e unicidade
- **Senha**: Força em tempo real com indicador visual
- **Campos obrigatórios**: Validação em tempo real
- **Feedback visual**: Cores e mensagens claras

### Sistema de Notificações
- **Sucesso**: Operações concluídas
- **Erro**: Falhas e validações
- **Info**: Informações importantes
- **Auto-dismiss**: Desaparecem automaticamente

### Responsividade
- **Mobile-first**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para diferentes tamanhos de tela
- **Touch-friendly**: Botões e controles adequados para touch

## 🔮 Próximas Funcionalidades

- [ ] Sistema de carrinho de compras
- [ ] Checkout e pagamento
- [ ] Histórico de pedidos
- [ ] Relatórios de vendas
- [ ] Upload de imagens de produtos
- [ ] Sistema de avaliações
- [ ] Notificações por e-mail

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluções**: 320px até 4K

## 🤝 Contribuição

Este projeto foi desenvolvido como exemplo de e-commerce moderno. Sinta-se livre para usar como base para seus próprios projetos!

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
