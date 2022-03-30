import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    Collapse
} from '@mui/material';
import HeaderCellComponent from '../HeaderCellComponent';
import { useStyles } from './styles';

const TableComponent = ({
    title,
    tableTitles,
    dataLength,
    footer,
    children,
    activeHeaderTitle,
    headerTitleClickHandler,
}) => {
    const classes = useStyles();
    const [tableOpen, setTableOpen] = useState(true);
    if(!dataLength && !footer) return <></>;
    return (
        <Box>
            <Typography className={classes.title} variant='h5' fontWeight='bold' onClick={() => setTableOpen(!tableOpen)}>
                { title }
            </Typography>
            <Collapse in={tableOpen} timeout={500}>
                <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table size='small' stickyHeader>
                        <TableHead>
                            <TableRow>
                                { tableTitles.map(tableTitle => (
                                    <HeaderCellComponent
                                        key={tableTitle}
                                        title={tableTitle}
                                        tableTitle={title}
                                        dataLength={dataLength}
                                        activeTitle={activeHeaderTitle}
                                        clickHandler={headerTitleClickHandler}
                                    />
                                )) }
                            </TableRow>
                        </TableHead>
                        { children }
                    </Table>
                </TableContainer>
            </Collapse>
        </Box>
    );
};

export default TableComponent;