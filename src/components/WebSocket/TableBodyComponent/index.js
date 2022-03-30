import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import TableBodyComponent from '../../TableBodyComponent';
import WebSocketTableFooterComponent from '../TableFooterComponent';
import { useInterval } from '../../../hooks/useInterval';

const WebSocketTableBodyComponent = ({
    data,
    tableTitles,
    balance,
    editable,
    footer,
    footerButtons,
    inputFileRef,
    activeHeaderTitle
}) => {
    const [prices, setPrices] = useState({});
    const [totalBalance, setTotalBalance] = useState(null);
    const [totalBalancePercent, setTotalBalancePercent] = useState(null);
    const pairs = useMemo(() => data.map(({ pair }) => `${pair.toUpperCase()}`), [data]);
    const getPrices = async pairs => {
        pairs.forEach(async pair => {
            const queryPair = pair.replace('/', '');
            const firstTicker = pair.split('/')[0];
            try {
                let price;
                if(firstTicker === 'HT') {
                    const { data } = await axios.get(`https://api.huobi.pro/market/trade?symbol=${queryPair.toLowerCase()}`);
                    price = data.tick.data[0].price;
                }
                else {
                    const { data } = await axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${queryPair}`);
                    price = data.price;
                }
                setPrices(state => ({ ...state, [queryPair.toLowerCase()]: Number(price) }));
            } catch (error) {
                console.log('Error>>> ', error);
            }
        });
    };
    useEffect(() => { getPrices(pairs); }, [data]);
    useInterval(() => getPrices(pairs), 60000);
    useEffect(() => {
        // const updateNotBinancePrices = pair => {
        //     setInterval(async () => {
        //         const { data } = await axios.get(`https://api.huobi.pro/market/trade?symbol=${pair.toLowerCase()}`);
        //         const { price } = data.tick.data[0];
        //         setPrices(state => ({ ...state, [pair.toLowerCase()]: price }));
        //         // setPrices({ pair: pair.toLowerCase(), price });
        //     }, 5000);
        // };
        // data.forEach(async ({ pair }) => {
        //     pair = pair.replace('/', '');
        //     try {
        //         await axios.get(`https://api.binance.com/api/v3/exchangeInfo?symbol=${pair.toUpperCase()}`);
        //     } catch (error) {
        //         if(error) {
        //             updateNotBinancePrices(pair);
        //         }
        //     }
        // });

		// const pairs = data.map(({ pair }) => `${pair.replace('/', '').toLowerCase()}@trade`);
        // const ws = new WebSocket(`wss://stream.binance.com/stream?streams=${pairs.join('/')}`);
        // const listener = ws.addEventListener('message', event => {
        //     const { data } = JSON.parse(event.data);
        //     const pair = data.s.toLowerCase();
        //     const lastPrice = Number(prices[pair]);
        //     const price = parseFloat(data.p);
        //     if(!lastPrice) {
        //         setPrices(state => ({ ...state, [pair]: price }));
        //     } else if(Math.abs(((lastPrice / price) * 100) - 100) > 10) {
        //         setPrices(state => ({ ...state, [pair]: price }));
        //     }
        // });
        // return () => ws.removeEventListener('message', listener);
	}, [data]);
    useEffect(() => {
        const profit = data.map(({ pair, quantity, amount }) => {
            const price = +prices[pair.replace('/', '').toLowerCase()];
            return +((quantity * price) - amount);
        }).reduce((prev, cur) => prev + cur, 0);
        const currentBalance = balance + profit;
        const currentBalancePercent = ((currentBalance / balance) * 100) - 100;
        setTotalBalance(+currentBalance.toFixed(3));
        setTotalBalancePercent(+currentBalancePercent.toFixed(1));
    }, [data, balance, prices]);
    return (
        <>
            <TableBodyComponent
                data={data}
                activeHeaderTitle={activeHeaderTitle}
                prices={prices}
                editable={editable}
                footer={footer}
            />
            {
                footer ? (
                    <WebSocketTableFooterComponent
                        footerButtons={footerButtons}
                        inputFileRef={inputFileRef}
                        balance={balance}
                        totalBalance={totalBalance}
                        totalBalancePercent={totalBalancePercent}
                        tableTitles={tableTitles}
                    />
                ) : <></>
            }
        </>
    );
};

export default WebSocketTableBodyComponent;