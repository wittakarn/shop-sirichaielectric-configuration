import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Grid, TextField, Button, Fab, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { ProductGroupForm } from 'interfaces/ProductGroup';
import { mapGroupRequest, mapProductGroupForm } from './mapper';
import { createProductGroup, deleteProductGroup, getProductGroup, updateProductGroup } from 'services/ProductGroupService';
import { ProductOption } from 'interfaces/Product';
import { ProductSelector } from '../ProductSelector';
import { ProductList } from './ProductList';
import { FlexGrow } from 'components/Display/Flex';
import { PureLink } from 'components/Display/Link';
import { withNotification, NotificationProps } from 'components/Dialog/Notification';
import { AlignRightGrid, FlexGrid } from 'components/Display/Grid';
import { TypographyCenter } from 'components/Display/Typography';
import { UploadImage } from 'components/Display/Upload';
import { ConfirmDialog } from 'components/Dialog/ConfirmDialog';
import { GroupSpecList } from './GroupSpecList';

const TypographyForceWidth = styled(TypographyCenter)`
    flex-basis: 200px;
`;
TypographyForceWidth.displayName = 'TypographyForceWidth';

const RadioGroupFlexGrow = styled(RadioGroup)`
    flex-grow: 1;
`;
RadioGroupFlexGrow.displayName = 'RadioGroupFlexGrow';

interface OwnProps {
}

interface State {
    groupId: number;
    currentProductSelected: ProductOption | null;
    isComfirmDeleteDialogOpen: boolean;
    specificationImageFileTemp: File | null;
}

interface FormValues {
    fields: ProductGroupForm;
}

type FormProps = OwnProps & NotificationProps & RouteComponentProps;
type Props = FormProps & FormikProps<FormValues>;

class ManageProductGroupComponent extends React.PureComponent<Props, State> {
    imageSpecificationInputRef: React.RefObject<HTMLInputElement> = React.createRef();

    static displayName = 'ManageGroupComponent';

    constructor(props: Props) {
        super(props);
        const groupId = this.props.location.state as number;
        this.state = {
            groupId,
            currentProductSelected: null,
            isComfirmDeleteDialogOpen: false,
            specificationImageFileTemp: null,
        };
    }

    componentDidMount = async () => {
        if (this.state.groupId) {
            await this.setFormValue(this.state.groupId);
        }
    }

    setFormValue = async (groupId: number) => {
        const { setFieldValue } = this.props;
        const response = await getProductGroup(groupId);
        const productGroup = mapProductGroupForm(response.body);
        setFieldValue('fields', productGroup);
    }

    clearForm = () => {
        const { resetForm } = this.props;

        const groupId = this.props.location.state as number;
        if (groupId) {
            this.setFormValue(groupId);
        } else {
            resetForm({ values: { fields: initialValue } });
        }

    }

    handleProductSelected = (selectedProduct: ProductOption) => {
        this.setState({
            currentProductSelected: selectedProduct,
        });
    }

    handleAddProduct = () => {
        if (this.state.currentProductSelected) {
            const { values, setFieldValue } = this.props;

            const alreadyExistProduct = values.fields.products.find(p => p.productId === this.state.currentProductSelected!.productId);
            if (!alreadyExistProduct) {
                setFieldValue('fields.products', [
                    ...values.fields.products,
                    this.state.currentProductSelected
                ]);
            }
        }

        this.setState({
            currentProductSelected: null,
        });
    }

    handleRemoveClicked = (productId: number) => {
        const { values, setFieldValue } = this.props;
        const nonRemoveProducts = values.fields.products.filter(p => p.productId !== productId);

        setFieldValue('fields.products', [
            ...nonRemoveProducts
        ]);
    }

    handleGroupSpecImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            this.setState({
                specificationImageFileTemp: event.currentTarget.files[0],
            });
        }
    }

    handleAddGroupSpecImage = () => {
        const { values, setFieldValue } = this.props;
        const { specificationImageFileTemp } = this.state;
        if (specificationImageFileTemp) {
            setFieldValue('fields.groupSpecImages', [
                ...values.fields.groupSpecImages || [],
                {
                    groupId: values.fields.groupId || 0,
                    file: specificationImageFileTemp,
                }
            ]);
            this.setState({
                specificationImageFileTemp: null,
            });
            this.imageSpecificationInputRef.current!.value = '';
        }
    }

    handleRemoveGroupSpecImage = (index: number) => {
        const { values, setFieldValue } = this.props;
        const updatedSpecs = values.fields.groupSpecImages?.filter((_, i) => i !== index) || [];
        setFieldValue('fields.groupSpecImages', updatedSpecs);
    }

    onCloseConfirmClick = () => {
        this.setState({
            isComfirmDeleteDialogOpen: true,
        });
    }

    onCloseConfirmDeleteClick = () => {
        this.setState({
            isComfirmDeleteDialogOpen: false,
        });
    }

    onConfirmDeleteClick = async () => {
        this.setState({
            isComfirmDeleteDialogOpen: false,
        })
        const { handleNotificationOpen, setBodyMessage, setRedirectUrl } = this.props;

        const response = await deleteProductGroup(this.state.groupId);
        if (response && response.body) {
            if (response.body.error) {
                setBodyMessage(response.body.error);
            } else {
                setBodyMessage('ลบข้อมูลเรียบร้อยแล้ว');
                setRedirectUrl(`${application.contextRoot}spa/product-group/search`);
            }

            handleNotificationOpen();
        }
    }

    render() {
        const { values, handleChange, setFieldValue, handleSubmit } = this.props;

        const productGroupImageLink = values.fields.groupImageFileName && <a href={`${application.shopUrl}image/product-group/${values.fields.groupImageFileName}`} target="_blank"><PhotoLibraryIcon /></a>;

        return (
            <form onSubmit={handleSubmit}>
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
                                name="fields.groupNameDisplay"
                                label="ชื่อกลุ่มสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.groupNameDisplay}
                                autoFocus={true}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.groupNameSearch"
                                label="ชื่อกลุ่มสินค้าบน URL"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.groupNameSearch}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.groupProductDetail"
                                label="รายละเอียดกลุ่มสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.groupProductDetail}
                                multiline={true}
                                rows={6}
                                size="small"
                            />
                        </Grid>
                        <FlexGrid item sm={12} xs={12}>
                            <TypographyForceWidth variant="body1">
                                รูปกลุ่มสินค้า
                            </TypographyForceWidth>
                            <UploadImage
                                name="fields.productGroupImage"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    setFieldValue("fields.productGroupImage", event.currentTarget.files ? event.currentTarget.files[0] : null);
                                }}
                            />
                            {productGroupImageLink}
                        </FlexGrid>
                        <FlexGrid item sm={12} xs={12}>
                            <TypographyForceWidth variant="body1">
                                Specification Images
                            </TypographyForceWidth>
                            <UploadImage
                                ref={this.imageSpecificationInputRef}
                                type="file"
                                accept="image/*"
                                onChange={this.handleGroupSpecImageChange}
                            />
                            <Fab size="small" color="secondary" aria-label="add" onClick={this.handleAddGroupSpecImage}>
                                <AddIcon />
                            </Fab>
                        </FlexGrid>
                        {values.fields.groupSpecImages && values.fields.groupSpecImages.length > 0 && (
                            <Grid item sm={12} xs={12}>
                                <GroupSpecList
                                    groupSpecs={values.fields.groupSpecImages}
                                    handleRemoveClicked={this.handleRemoveGroupSpecImage}
                                />
                            </Grid>
                        )}
                        <FlexGrid item sm={12} xs={12}>
                            <TypographyForceWidth variant="body1">
                                แสดงผลแบบ
                            </TypographyForceWidth>
                            <RadioGroupFlexGrow
                                aria-label="displayType"
                                name="fields.displayType"
                                value={values.fields.displayType}
                                onChange={handleChange}
                                row={true}
                            >
                                <FormControlLabel
                                    value="list"
                                    control={<Radio color="primary" />}
                                    label="List"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="table"
                                    control={<Radio color="primary" />}
                                    label="Table"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="tile"
                                    control={<Radio color="primary" />}
                                    label="Tile"
                                    labelPlacement="end"
                                />
                            </RadioGroupFlexGrow>
                        </FlexGrid>
                        <FlexGrid item sm={12} xs={12}>
                            <FlexGrow>
                                <ProductSelector selectedProduct={this.state.currentProductSelected} productSelectedCallback={this.handleProductSelected} />
                            </FlexGrow>
                            <Fab size="small" color="secondary" aria-label="add" onClick={this.handleAddProduct}>
                                <AddIcon />
                            </Fab>
                        </FlexGrid>
                        <Grid item sm={12} xs={12}>
                            <ProductList products={values.fields.products} handleRemoveClicked={this.handleRemoveClicked} />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <FlexGrid item sm={12} xs={12}>
                                <TypographyForceWidth variant="body1">
                                    รูปสินค้าเริ่มต้น
                                </TypographyForceWidth>
                                <UploadImage
                                    name="fields.productDefaultImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        setFieldValue("fields.productDefaultImage", event.currentTarget.files ? event.currentTarget.files[0] : null);
                                    }}
                                />
                            </FlexGrid>
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <PureLink to={`${application.contextRoot}spa/product-group/search`}>
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
                                {this.state.groupId ? 'แก้ไข' : 'บันทึก'}
                            </Button>
                            {this.state.groupId ? <Button variant="contained" color="secondary" type="button" size="small" onClick={this.onCloseConfirmClick}>ลบ</Button> : null}
                        </AlignRightGrid>
                    </Grid>
                </ContainerWithoutPadding>
                <ConfirmDialog
                    id="confirm-dialog"
                    bodyMessage={`ท่านต้องการลบกลุ่มสินค้า ใช่หรือไม่`}
                    headerMessage="ยืนการลบเมนู"
                    isOpen={this.state.isComfirmDeleteDialogOpen}
                    handleDialogClose={this.onCloseConfirmDeleteClick}
                    handleContinueClick={this.onConfirmDeleteClick}
                />
            </form>
        );
    }
}

