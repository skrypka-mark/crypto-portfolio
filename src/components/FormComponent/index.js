import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box,
    Stack,
    TextField,
    IconButton,
    Modal,
    Backdrop,
    MenuItem,
    Select,
    Typography,
    Fade,
    FormControl,
    FormHelperText
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addOrder } from '../../redux/reducers/orderReducer';
import { useInput } from '../../hooks/useInput';
import {
    pairValidate,
    sideValidate,
    entryPriceValidate,
    amountValidate,
    quantityValidate
} from '../../validation/formValidation';
import { useStyles } from './styles';

const sides = [
    {
        value: 'buy',
        label: 'Купить'
    },
    {
        value: 'sell',
        label: 'Продать'
    }
];

const FormComponent = ({ orders }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [pair, errorPair, onChangePair] = useInput('', pairValidate, true, true);
    const [side, errorSide, onChangeSide] = useInput(sides[0].value, sideValidate);
    const [entryPrice, errorEntryPrice, onChangeEntryPrice] = useInput('', entryPriceValidate);
    const [amount, errorAmount, onChangeAmount] = useInput('', amountValidate);
    const [quantity, errorQuantity, onChangeQuantity] = useInput('', quantityValidate);
    // const [error, setError] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const isSideBuy = useMemo(() => side === 'buy', [side]);
    const textFieldProps = {
        className: classes.textField,
        fullWidth: true,
        inputProps: { style: { fontSize: 13 } },
        InputLabelProps: { style: { fontSize: 13 } },
        size: 'small',
        variant: 'outlined',
        onKeyDown: event => event.key === 'Enter' ? clickHandler() : null
    };
    const closeModalHandler = () => setModalOpen(false);
    const openModalHandler = () => setModalOpen(true);
    // const changeHandler = setter => ({ target }) => setter(target.value);
    // const textFieldClickHandler = setter => setter('');
    const clickHandler = () => {
        const data = {
            id: orders.length + 1,
            pair,
			side,
			entryPrice: Number(entryPrice.replace(',', '.')),
			quantity: !isSideBuy ? Number(quantity.replace(',', '.')) : Number(amount / entryPrice),
			amount: isSideBuy ? Number(amount.replace(',', '.')) : Number(quantity * entryPrice)
        };
        const filteredOrdersByPairBuy = orders.filter(obj => obj.pair === pair && obj.side === 'buy');
        const filteredOrdersByPairSell = orders.filter(obj => obj.pair === pair && obj.side === 'sell');

        const totalAmount = filteredOrdersByPairBuy.reduce((prev, cur) => prev + cur.amount, 0) - filteredOrdersByPairSell.reduce((prev, cur) => prev + cur.amount, 0);
        const totalQuantity = filteredOrdersByPairBuy.reduce((prev, cur) => prev + cur.quantity, 0) - filteredOrdersByPairSell.reduce((prev, cur) => prev + cur.quantity, 0);
        
        // const totalQuantity = filteredOrdersByPairBuy.reduce((prev, cur) => prev + cur.quantity, 0) - filteredOrdersByPairSell.reduce((prev, cur) => prev + cur.quantity, 0);
        // const checkEmpty = key => !data[key] ? setError(state => ({ ...state, [key]: true })) : setError(state => ({ ...state, [key]: false }));
        // Object.keys(data).forEach(key => checkEmpty(key));
        if(
            !(errorPair || errorSide || errorEntryPrice || errorAmount || errorQuantity)
            && (pair && side && entryPrice && (isSideBuy ? amount : quantity))
        ) {
            if(isSideBuy ? true : totalQuantity >= +quantity) {
                dispatch(addOrder(data));
                openModalHandler();
                setTimeout(closeModalHandler, 500);
            } else console.log('xui');
        }
    };
    return (
        <Stack className={classes.container} direction='row' spacing={1}>
            <FormControl error={!!errorSide} fullWidth>
                <Select
                    value={side}
                    size='small'
                    sx={{ fontSize: 13 }}
                    onChange={onChangeSide}
                    onBlur={onChangeSide}
                >
                    { sides.map(option => (
                        <MenuItem key={option.value} value={option.value} sx={{ padding: 0.5, fontSize: 13 }}>
                            { option.label }
                        </MenuItem>
                    )) }
                </Select>
                <FormHelperText>
                    { errorSide }
                </FormHelperText>
            </FormControl>
            <TextField
                { ...textFieldProps }
                label='Пара'
                value={pair}
                onChange={onChangePair}
                onBlur={onChangePair}
                // onClick={() => textFieldClickHandler(setPair)}
                error={!!errorPair}
                helperText={errorPair}
            />
            <TextField
                { ...textFieldProps }
                label='Цена'
                type='number'
                value={entryPrice}
                onChange={onChangeEntryPrice}
                onBlur={onChangeEntryPrice}
                // onClick={() => textFieldClickHandler(setEntryPrice)}
                error={!!errorEntryPrice}
                helperText={errorEntryPrice}
            />
            <TextField
                { ...textFieldProps }
                label={isSideBuy ? 'Сумма' : 'Объем'}
                type='number'
                value={isSideBuy ? amount : quantity}
                onChange={isSideBuy ? onChangeAmount : onChangeQuantity}
                onBlur={isSideBuy ? onChangeAmount : onChangeQuantity}
                // onClick={() => textFieldClickHandler(isSideBuy ? setAmount : setQuantity)}
                error={isSideBuy ? !!errorAmount : !!errorQuantity}
                helperText={isSideBuy ? errorAmount : errorQuantity}
            />
            <IconButton
                className={classes.button}
                size='small'
                disableRipple
                onClick={clickHandler}
            >
                <AddIcon />
            </IconButton>
            <Modal
                className={classes.modal}
                open={modalOpen}
                onClose={closeModalHandler}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500, className: classes.backdrop }}
            >
                <Fade in={modalOpen} timeout={500} unmountOnExit>
                    <Box className={classes.modalBox} onClick={closeModalHandler}>
                        <Typography className={classes.modalBoxText} variant='h6' fontWeight='bold'>
                            Сделка добавлена
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </Stack>
    );
};

export default FormComponent;