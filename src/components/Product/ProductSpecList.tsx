import * as React from 'react';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { DeleteTableIcon } from 'components/Display/Table';
import { ProductSpec } from 'interfaces/ProductSpec';

interface Props {
    productSpecs: ProductSpec[];
    handleRemoveClicked: (productId: number) => void;
}

const ProductSpecListComponent: React.FC<Props> = (props: Props) => {

    const bodyDetails = props.productSpecs.map((productSpecs, index) => (
        <TableRow key={index}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {productSpecs.specificationImageFile && <img src={URL.createObjectURL(productSpecs.specificationImageFile)} />}
            </TableCell>
            <TableCell>
                <DeleteTableIcon onClick={() => props.handleRemoveClicked(index)} />
            </TableCell>
        </TableRow>
    ));
    return (
        <PaperOverflowScroll color="primary">
            <Table size="small" aria-label="sub menu table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
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

export const ProductSpecList = React.memo<Props>(ProductSpecListComponent);
ProductSpecList.displayName = 'ProductSpecList';
