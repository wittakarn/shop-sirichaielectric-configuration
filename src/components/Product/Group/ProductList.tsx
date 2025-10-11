import * as React from 'react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { ProductOption } from 'interfaces/Product';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { DeleteTableIcon } from 'components/Display/Table';

interface Props {
    products: ProductOption[];
    handleRemoveClicked: (productId: number) => void;
}

const ProductListComponent: React.FC<Props> = (props: Props) => {

    const bodyDetails = props.products.map((product, index) => (
        <TableRow key={product.productId}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {product.productId}
            </TableCell>
            <TableCell component="th" scope="row">
                {product.productName}
            </TableCell>
            <TableCell component="th" scope="row">
                {product.productImageFileName && <a href={`${application.shopUrl}image/product/${product.productImageFileName}`} target="_blank"><PhotoLibraryIcon /></a>}
            </TableCell>
            <TableCell>
                <DeleteTableIcon onClick={() => props.handleRemoveClicked(product.productId)} />
            </TableCell>
        </TableRow>
    ));
    return (
        <PaperOverflowScroll color="primary">
            <Table size="small" aria-label="sub menu table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>รหัสสินค้า</TableCell>
                        <TableCell>ชื่อสินค้า</TableCell>
                        <TableCell>รูป</TableCell>
                        <TableCell>ลบ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
        </PaperOverflowScroll>
    );
}

export const ProductList = React.memo<Props>(ProductListComponent);
ProductList.displayName = 'ProductList';
