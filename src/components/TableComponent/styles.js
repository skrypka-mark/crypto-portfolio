import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    title: {
		textAlign: 'center',
		fontSize: 50,
		padding: 10,
        color: 'white'
	},
    tableContainer: {
        '&	.MuiTableContainer-root': {
            boxShadow: '0px 5px 10px 2px rgba(255, 255, 255, 1)',
        }
    },
    table: {}
});