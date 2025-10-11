import * as React from 'react';
import { TableRow, TableHead, TableCell, TableBody, Table, Stack, Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { SelectableTableRow } from 'components/Display/Table';
import { QuotMast } from 'interfaces/Quotation';
import { numberWithCommas } from 'utils/Number';
import { formatToDmy } from 'utils/Date';

type Props = {
    quotMasts: Partial<QuotMast>[];
    onQuotationSelected: (quotNo: string) => void;
    onLoadMoreQuotationClicked: () => void;
};

const QuotationList: React.FC<Props> = (props: Props) => {

    const handleRowClick = (quotMast: Partial<QuotMast>) => {
        props.onQuotationSelected(quotMast.quotNo!);
    };

    const bodyDetails = props.quotMasts.map((quotMast, index) => (
        <SelectableTableRow key={quotMast.quotNo} onClick={() => handleRowClick(quotMast)}>
            <TableCell component="th" scope="row">{quotMast.quotNo}</TableCell>
            <TableCell component="th" scope="row">{formatToDmy(quotMast.date!)}</TableCell>
            <TableCell component="th" scope="row">{numberWithCommas(quotMast.netPrice!)}</TableCell>
            <TableCell component="th" scope="row">
                <a href={`${application.contextRoot}server/report/quotation.php?quotNo=${quotMast.quotNo}`} target="_blank">
                    <PictureAsPdfIcon />
                </a>
            </TableCell>
        </SelectableTableRow>
    ));

    return <PaperOverflowScroll color="primary">
        <Table size="small" aria-label="quotation master result table">
            <TableHead>
                <TableRow>
                    <TableCell>เลขทื่</TableCell>
                    <TableCell>วันที่</TableCell>
                    <TableCell>ราคา</TableCell>
                    <TableCell>PDF</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {bodyDetails}
            </TableBody>
        </Table>
        <Stack>
            <Button variant="text" size="small" onClick={props.onLoadMoreQuotationClicked}>
                <ArrowDropDownIcon fontSize="small" />
            </Button>
        </Stack>
    </PaperOverflowScroll>;
};

export default QuotationList;