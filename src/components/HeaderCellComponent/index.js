import { useMemo } from 'react';
import { Box, TableCell } from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import { useStyles } from './styles';

const HeaderCellComponent = ({ title, tableTitle, dataLength, activeTitle, clickHandler }) => {
    const classes = useStyles();
    const isActive = useMemo(() => activeTitle === `${tableTitle}.${title}`, [activeTitle, title]);
    return (
        <TableCell className={classes.headerCell}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => clickHandler(title, tableTitle)}>
                { title === 'Пара'
                    ? `${title}${ dataLength ? ` (${dataLength})` : '' }`
                    : title
                }
                <ArrowDropDownIcon sx={{ transform: `rotate(${isActive ? '-180deg' : '0deg'})`, transition: '.2s' }} />
            </Box>
        </TableCell>
    );
};

export default HeaderCellComponent;