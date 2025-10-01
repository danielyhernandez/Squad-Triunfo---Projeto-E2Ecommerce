// Sistema de Gestão de Usuários
class UserManagement {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos em millisegundos
        this.init();
    }

    init() {
        this.setupSessionTimeout();
        this.createDefaultUsers();
    }

    createDefaultUsers() {
        if (this.users.length === 0) {
            const defaultUsers = [
                {
                    id: '1',
                    name: 'Administrador',
                    email: 'admin@triunfoshop.com',
                    password: this.hashPassword('Admin123!@#'),
                    profile: 'Administrador',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: '2',
                    name: 'Vendedor Teste',
                    email: 'vendedor@triunfoshop.com',
                    password: this.hashPassword('Vendedor123!@#'),
                    profile: 'Vendedor',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: '3',
                    name: 'Cliente Teste',
                    email: 'cliente@triunfoshop.com',
                    password: this.hashPassword('Cliente123!@#'),
                    profile: 'Cliente',
                    createdAt: new Date().toISOString(),
                    isActive: true
                }
            ];
            this.users = defaultUsers;
            this.saveUsers();
        }
    }

    hashPassword(password) {
        // Simulação de hash - em produção usar bcrypt ou similar
        return btoa(password + 'salt_triunfoshop_2024');
    }

    validatePassword(password) {
        const minLength = 10;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasNumber && hasLetter && hasSpecial,
            errors: {
                length: password.length < minLength ? `Senha deve ter pelo menos ${minLength} caracteres` : null,
                number: !hasNumber ? 'Senha deve conter pelo menos um número' : null,
                letter: !hasLetter ? 'Senha deve conter pelo menos uma letra' : null,
                special: !hasSpecial ? 'Senha deve conter pelo menos um caractere especial' : null
            }
        };
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isEmailUnique(email, excludeId = null) {
        return !this.users.some(user => user.email === email && user.id !== excludeId);
    }

    createUser(userData) {
        const { name, email, password, profile } = userData;

        // Validações
        if (!name || !email || !password || !profile) {
            return { success: false, message: 'Todos os campos são obrigatórios' };
        }

        if (!this.validateEmail(email)) {
            return { success: false, message: 'E-mail inválido' };
        }

        if (!this.isEmailUnique(email)) {
            return { success: false, message: 'E-mail já cadastrado' };
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            const errors = Object.values(passwordValidation.errors).filter(error => error !== null);
            return { success: false, message: errors.join(', ') };
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: this.hashPassword(password),
            profile,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Usuário criado com sucesso', user: newUser };
    }

    updateUser(userId, userData) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        const user = this.users[userIndex];
        const { name, email, password, profile } = userData;

        // Validações
        if (email && !this.validateEmail(email)) {
            return { success: false, message: 'E-mail inválido' };
        }

        if (email && !this.isEmailUnique(email, userId)) {
            return { success: false, message: 'E-mail já cadastrado' };
        }

        if (password) {
            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.isValid) {
                const errors = Object.values(passwordValidation.errors).filter(error => error !== null);
                return { success: false, message: errors.join(', ') };
            }
        }

        // Atualizar dados
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = this.hashPassword(password);
        if (profile) user.profile = profile;

        this.users[userIndex] = user;
        this.saveUsers();

        return { success: true, message: 'Usuário atualizado com sucesso', user };
    }

    deleteUser(userId) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        this.users.splice(userIndex, 1);
        this.saveUsers();

        return { success: true, message: 'Usuário excluído com sucesso' };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.isActive);
        if (!user) {
            return { success: false, message: 'E-mail ou senha incorretos' };
        }

        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return { success: false, message: 'E-mail ou senha incorretos' };
        }

        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile
        };

        this.saveCurrentUser();
        this.resetSessionTimeout();

        return { success: true, message: 'Login realizado com sucesso', user: this.currentUser };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.clearSessionTimeout();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getAllUsers() {
        return this.users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            createdAt: user.createdAt,
            isActive: user.isActive
        }));
    }

    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;

        const permissions = {
            'Cliente': ['view_products', 'add_to_cart', 'view_orders'],
            'Vendedor': ['view_products', 'add_to_cart', 'view_orders', 'manage_stock'],
            'Administrador': ['view_products', 'add_to_cart', 'view_orders', 'manage_stock', 'manage_users', 'view_users']
        };

        return permissions[this.currentUser.profile]?.includes(permission) || false;
    }

    setupSessionTimeout() {
        this.sessionTimeoutId = setTimeout(() => {
            this.logout();
            window.location.href = 'login.html';
        }, this.sessionTimeout);
    }

    resetSessionTimeout() {
        this.clearSessionTimeout();
        this.setupSessionTimeout();
    }

    clearSessionTimeout() {
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
}

// Inicializar sistema de usuários
window.userManagement = new UserManagement();