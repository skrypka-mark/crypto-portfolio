import React from 'react';
import { TableFooter, TableRow, TableCell, Link } from '@mui/material';
import { useStyles } from './styles';

const WebSocketTableFooterComponent = ({
    footerButtons,
    inputFileRef,
    balance,
    totalBalance,
    totalBalancePercent,
    tableTitles
}) => {
    const classes = useStyles();
    return (
        <TableFooter>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                    {
                        footerButtons.map(({ title, onClick }, index) => (
                            <React.Fragment key={index}>
                                <Link
                                    className={classes.link}
                                    component='span'
                                    underline='hover'
                                    color='inherit'
                                    onClick={() => onClick(inputFileRef)}
                                >
                                    { title }
                                </Link>
                                { index === footerButtons.length - 1 ? '' : ' / ' }
                            </React.Fragment>
                        ))
                    }
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell>
                    { balance ? `Всего: ${Number(balance.toFixed(3))} $` : '' }
                </TableCell>
                <TableCell align='right' colSpan={tableTitles ? tableTitles.length : 1} sx={{ color: 'inherit' }}>
                    { totalBalance ? `Баланс: ${totalBalance} $ (${totalBalancePercent}%)` : '' }
                </TableCell>
            </TableRow>
        </TableFooter>
    );
};

export default WebSocketTableFooterComponent;