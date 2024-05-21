class verifica{
    verificar(status){
        if(status == 401){
            window.location.href = '/login'
        }
    }
}

export default verifica;