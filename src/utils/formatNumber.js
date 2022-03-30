export const formatNumber = (number = 0, decimals) => {
    if(typeof number === 'number') {
        let result;
        if(decimals) result = String(Number(number.toFixed(decimals))).replace('.', ',');
        else result = String(Number(number)).replace('.', ',');
        return result;
    }
    return String(Number(number)).replace('.', ',');
};
