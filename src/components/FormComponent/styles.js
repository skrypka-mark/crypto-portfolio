import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles'

export const useStyles = makeStyles({
    container: {
        padding: 10,
        backgroundColor: `${alpha('#121212', 0.75)}`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    textField: {
        padding: 0,
        fontSize: 13
    },
    button: {
        '&.MuiButton-containedSizeSmall': {
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 'bold'
        }
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    modalBox: {
        backgroundColor: 'white',
        position: 'absolute',
        boxShadow: 24,
        padding: 10,
        borderRadius: 5,
        outline: 0
    },
    modalBoxText: {
        cursor: 'pointer'
    },
    backdrop: {
        '&.MuiBackdrop-root': {
            backgroundColor: `${alpha('#000', 0.5)}`,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
        }
    }
});