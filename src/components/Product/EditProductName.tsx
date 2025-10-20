import * as React from 'react';
import { FormikBag, FormikProps, withFormik } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import { ProductInfo } from 'interfaces/Product';
import { EditProductResultList } from 'components/Product/EditProductResultList'
import { searchProducts, updateProductsDisplay } from 'services/ProductService';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { AlignRightGrid } from 'components/Display/Grid';
import { mapProductDisplayRequest } from './mapper';
import { NotificationProps, withNotification } from 'components/Dialog/Notification';

interface OwnProps {
}

interface EditProductForm {
    productNameSearch: string;
    products: ProductInfo[];
}

interface FormValues {
    fields: EditProductForm;
}

interface State {
    searchState: string;
}

type FormProps = OwnProps & NotificationProps;
type Props = FormProps & FormikProps<FormValues>;

class EditProductNameComponent extends React.PureComponent<Props, State> {

    static displayName = 'EditProductName';

    constructor(props: Props) {
        super(props);
        this.state = {
            searchState: '',
        }
    }

    handleSearchClick = async () => {
        const { values, setFieldValue } = this.props;
        if (values.fields.productNameSearch.length > 2) {
            const response = await searchProducts(values.fields.productNameSearch);
            setFieldValue('fields.products', response.body || []);
            this.setState({
                searchState: 'ALLOW',
            });
        } else {
            this.setState({
                searchState: 'NOT_ALLOW'
            });
        }
    }

    handleProductNameDisplayChange = (index: number, value: string) => {
        const { setFieldValue } = this.props;
        setFieldValue(`fields.products.[${index}].productNameDisplay`, value);
    }

    clearForm = () => {
        this.props.resetForm({
            values: initialValue
        });
    }

    render() {
        const { values, handleChange } = this.props;

        return (
            <form onSubmit={this.props.handleSubmit}>
                <ContainerWithoutPadding maxWidth="lg">
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productNameSearch"
                                label="ชื่อสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productNameSearch}
                                size="small"
                                error={this.state.searchState === 'NOT_ALLOW'}
                                helperText={this.state.searchState === 'NOT_ALLOW' ? "ต้องอย่างน้อย 3 ตัวอักษรเพื่อค้นหาข้อมูล" : ""}
                            />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                size="small"
                                onClick={this.handleSearchClick}
                            >
                                ค้นหา
                            </Button>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <EditProductResultList products={values.fields.products} handleProductNameDisplayChange={this.handleProductNameDisplayChange} />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="button"
                                size="small"
                                onClick={this.clearForm}
                            >
                                เริ่มใหม่
                            </Button>
                        </Grid>
                        <AlignRightGrid item sm={6} xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                            >
                                บันทึก
                            </Button>
                        </AlignRightGrid>
                    </Grid>
                </ContainerWithoutPadding>
            </form>
        );
    }
}

const initialValue = {
    fields: {
        productNameSearch: '',
        products: [],
    },
};

const mapPropsToValues = (props: OwnProps): FormValues => (initialValue);

const handleSubmit = async (values: FormValues, { props, resetForm }: FormikBag<FormProps, FormValues>) => {
    console.log(values.fields.products);
    const request = mapProductDisplayRequest(values.fields.products);
    const response = await updateProductsDisplay(request);

    if (response && response.body) {
        if (response.body.error) {
            props.setBodyMessage(response.body.error);
        } else {
            props.setBodyMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
        }
        props.handleNotificationOpen();
    }
}

export const EditProductName = withNotification(withFormik<FormProps, FormValues>({ mapPropsToValues, handleSubmit })(EditProductNameComponent), 'แจ้งเตือน');



