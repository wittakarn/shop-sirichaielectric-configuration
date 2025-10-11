import * as React from 'react';
import { Paper, TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { withRouter, RouteComponentProps } from 'react-router';
import { SelectableTableRow } from 'components/Display/Table';
import { ProductGroup } from 'interfaces/ProductGroup';

interface OwnProps {
    productGroups: ProductGroup[];
}

type Props = OwnProps & RouteComponentProps;

const ProductGroupResultListComponent: React.FC<Props> = (props: Props) => {

    const handleRowClick = (productGroup: ProductGroup) => {
        props.history.push({
            pathname: `${application.contextRoot}spa/product-group/management`,
            state: productGroup.groupId,
        });
    };

    const bodyDetails = props.productGroups.map((productGroup, index) => (
        <SelectableTableRow key={productGroup.groupId} onClick={() => handleRowClick(productGroup)}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {productGroup.groupNameDisplay}
            </TableCell>
            <TableCell component="th" scope="row">
                {productGroup.groupNameSearch}
            </TableCell>
        </SelectableTableRow>
    ));
    return (
        <Paper color="primary">
            <Table aria-label="member result table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อกลุ่มสินค้า</TableCell>
                        <TableCell>ชื่อกลุ่มสินค้าบน URL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
        </Paper>
    );
}

export const ProductGroupResultList = withRouter(React.memo<Props>(ProductGroupResultListComponent));
ProductGroupResultList.displayName = 'ProductGroupResultList';
