class verifica{
    verificar(status){
        if(status == 401){
            window.location.href = '/login'
        }
    }
    decodeToken(token) {
        const data = JSON.parse(atob(token));
        return data;
    }
}

export default verifica;