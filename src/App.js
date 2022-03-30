import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Box, ThemeProvider, Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { theme } from './theme';
import { orderSelector } from './redux/selectors/orderSelector';
import { addOrder } from './redux/reducers/orderReducer';
import TableComponent from './components/TableComponent';
import AppbarComponent from './components/AppbarComponent';
import FormComponent from './components/FormComponent';
import WebSocketTableBodyComponent from './components/WebSocket/TableBodyComponent';
import TableBodyComponent from './components/TableBodyComponent';

const useStyles = makeStyles({
	container: {
		minHeight: '100vh',
		height: '100%',
		paddingBottom: 100
	},
	content: {}
});

function App() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const orders = useSelector(orderSelector);
	const [portfolioData, setPortfolioData] = useState([]);
	const [balance, setBalance] = useState(null);
	const [visible, setVisible] = useState(false);
	const [activeHeaderTitle, setActiveHeaderTitle] = useState('');
	const inputFileRef = useRef(null);
	const ordersLength = useMemo(() => orders.length, [orders]);
	const portfolioDataLength = useMemo(() => portfolioData.length, [portfolioData]);
	const portfolioTitles = [
		'Пара',
		'Цена',
		'Объем',
		'Сумма',
		'Цена сейчас',
		'Прибыль'
	];
	const historyTitles = [
		'Пара',
		'Сторона',
		'Цена',
		'Объем',
		'Сумма'
	];
	useEffect(() => {
		setVisible(true);
	}, []);
	useEffect(() => {
		if(!orders.length) return;
		
		const samePairs = [];
		const portfolioResult = [];
		for(let i = 0; i < orders.length; i++) {
			if(!samePairs.includes(orders[i].pair)) {
				samePairs.push(orders[i].pair);
			}
		}
		samePairs.forEach(pair => {
			const filteredByPair = orders.filter(obj => obj.pair === pair);

			const buy = filteredByPair.filter(({ side }) => side === 'buy');
			const sell = filteredByPair.filter(({ side }) => side === 'sell');

			// ======== Entry Price & Quantity ========
			const totalCostBuy = buy.reduce((prev, cur) => prev + (cur.entryPrice * cur.quantity), 0) || 0;
			const totalCostSell = sell.reduce((prev, cur) => prev + (cur.entryPrice * cur.quantity), 0) || 0;

			const totalQuantityBuy = buy.map(({ quantity }) => Number(quantity)).reduce((prev, cur) => prev + cur, 0);
			const totalQuantitySell = sell.map(({ quantity }) => Number(quantity)).reduce((prev, cur) => prev + cur, 0);

			const totalCost = totalCostBuy - totalCostSell;
			const totalQuantity = totalQuantityBuy - totalQuantitySell;

			// const averageEntryPrice = averageCostSell ? (averageCostBuy + averageCostSell) / 2 : averageCostBuy;
			const averageEntryPrice = totalCost / totalQuantity;
			// ========================================

			// ======== Amount ========
			const totalAmount = averageEntryPrice * totalQuantity;
			// ========================

			if(totalAmount > 0) {
				portfolioResult.push({
					pair,
					entryPrice: averageEntryPrice,
					quantity: totalQuantity,
					amount: totalAmount,
					price: 0,
					profit: 0
				});
			}
		});
		const balanceSum = portfolioResult.map(({ amount }) => amount).reduce((prev, cur) => prev + cur, 0);
		setBalance(balanceSum);
		setPortfolioData(portfolioResult);
	}, [orders]);
	const setOrders = data => dispatch(addOrder(data));
	const footerButtons = [
        {
            title: 'Импорт',
            onClick: ref => {
                ref.current.click();
            }
        },
        {
            title: 'Экспорт',
            onClick: () => {
                const res = JSON.stringify(orders);
                const json = new Blob([res], {
                    type: 'text/json'
                });
                const jsonURL = window.URL.createObjectURL(json);
                const tempLink = document.createElement('a');
                tempLink.href = jsonURL;
                tempLink.setAttribute('download', 'data.json');
                tempLink.click();
            }
        }
    ];
	const inputFileChangeHandler = ({ target }) => {
        if(target?.value) {
            const [file] = target.files;
            if(file.type === 'application/json' && file.size < 10240) {
                const fileReader = new FileReader();
                fileReader.onload = async ({ target }) => {
                    const { result } = target;
                    JSON.parse(result).forEach(obj => setOrders(obj));
                }
                fileReader.readAsText(file);
            }
        }
    };
	const headerTitleClickHandler = (title, tableTitle) => setActiveHeaderTitle(activeHeaderTitle === `${tableTitle}.${title}` ? '' : `${tableTitle}.${title}`);
	return (
		<ThemeProvider theme={theme}>
			<Box className={classes.container}>
				<Fade in={visible} timeout={1000}>
					<Container maxWidth='lg' className={classes.content}>
						<AppbarComponent>
							<FormComponent orders={orders} />
						</AppbarComponent>
						<TableComponent
							title='Портфель'
							tableTitles={portfolioTitles}
							dataLength={portfolioDataLength}
							balance={balance}
							footerButtons={footerButtons}
							activeHeaderTitle={activeHeaderTitle}
							headerTitleClickHandler={headerTitleClickHandler}
							footer
						>
							<WebSocketTableBodyComponent
								data={portfolioData}
								tableTitles={portfolioTitles}
								balance={balance}
								footerButtons={footerButtons}
								inputFileChangeHandler={inputFileChangeHandler}
								inputFileRef={inputFileRef}
								activeHeaderTitle={activeHeaderTitle}
								footer
							/>
						</TableComponent>
						<TableComponent
							title='История'
							tableTitles={historyTitles}
							dataLength={ordersLength}
							activeHeaderTitle={activeHeaderTitle}
							headerTitleClickHandler={headerTitleClickHandler}
							editable
						>
							<TableBodyComponent
								data={orders}
								activeHeaderTitle={activeHeaderTitle}
								reverse
								editable
							/>
						</TableComponent>
					</Container>
				</Fade>
			</Box>
			<input
                type='file'
                hidden={true}
                ref={inputFileRef}
                onChange={inputFileChangeHandler}
            />
		</ThemeProvider>
	);
}

export default App;
