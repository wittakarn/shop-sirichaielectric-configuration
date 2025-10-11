import * as React from 'react';
import { TableRow, TableHead, TableCell, TableBody, Table, TextField } from '@mui/material';
import { withRouter, RouteComponentProps } from 'react-router';
import { Product } from 'interfaces/Product';
import { PaperOverflowScroll } from 'components/Display/Paper';

interface OwnProps {
    products: Product[];
    handleProductNameDisplayChange: (index: number, value: string) => void;
}

type Props = OwnProps & RouteComponentProps;

const EditProductRow: React.FC<{ index: number, product: Product, handleChange: (index: number, value: string) => void }> = (props) => {
    const { index, product, handleChange } = props;
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleChange(index, event.target.value);

    return <TableRow key={product.productId}>
        <TableCell component="th" scope="row">
            {index + 1}
        </TableCell>
        <TableCell component="th" scope="row">
            {product.productId}
        </TableCell>
        <TableCell component="th" scope="row">
            {product.productName}
        </TableCell>
        <TableCell component="th" scope="row" width={600}>
            <TextField
                fullWidth={true}
                onChange={onChange}
                value={product.productNameDisplay}
                size="small"
            />
        </TableCell>
    </TableRow>;
}

const EditProductResultListComponent: React.FC<Props> = (props: Props) => {
    const bodyDetails = props.products.map((product, index) => <EditProductRow index={index} product={product} handleChange={props.handleProductNameDisplayChange} />);

    return (
        <PaperOverflowScroll color="primary">
            <Table aria-label="product result table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>รหัสสินค้า</TableCell>
                        <TableCell>ชื่อสินค้า</TableCell>
                        <TableCell>ชื่อสินค้าบนเวป</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
        </PaperOverflowScroll>
    );
}

export const EditProductResultList = withRouter(React.memo<Props>(EditProductResultListComponent));
EditProductResultList.displayName = 'EditProductResultList';
