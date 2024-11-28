export const generateRandomString = (length:number):String => {
    const characters = "ABCDEFGHIJKLMNOOPQRSTUVWXYZabcdefjhijklmnopqrstuvwxyz0123456789";
    let result ="";
    for(let i = 0 ; i < length ; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


export const generateRandomNumber = (length:number):String => {
    const characters = "0123456789";
    let result ="";
    for(let i = 0 ; i < length ; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};