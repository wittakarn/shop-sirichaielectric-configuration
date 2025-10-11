import * as React from 'react';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { SelectableTableRow } from 'components/Display/Table';
import { PriceHistory } from 'interfaces/Quotation';
import { formatToDmy } from 'utils/Date';
import { numberWithCommas } from 'utils/Number';

type Props = {
    priceHistories: PriceHistory[];
    onPriceSelected: (priceHistory: PriceHistory) => void;
};

const PriceHistoryList: React.FC<Props> = (props: Props) => {

    const handlePriceHistoryClick = (priceHistory: PriceHistory) => {
        props.onPriceSelected(priceHistory);
    };

    const bodyDetails = props.priceHistories.map((priceHistory, index) => (
        <SelectableTableRow key={priceHistory.date} onClick={() => handlePriceHistoryClick(priceHistory)}>
            <TableCell component="th" scope="row">{formatToDmy(priceHistory.date)}</TableCell>
            <TableCell component="th" scope="row">{numberWithCommas(priceHistory.price)}</TableCell>
        </SelectableTableRow>
    ));

    return <PaperOverflowScroll color="primary">
        <Table size="small" aria-label="price history result table">
            <TableHead>
                <TableRow>
                    <TableCell>วันที่</TableCell>
                    <TableCell>ราคา</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {bodyDetails}
            </TableBody>
        </Table>
    </PaperOverflowScroll>;
};

export default PriceHistoryList;