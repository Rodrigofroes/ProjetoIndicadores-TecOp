
class verifica {
    verificar(status) {
        if (status == 401) {
            window.location.href = '/login'
        }
    }
    decodeToken(token) {
        try {
            const urlDecodedToken = decodeURIComponent(token);
            let base64Token = urlDecodedToken.replace(/-/g, '+').replace(/_/g, '/');
            while (base64Token.length % 4 !== 0) {
                base64Token += '=';
            }
            const base64DecodedToken = atob(base64Token);
            const data = JSON.parse(base64DecodedToken);
            return data;
        } catch (error) {
            console.error('Failed to decode token:', error);
            throw new Error('Invalid token format');
        }
    }
}

export default verifica;