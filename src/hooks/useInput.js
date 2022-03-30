import { useState } from 'react';

export const useInput = (initialValue, validate, required = true, upperCase = false) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);

    const onChange = ({ target }) => {
        setValue(upperCase ? target.value.toUpperCase() : target.value);
        setError(validate(target.value, required));
    };

    return [ value, error, onChange ];
};