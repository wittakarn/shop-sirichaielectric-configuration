import * as React from 'react';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { withRouter, RouteComponentProps } from 'react-router';
import { ProductSearchResult } from 'interfaces/Product';
import { SelectableTableRow } from 'components/Display/Table';
import { PaperOverflowScroll } from 'components/Display/Paper';

interface OwnProps {
    productSearchResults: ProductSearchResult[];
}

type Props = OwnProps & RouteComponentProps;

const ProductResultListComponent: React.FC<Props> = (props: Props) => {

    const handleRowClick = (productSearchResult: ProductSearchResult) => {
        props.history.push({
            pathname: `${application.contextRoot}spa/product/update`,
            state: productSearchResult.productId,
        });
    };

    const bodyDetails = props.productSearchResults.map((productSearchResult, index) => (
        <SelectableTableRow key={productSearchResult.productId} onClick={() => handleRowClick(productSearchResult)}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {productSearchResult.productId}
            </TableCell>
            <TableCell component="th" scope="row">
                {productSearchResult.productName}
            </TableCell>
            <TableCell component="th" scope="row">
                {productSearchResult.groupNameDisplay}
            </TableCell>
            <TableCell component="th" scope="row">
                {productSearchResult.menuGroupNameG || productSearchResult.menuGroupNameP}
            </TableCell>
        </SelectableTableRow>
    ));
    return (
        <PaperOverflowScroll color="primary">
            <Table aria-label="product result table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>รหัสสินค้า</TableCell>
                        <TableCell>ชื่อสินค้า</TableCell>
                        <TableCell>กลุ่มสินค้า</TableCell>
                        <TableCell>อยู่ภายใต้เมนู</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
        </PaperOverflowScroll>
    );
}

export const ProductResultList = withRouter(React.memo<Props>(ProductResultListComponent));
ProductResultList.displayName = 'ProductResultList';
