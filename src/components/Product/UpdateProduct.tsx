import * as React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TextField, Grid, Button, Typography } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { ProductForm } from 'interfaces/Product';
import { withNotification, NotificationProps } from 'components/Dialog/Notification';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { AlignRightGrid, FlexGrid } from 'components/Display/Grid';
import { PureLink } from 'components/Display/Link';
import { UploadImage } from 'components/Display/Upload';
import { TypographyCenter } from 'components/Display/Typography';
import { mapProductForm, mapProductRequest } from './mapper';
import { updateProduct, getProduct } from 'services/ProductService';

const TypographyForceWidth = styled(TypographyCenter)`
    flex-basis: 180px;
`;
TypographyForceWidth.displayName = 'TypographyForceWidth';

interface OwnProps {
}

interface State {
    productId: number;
}

interface FormValues {
    fields: ProductForm;
}

type FormProps = OwnProps & NotificationProps & RouteComponentProps;
type Props = FormProps & FormikProps<FormValues>;

class UpdateProductComponent extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        const productId = this.props.location.state as number;
        this.state = {
            productId,
        };
    }

    componentDidMount = async () => {
        await this.setFormValue(this.state.productId);
    }

    setFormValue = async (productId: number) => {
        const { setFieldValue } = this.props;
        const response = await getProduct(productId);
        setFieldValue('fields', mapProductForm(response.body));
    }

    clearForm = () => {
        this.setFormValue(this.state.productId);
    }

    render() {
        const { values, setFieldValue, handleChange, handleSubmit } = this.props;
        const productImageLink = values.fields.productImageFileName && <a href={`${application.shopUrl}image/product/${values.fields.productImageFileName}`} target="_blank"><PhotoLibraryIcon /></a>;
        const specificationImageLink = values.fields.specificationImageFileName && <a href={`${application.shopUrl}image/specification/${values.fields.specificationImageFileName}`} target="_blank"><PhotoLibraryIcon /></a>;
        const specificationPdfLink = values.fields.specificationPdfFileName && <a href={`${application.shopUrl}pdf/specification/${values.fields.specificationPdfFileName}`} target="_blank"><PictureAsPdfIcon /></a>;

        return (
            <form onSubmit={handleSubmit}>
                <ContainerWithoutPadding maxWidth="xl">
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <Typography variant="h6">
                            ปรับข้อมูลสินค้า
                        </Typography>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productName"
                                label="ชื่อสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productName}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productNameDisplay"
                                label="ชื่อสินค้าสำหรับแสดงบนหน้าเว็บไซต์ (หากไม่ระบุ ระบบจะใช้ชื้อสินค้าโดยลบวงเล็บออก)"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productNameDisplay}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productUrlName"
                                label="ชื่อสินค้าบน URL (หากไม่ระบุ ระบบจะใช้ชื้อสินค้าโดยแทนเว้นวรรคด้วย -)"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productUrlName}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productSearch"
                                label="ชื้อสินค้าสำหรับค้นหา"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productSearch}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <TextField
                                name="fields.standardPrice"
                                label="ราคาตั้ง"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.standardPrice}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <TextField
                                name="fields.bPrice"
                                label="ราคาขาย"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.bPrice}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productDetail"
                                label="รายละเอียดสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productDetail}
                                multiline={true}
                                rows={6}
                                size="small"
                            />
                        </Grid>
                        <FlexGrid item sm={12} xs={12}>
                            <TypographyForceWidth variant="body1">
                                รูปสินค้า
                            </TypographyForceWidth>
                            <UploadImage
                                name="fields.productImage"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    setFieldValue("fields.productImage", event.currentTarget.files ? event.currentTarget.files[0] : null);
                                }}
                            />
                            {productImageLink}
                        </FlexGrid>
                        <FlexGrid item sm={12} xs={12}>
                            <TypographyForceWidth variant="body1">
                                Image specification
                            </TypographyForceWidth>
                            <UploadImage
                                name="fields.specificationImage"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    setFieldValue("fields.specificationImage", event.currentTarget.files ? event.currentTarget.files[0] : null);
                                }}
                            />
                            {specificationImageLink}
                        </FlexGrid>
                        <FlexGrid item sm={12} xs={12}>
                            <TypographyForceWidth variant="body1">
                                PDF specification
                            </TypographyForceWidth>
                            <UploadImage
                                name="fields.specificationPdf"
                                type="file"
                                accept="application/pdf"
                                onChange={(event) => {
                                    setFieldValue("fields.specificationPdf", event.currentTarget.files ? event.currentTarget.files[0] : null);
                                }}
                            />
                            {specificationPdfLink}
                        </FlexGrid>
                        <Grid item sm={6} xs={6}>
                            <PureLink to={`${application.contextRoot}spa/product/search`}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    size="small"
                                >
                                    ค้นหา
                                </Button>
                            </PureLink>
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

const initialValue: ProductForm = {
    bPrice: 0,
    menuId: 0,
    productDetail: '',
    productId: 0,
    productGroupId: 0,
    productName: '',
    productNameDisplay: '',
    productSearch: '',
    productUrlName: '',
    capitalPrice: 0,
    standardPrice: 0,
    productImageFileName: '',
    specificationPdfFileName: '',
    specificationImageFileName: '',
    specificationImageFileNames: [],
};

const mapPropsToValues = (props: OwnProps) => {
    return {
        fields: initialValue,
    };
};

const handleSubmit = async (values: FormValues, { props }: FormikBag<FormProps, FormValues>) => {
    console.log(values);
    const request = mapProductRequest(values.fields);
    const response = await updateProduct(request);

    if (response && response.body) {
        if (response.body.error) {
            props.setBodyMessage(response.body.error);
        } else {
            props.setBodyMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
            props.setRedirectUrl(`${application.contextRoot}spa/product/search`);
        }
        props.handleNotificationOpen();
    }
}

export const UpdateProduct = withNotification(withRouter(withFormik<FormProps, FormValues>({ mapPropsToValues, handleSubmit })(UpdateProductComponent)), 'แจ้งเตือน');
