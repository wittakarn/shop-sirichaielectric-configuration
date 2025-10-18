import * as React from 'react';
import styled from 'styled-components';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { DeleteTableIcon } from 'components/Display/Table';
import { ProductSpec } from 'interfaces/ProductSpec';

export const Image = styled.img`
    max-width: 12rem;
`;
Image.displayName = 'Image';

interface Props {
    productSpecs: ProductSpec[];
    handleRemoveClicked: (index: number) => void;
}

const ProductSpecListComponent: React.FC<Props> = (props: Props) => {

    const bodyDetails = props.productSpecs.map((productSpec, index) => (
        <TableRow key={index}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {productSpec.specificationImageFile && <Image src={URL.createObjectURL(productSpec.specificationImageFile)} />}
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
