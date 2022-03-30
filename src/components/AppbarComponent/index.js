import { Container, AppBar, Toolbar } from '@mui/material';

const AppbarComponent = ({ children }) => {
    return (
        <>
            <AppBar position='fixed' color='transparent'>
                <Container maxWidth='lg'>
                    { children }
                </Container>
            </AppBar>
            <Toolbar />
        </>
    );
};

export default AppbarComponent;