const initialValue: ProductGroupForm = {
    groupNameDisplay: '',
    groupNameSearch: '',
    groupImageFileName: '',
    groupProductDetail: '',
    displayType: 'list',
    products: [],
    groupSpecImages: [],
};

const mapPropsToValues = (props: OwnProps) => {
    return {
        fields: initialValue,
    };
};

const handleSubmit = async (values: FormValues, { props, resetForm }: FormikBag<FormProps, FormValues>) => {

    const request = await mapGroupRequest(values.fields);
    console.log(request);

    const groupId = props.location.state as number;
    let response = null;

    if (groupId) {
        response = await updateProductGroup(request);

        if (response && response.body) {
            if (response.body.error) {
                props.setBodyMessage(response.body.error);
            } else {
                props.setBodyMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                props.setRedirectUrl(`${application.contextRoot}spa/product-group/search`);
            }

            props.handleNotificationOpen();
        }
    } else {
        response = await createProductGroup(request);

        if (response && response.body) {
            if (response.body.error) {
                props.setBodyMessage(response.body.error);
            } else {
                props.setBodyMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
                resetForm({ values: { fields: initialValue } });
            }

            props.handleNotificationOpen();
        }
    }
}

export const ManageProductGroup = withNotification(withRouter(withFormik<FormProps, FormValues>({ mapPropsToValues, handleSubmit })(ManageProductGroupComponent)), 'แจ้งเตือน');
