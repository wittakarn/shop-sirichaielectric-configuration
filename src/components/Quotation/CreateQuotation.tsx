import * as React from "react";
import { Button, Grid } from "@mui/material";
import { Form, FormikBag, FormikProps, withFormik } from "formik";
import { getCustomer } from "services/CustomerService";
import ProductPickerSection from "./ProductPickerSection";
import QuotationDetail from "./QuotationDetail";
import { Product } from "interfaces/Product";
import { AlignRightGrid } from "components/Display/Grid";
import { ProductInQuotation, QuotationFormValues, QuotDetail, QuotMast } from "interfaces/Quotation";
import { getVatRate } from "utils/Vat";
import { createQuotation, getQuotation, getQuotMastList, updateQuotation } from "services/QuotationService";
import { NotificationProps, withNotification } from "components/Dialog/Notification";
import QuotationList from "./QuotationList";
import CustomerInfo from "./CustomerInfo";
import { round } from "utils/Number";

type FormProps = NotificationProps;
type Props = FormProps & FormikProps<QuotationFormValues> & NotificationProps;

const handleReset = () => location.reload();

const QUOTATION_LOAD_SIZE = 10;

const buildProductInQuotation = (previousProductsInQuotation: ProductInQuotation[],
    product: Product,
    newProductAmount: number,
    newProductPrice: number): ProductInQuotation[] => {
    const existingProduct = previousProductsInQuotation.find(productInQuotation => productInQuotation.product.productId === product.productId);

    if (existingProduct) {
        const totalAmount = (Number(existingProduct.productAmount) + newProductAmount);
        const summedProductPrice = round(totalAmount * newProductPrice);
        return [
            ...previousProductsInQuotation.filter(productInQuotation => productInQuotation.product.productId !== product.productId),
            { product, productAmount: totalAmount, productPrice: newProductPrice, summedProductPrice: summedProductPrice }
        ];
    }

    const summedProductPrice = newProductAmount * newProductPrice;
    return [
        ...previousProductsInQuotation,
        { product, productAmount: newProductAmount, productPrice: newProductPrice, summedProductPrice }
    ];
}

const CreateQuotation: React.FC<Props> = (props: Props) => {
    const [quotMasts, setQuotMasts] = React.useState<Partial<QuotMast>[]>([]);

    const { isSubmitting, setFieldValue, values } = props;
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    React.useEffect(() => {
        if (id) {
            fetchCustomer(Number(id));
        }
    }, [id]);

    React.useEffect(() => {
        if (id) {
            fetchQuotMastList(Number(id));
        }
    }, [id, values.submitCount]);

    const fetchCustomer = async (customerId: number) => {
        const response = await getCustomer(customerId);
        if (response?.body) {
            setFieldValue('customer', response.body);
        }
    }

    const fetchQuotMastList = async (customerId: number, limit = QUOTATION_LOAD_SIZE) => {
        const response = await getQuotMastList(customerId, limit);
        if (response?.body) {
            setQuotMasts(response.body);
        }
    }

    const handleAddProduct = (product: Product, productAmount: number, productPrice: number) => {
        const productsInQuotation = buildProductInQuotation(values.productsInQuotation, product, productAmount, productPrice);
        const totalPrice = productsInQuotation.reduce((sum, item) => sum + Number(item.summedProductPrice), 0);
        const vatPrice = round(totalPrice * getVatRate(values.customer!.customerGrade));
        const summedPrice = totalPrice + vatPrice;

        setFieldValue('productsInQuotation', productsInQuotation);
        setFieldValue('totalPrice', totalPrice);
        setFieldValue('vatPrice', vatPrice);
        setFieldValue('summedPrice', summedPrice);
    }

    const handleLoadMoreQuotationClicked = () => {
        const limit = (quotMasts.length / QUOTATION_LOAD_SIZE + 1) + QUOTATION_LOAD_SIZE;
        fetchQuotMastList(Number(id), limit)
    }

    const onQuotationSelected = async (quotNo: string) => {
        const response = await getQuotation(quotNo);
        const quotMast = response.body['quotMast'] as QuotMast;
        const quotDetails = response.body['quotDetails'] as QuotDetail[];
        const productsInQuotation = quotDetails.map(detail => ({
            product: {
                productId: detail.productId,
                productName: detail.productName,
                unitName: detail.unitName,
                capitalPrice: detail.capitalPrice,
            } as Partial<Product>,
            productAmount: detail.quantity.toString(),
            productPrice: detail.price.toString(),
            summedProductPrice: detail.summaryPrice.toString(),
        }));

        setFieldValue('quotNo', quotMast.quotNo);
        setFieldValue('productsInQuotation', productsInQuotation);
        setFieldValue('totalPrice', quotMast.totalPrice);
        setFieldValue('vatPrice', quotMast.vatPrice);
        setFieldValue('summedPrice', quotMast.netPrice);
    }

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <Grid container spacing={1}>
                <Grid item xs={9}>
                    <ProductPickerSection customer={values.customer} onAddProduct={handleAddProduct} />
                </Grid>
                <Grid item xs={3}>
                    <CustomerInfo customer={values.customer} />
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={8}>
            <Form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <strong>{values.quotNo ? `เลขที่: ${values.quotNo}` : null}</strong>
                        <QuotationDetail />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="reset"
                            disabled={isSubmitting}
                            size="small"
                            onClick={handleReset}
                        >
                            เริ่มใหม่
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
                            บันทึก
                        </Button>
                    </AlignRightGrid>
                </Grid>
            </Form>
        </Grid>
        <Grid item xs={4}>
            <QuotationList quotMasts={quotMasts} onQuotationSelected={onQuotationSelected} onLoadMoreQuotationClicked={handleLoadMoreQuotationClicked} />
        </Grid>
    </Grid>;
};

const formInitialValues: QuotationFormValues = {
    quotNo: '',
    productsInQuotation: [],
    totalPrice: 0,
    vatPrice: 0,
    summedPrice: 0,
    customer: null,
    submitCount: 0,
};

const mapPropsToValues = (props: FormProps): QuotationFormValues => {
    return formInitialValues;
}

// Validation function
const validate = (values: QuotationFormValues) => {
    const errors: Partial<QuotationFormValues> = {};
    // Add validation logic if needed
    return errors;
};

const handleSubmit = async (
    values: QuotationFormValues,
    { props, resetForm, setSubmitting }: FormikBag<FormProps, QuotationFormValues>
) => {
    let response;

    if (values.quotNo) {
        response = await updateQuotation(values);
    } else {
        response = await createQuotation(values);
    }

    if (response && response.body) {
        resetForm({
            values: {
                quotNo: '',
                productsInQuotation: [],
                totalPrice: 0,
                vatPrice: 0,
                summedPrice: 0,
                customer: values.customer,
                submitCount: values.submitCount + 1,
            }
        });
        setSubmitting(false);
        props.setBodyMessage(`บันทึกใบเสนอราคาเลขที่: ${response.body.quotNo} เรียบร้อยแล้ว`);
        props.handleNotificationOpen();
    } else {
        if (props && props.setBodyMessage) {
            setSubmitting(false);
            props.setBodyMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            props.handleNotificationOpen();
        }
        console.error('API error:', response.error);
    }
};

export default withNotification(withFormik<FormProps, QuotationFormValues>({ mapPropsToValues, validate, handleSubmit })(CreateQuotation), 'แจ้งเตือน');