const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function saveUser(user: object): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser<T>(): T | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
