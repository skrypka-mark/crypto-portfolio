import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    buy: {
        '&.MuiTableCell-body': {
            color: 'green'
        }
    },
    sell: {
        '&.MuiTableCell-body': {
            color: 'red'
        }
    }
});