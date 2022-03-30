const EMPTY_FIELD = 'Поле не может быть пустым.';
const NO_SLASH = 'Тикеры должны быть разделены слэшом.';
const FEW_TICKERS = 'Необходимо указать 2 тикера.';
const NONSENSE = 'Вы ввели какую-то чушь.';
const ONLY_NUMBERS = 'В поле должны быть только цифры.';
const ONLY_UNSIGNED_NUMBERS = 'Нельзя использовать отрицательные цифры.';

const validateNumbers = (value, required) => {
    if(!value && required) return EMPTY_FIELD;
    else if(isNaN(Number(value.replace(',', '.')))) return ONLY_NUMBERS;
    else if(Number(value) < 0) return ONLY_UNSIGNED_NUMBERS;
    else return null;
};

export const pairValidate = (value, required) => {
    if(!value && required) return EMPTY_FIELD;
    else if(value.indexOf('/') === -1) return NO_SLASH;
    else if(!value.split('/')[1].length) return FEW_TICKERS;
    else if(value.split('/').length > 2) return NONSENSE;
    else return null;
};
export const sideValidate = (value, required) => {
    if(!value && required) return EMPTY_FIELD;
    else return null;
};
export const entryPriceValidate = (value, required) => {
    return validateNumbers(value, required);
};
export const amountValidate = (value, required) => {
    return validateNumbers(value, required);
};
export const quantityValidate = (value, required) => {
    return validateNumbers(value, required);
};