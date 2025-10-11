import * as React from "react";
import { Form, FormikBag, withFormik, FormikProps } from "formik";
import { Button, Grid, TextField } from "@mui/material";
import { Customer } from "interfaces/Customer";
import { ProductSelector } from "components/Product/ProductSelector";
import { Product, ProductOption } from "interfaces/Product";
import { AlignRightGrid } from "components/Display/Grid";
import { getProduct } from "services/ProductService";
import { getPriceList } from "services/QuotationService";
import { PriceHistory } from "interfaces/Quotation";
import PriceHistoryList from "./PriceHistoryList";
import { numberWithCommas } from "utils/Number";

type FormProps = {
    customer: Customer | null;
    onAddProduct: (product: Product, productAmount: number, productPrice: number) => void;
}

type FormValues = {
    product: Product | null;
    unitName: string;
    productAmount: string;
    productPrice: string;
}

type Props = FormProps & FormikProps<FormValues>;

const ProductPickerSection: React.FC<Props> = (props: Props) => {
    const [priceHistories, setPriceHistories] = React.useState<PriceHistory[]>([]);
    const { isSubmitting, values, handleChange, resetForm, errors, setFieldValue } = props;

    React.useEffect(() => {
        if (props.customer && values.product) {
            fetchPriceHistoryList(props.customer.id!, values.product.productId);
        } else {
            setPriceHistories([]);
        }
    }, [props.customer, values.product]);

    const fetchPriceHistoryList = async (customerId: number, productId: number) => {
        const response = await getPriceList(customerId, productId);
        if (response?.body) {
            setPriceHistories(response.body);
        }
    }

    const handleProductSelected = async (selectedProduct: ProductOption) => {
        if (selectedProduct) {
            const response = await getProduct(selectedProduct.productId);
            const product = response.body
            setFieldValue('product', product);
            setFieldValue('unitName', product.unitName);
            setFieldValue('productAmount', 1);
            setFieldValue('productPrice', product[`${props.customer!.customerGrade}Price`]);
        } else {
            resetForm({ values: formInitialValues });
        }
    };

    const onPriceSelected = (priceHistory: PriceHistory) => {
        setFieldValue('productPrice', numberWithCommas(priceHistory.price));
    };

    return <Form>
        <Grid container spacing={1}>
            <Grid item xs={9}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <ProductSelector selectedProduct={values.product} productSelectedCallback={handleProductSelected} errorText={errors.unitName} />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    name="productAmount"
                                    label="จำนวน"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleChange}
                                    value={values.productAmount}
                                    size="small"
                                    type="number"
                                    error={Boolean(errors.productAmount)}
                                    helperText={errors.productAmount}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="productPrice"
                                    label={`ราคา/${values.unitName}`}
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleChange}
                                    value={values.productPrice}
                                    size="small"
                                    type="number"
                                    error={Boolean(errors.productPrice)}
                                    helperText={errors.productPrice}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={isSubmitting}
                            size="small"
                            onClick={() => resetForm({ values: formInitialValues })}
                        >
                            เลือกสินค้าใหม่
                        </Button>
                    </Grid>
                    <AlignRightGrid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            size="small"
                        >
                            เพิ่ม
                        </Button>
                    </AlignRightGrid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <PriceHistoryList priceHistories={priceHistories} onPriceSelected={onPriceSelected}/>
            </Grid>
        </Grid>
    </Form>;
};

const mapPropsToValues = (props: FormProps): FormValues => {
    return formInitialValues;
}

const formInitialValues: FormValues = {
    product: null,
    unitName: 'หน่วย',
    productAmount: '',
    productPrice: '',
};

// Validation function
const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.product) {
        errors.unitName = 'กรุณาเลือกสินค้า';
    }
    if (values.productAmount === '' || values.productAmount === undefined) {
        errors.productAmount = 'กรุณาระบุจำนวน';
    }
    if (values.productPrice === '' || values.productPrice === undefined) {
        errors.productPrice = 'กรุณาระบุราคา';
    }
    return errors;
};

const handleSubmit = async (
    values: FormValues,
    { resetForm, props, setSubmitting }: FormikBag<FormProps, FormValues>,
) => {
    props.onAddProduct(values.product!!, Number(values.productAmount), Number(values.productPrice));
    resetForm({ values: formInitialValues });
    setSubmitting(false);
};

export default withFormik<FormProps, FormValues>({ mapPropsToValues, validate, handleSubmit })(ProductPickerSection);