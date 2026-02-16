import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const authUtils = {
  getToken: () => {
    return Cookies.get(TOKEN_KEY) || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
  },

  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Helper to sync storage if needed
  syncStorage: () => {
    if (typeof window === 'undefined') return;
    const cookieToken = Cookies.get(TOKEN_KEY);
    const localToken = localStorage.getItem(TOKEN_KEY);
    
    if (cookieToken && !localToken) {
      localStorage.setItem(TOKEN_KEY, cookieToken);
    } else if (!cookieToken && localToken) {
      Cookies.set(TOKEN_KEY, localToken, { expires: 7, path: '/' });
    }
  }
};

export default authUtils;
