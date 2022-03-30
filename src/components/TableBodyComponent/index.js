import { useEffect, useState } from 'react';
import { Box, TableBody, TableRow, TableCell, Checkbox } from '@mui/material';
import { formatNumber } from '../../utils/formatNumber';
import { useStyles } from './styles';

const TableBodyComponent = ({
    data,
    activeHeaderTitle,
    prices,
    reverse,
    editable,
    footer
}) => {
    const classes = useStyles();
    const [tableData, setTableData] = useState([]);
    const reverseData = () => {
        if(reverse) {
            setTableData(data.map(obj => {
                const { id, ...rest } = obj;
                return rest;
            }).reverse());
        } else {
            setTableData(data.map(obj => {
                const { id, ...rest } = obj;
                return rest;
            }));
        }
    };
    useEffect(() => {
        reverseData();
        if(activeHeaderTitle) {
            const filterWord = activeHeaderTitle.split('.')[1];

            let filterField;
            if(filterWord === 'Пара') filterField = 'pair';
            if(filterWord === 'Цена') filterField = 'entryPrice';
            if(filterWord === 'Сторона') filterField = 'side';
            if(filterWord === 'Объем') filterField = 'quantity';
            if(filterWord === 'Сумма') filterField = 'amount';
            if(filterWord === 'Цена сейчас') filterField = 'price';
            if(filterWord === 'Прибыль') filterField = 'profit';

            let dataWithPriceProfit = [...tableData];
            if(prices) {
                for(let i = 0; i < tableData.length; i++) {
                    const { pair, quantity, amount } = tableData[i];
                    const price = prices[pair.replace('/', '').toLowerCase()] || 0;
                    const totalProfit = Number((quantity * price) - amount);
    
                    dataWithPriceProfit[i].price = price;
                    dataWithPriceProfit[i].profit = totalProfit;
                }
            }

            const sortedTableData = dataWithPriceProfit.sort((a, b) => a[filterField] > b[filterField] ? 1 : -1);
            setTableData(sortedTableData);
        } else reverseData();
    }, [data, reverse, activeHeaderTitle, prices]);
    const Row = ({ row }) => {
        const [selectedRow, setSelectedRow] = useState(false);
        const [visibleRow, setVisibleRow] = useState(false);
        const checkBoxClickHandler = () => setSelectedRow(!selectedRow);
        return (
            <TableRow
                hover
                selected={editable ? selectedRow : false}
                sx={{
                    '&:last-child td, &:last-child th': !footer ? { border: 0 } : {},
                    cursor: editable ? 'pointer' : 'auto'
                }}
                onPointerEnter={() => setVisibleRow(true)}
                onPointerLeave={() => setVisibleRow(false)}
                onClick={checkBoxClickHandler}
            >
                { Object.keys(row).map(prop =>
                    (prop === 'profit' || prop === 'price')
                        ? <CellWithWebSocket key={prop} row={row} prop={prop} />
                        : (
                            <RenderCell
                                key={prop}
                                row={row}
                                prop={prop}
                                checkBoxClickHandler={checkBoxClickHandler}
                                visibleRow={visibleRow}
                                selectedRow={selectedRow}
                            />
                        )
                ) }
            </TableRow>
        );
    };
    const CellWithWebSocket = ({ row, prop }) => {
        const { pair, quantity, amount } = row;
        const price = prices[pair.replace('/', '').toLowerCase()];
        const profit = Number(quantity * price);
        const difference = profit - amount;
        const differencePercent = (difference / amount) * 100;
        if(prop === 'profit') {
            return (
                <TableCell
                    key={prop}
                    width='20%'
                    sx={{
                        color: (amount === profit || !profit)
                            ? 'inherit'
                            : (amount < profit ? 'green' : 'red')
                    }}
                >
                    { profit
                        ? `${ formatNumber(difference, 2) } ${pair.split('/')[1]} (${ formatNumber(differencePercent, 1) }%)`
                        : '--'
                    }
                </TableCell>
            );
        } else if(prop === 'price') {
            return (
                <TableCell
                    key={prop}
                    width='15%'
                >
                    { price ? `${formatNumber(price, 4)} ${pair.split('/')[1]}` : '--' }
                </TableCell>
            );
        } else return <Box />;
    };
    const RenderCell = ({
        row,
        prop,
        checkBoxClickHandler,
        visibleRow,
        selectedRow
    }) => {
        if(prop === 'side') {
            return (
                row[prop] === 'buy'
                    ? (
                        <TableCell className={classes.buy}>
                            Купить
                        </TableCell>
                    )
                    : (
                        <TableCell className={classes.sell}>
                            Продать
                        </TableCell>
                    )
            );
        } else if(prop === 'pair') return <TableCell sx={{ fontWeight: 'bold' }}>{ row[prop] }</TableCell>;
        else if(prop === 'quantity') {
            return (
                <TableCell>
                    { `${formatNumber(row[prop], 4)} ${row.pair.split('/')[0]}` }
                </TableCell>
            );
        }
        else if(prop === 'amount') {
            return (
                <TableCell>
                    { `${formatNumber(row[prop], 2)} ${row.pair.split('/')[1]}` }
                    { editable
                        ? (
                            <Checkbox
                                disableRipple
                                size='small'
                                checked={selectedRow}
                                onChange={checkBoxClickHandler}
                                sx={{
                                    padding: 0,
                                    float: 'right',
                                    transition: '.2s',
                                    opacity: Number(visibleRow || selectedRow)
                                }}
                            />
                        )
                        : <></>
                    }
                </TableCell>
            );
        } else if(prop === 'entryPrice') {
            return (
                <TableCell>
                    { `${formatNumber(row[prop], 4)} ${row.pair.split('/')[1]}` }
                </TableCell>
            );
        }
        return <TableCell>{ formatNumber(row[prop], 3) }</TableCell>;
    };
    return (
        <TableBody>
            { tableData.map((row, index) => row.entryPrice ? <Row key={index} row={row} /> : <></>) }
        </TableBody>
    );
};

export default TableBodyComponent;