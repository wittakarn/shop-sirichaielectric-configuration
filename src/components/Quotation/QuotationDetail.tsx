import * as React from "react";
import { useFormikContext } from "formik";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Product } from "interfaces/Product";
import { DeleteTableIcon, TableCellVerticalMiddle } from "components/Display/Table";
import { FlexBox } from "components/Display/Flex";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ProductInQuotation, QuotationFormValues } from "interfaces/Quotation";
import { numberWithCommas, round } from "utils/Number";
import { getVatRate } from "utils/Vat";

type ProductListProps = {
    item: ProductInQuotation;
    index: number;
    totalItem: number;
    handleArrowClicked: (arrowDirection: string, selected: number) => void;
    handleRemoveClicked: (product: Product) => void;
}

const ProductList = ({ item, index, totalItem, handleArrowClicked, handleRemoveClicked }: ProductListProps) => {
    const totalPrice = Number(item.productPrice) * Number(item.productAmount);
    return <TableRow key={index}>
        <TableCellVerticalMiddle component="th" scope="row">
            <FlexBox>
                {
                    <IconButton size='small' aria-label="arrow-up" onClick={() => handleArrowClicked('up', index)} disabled={index === 0}>
                        <ArrowUpwardIcon />
                    </IconButton>
                }
                {
                    <IconButton size='small' aria-label="arrow-down" onClick={() => handleArrowClicked('down', index)} disabled={totalItem <= index + 1}>
                        <ArrowDownwardIcon />
                    </IconButton>
                }
            </FlexBox>
        </TableCellVerticalMiddle>
        <TableCell component="th" scope="row">
            {index + 1}
        </TableCell>
        <TableCell component="th" scope="row">
            {item.product.productId}
        </TableCell>
        <TableCell component="th" scope="row">
            {item.product.productName}
        </TableCell>
        <TableCell component="th" scope="row">
            {item.productAmount}
        </TableCell>
        <TableCell component="th" scope="row">
            {numberWithCommas(Number(item.productPrice))}
        </TableCell>
        <TableCell component="th" scope="row" align="right">
            {numberWithCommas(totalPrice)}
        </TableCell>
        <TableCell>
            <DeleteTableIcon onClick={() => handleRemoveClicked(item.product)} />
        </TableCell>
    </TableRow>;
}

const ProductSummery = ({ totalPrice, vatPrice, summedPrice }: { totalPrice: number, vatPrice: number, summedPrice: number }) => {
    return <>
        <TableRow>
            <TableCell colSpan={6} align="right">ยอดรวม</TableCell>
            <TableCell align="right">{numberWithCommas(totalPrice)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
        <TableRow>
            <TableCell colSpan={6} align="right">ภาษี</TableCell>
            <TableCell align="right">{numberWithCommas(vatPrice)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
        <TableRow>
            <TableCell colSpan={6} align="right">ยอดสุทธิ</TableCell>
            <TableCell align="right">{numberWithCommas(summedPrice)}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    </>;
}

const QuotationDetail: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<QuotationFormValues>();

    const handleArrowClicked = (arrowDirection: string, selected: number) => {
        const productsInQuotation = [...values.productsInQuotation];
        if (arrowDirection === 'up') {
            const temp = productsInQuotation[selected];
            productsInQuotation[selected] = productsInQuotation[selected - 1];
            productsInQuotation[selected - 1] = temp;
        } else {
            const temp = productsInQuotation[selected];
            productsInQuotation[selected] = productsInQuotation[selected + 1];
            productsInQuotation[selected + 1] = temp;
        }

        setFieldValue('productsInQuotation', productsInQuotation);
    }

    const handleRemoveClicked = (product: Product) => {
        const notRemoveProductsInQuotation = values.productsInQuotation.filter(item => item.product.productId !== product.productId);

        setFieldValue('productsInQuotation', [
            ...notRemoveProductsInQuotation
        ]);
        const totalPrice = notRemoveProductsInQuotation.reduce((sum, item) => sum + Number(item.summedProductPrice), 0);
        const vatPrice = round(totalPrice * getVatRate(values.customer!.customerGrade));
        const summedPrice = totalPrice + vatPrice;

        setFieldValue('productsInQuotation', notRemoveProductsInQuotation);
        setFieldValue('totalPrice', totalPrice);
        setFieldValue('vatPrice', vatPrice);
        setFieldValue('summedPrice', summedPrice);
    }

    const productsInQuotationSize = values.productsInQuotation.length;

    const productList = values.productsInQuotation.map((item, index) => <ProductList
        key={index}
        item={item}
        index={index}
        totalItem={productsInQuotationSize}
        handleArrowClicked={handleArrowClicked}
        handleRemoveClicked={handleRemoveClicked}
    />);

    return (
        <Paper color="primary">
            <Table size="small" aria-label="sub menu table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>#</TableCell>
                        <TableCell>รหัสรายการ</TableCell>
                        <TableCell>ชื่อรายการ</TableCell>
                        <TableCell>จำนวน</TableCell>
                        <TableCell>ราคา</TableCell>
                        <TableCell>ราคารวม</TableCell>
                        <TableCell>ลบ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productList}
                    <ProductSummery totalPrice={values.totalPrice} vatPrice={values.vatPrice} summedPrice={values.summedPrice} />
                </TableBody>
            </Table>
        </Paper>
    );
};

export default QuotationDetail;