import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TextField, Grid, Button, Typography, Fab } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddIcon from '@mui/icons-material/Add';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { Inventory, MenuGroup, MenuGroupForm, MenuInformation } from 'interfaces/MenuGroup';
import { ProductOption } from 'interfaces/Product';
import { ProductGroupOption } from 'interfaces/ProductGroup';
import { mapCreateMenuGroupRequest, mapMenuGroupForm, mapUpdateMenuGroupRequest } from './mapper';
import { createMenuGroup, deleteMenuGroup, getInventoryItems, updateMenuGroup } from 'services/MenuGroupService';
import { PureLink } from 'components/Display/Link';
import { ConfirmDialog } from 'components/Dialog/ConfirmDialog';
import { TypographyCenter } from 'components/Display/Typography';
import { UploadImage } from 'components/Display/Upload';
import { withNotification, NotificationProps } from 'components/Dialog/Notification';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { AlignRightGrid, FlexGrid } from 'components/Display/Grid';
import { FlexGrow } from 'components/Display/Flex';
import { ProductSelector } from 'components/Product/ProductSelector';
import { RootMenuSelector } from './RootMenuSelector';
import { SubMenuList } from './SubMenuList';
import { ProductGroupSelector } from 'components/Product/Group/ProductGroupSelector';
import { InventoryList } from './InventoryList';

interface OwnProps {
}

interface State {
    menuInformation: MenuInformation | null;
    currentProductGroupSelected: ProductGroupOption | null;
    currentProductSelected: ProductOption | null;
    isComfirmDeleteDialogOpen: boolean;
}

interface FormValues {
    fields: MenuGroupForm;
}

type FormProps = OwnProps & NotificationProps & RouteComponentProps;
type Props = FormProps & FormikProps<FormValues>;

class MainMenuManagementComponent extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        const menuInformation = this.props.location.state as MenuInformation;

        this.state = {
            menuInformation,
            currentProductGroupSelected: null,
            currentProductSelected: null,
            isComfirmDeleteDialogOpen: false,
        };
    }

    componentDidMount = async () => {
        if (this.state.menuInformation) {
            this.setFormValue(this.state.menuInformation);
        }
    }

    setFormValue = async (menuInformation: MenuInformation) => {
        const { setFieldValue } = this.props;
        const response = await getInventoryItems(menuInformation.id);
        setFieldValue('fields', mapMenuGroupForm(menuInformation, response.body || []));
    }

    clearForm = async () => {
        const { resetForm } = this.props;
        const menuInformation = this.props.location.state as MenuInformation;
        if (menuInformation) {
            const response = await getInventoryItems(menuInformation.id);
            mapMenuGroupForm(menuInformation, response.body)
            resetForm({ values: { fields: menuInformation ? mapMenuGroupForm(menuInformation, response.body || []) : initialValue } });
        } else {
            resetForm({ values: { fields: initialValue } });
        }
    }

    handleMainMenuGroupSelected = (menuGroup: MenuGroup) => {
        const { setFieldValue } = this.props;
        setFieldValue('fields.groupParent', menuGroup);
    }

    handleProductGroupSelected = (selectedProductGroup: ProductGroupOption) => {
        this.setState({
            currentProductGroupSelected: selectedProductGroup,
        });
    }

    handleProductSelected = (selectedProduct: ProductOption) => {
        this.setState({
            currentProductSelected: selectedProduct,
        });
    }

    handleAddProductGroupToInventoryClicked = () => {
        if (this.state.currentProductGroupSelected) {
            const { values, setFieldValue } = this.props;

            const alreadyExistProduct = values.fields.inventoryItems.find(i => i.category === 'group'
                && i.inventoryId === this.state.currentProductGroupSelected!.groupId);

            if (!alreadyExistProduct) {
                setFieldValue('fields.inventoryItems', [
                    ...values.fields.inventoryItems,
                    {
                        inventoryId: this.state.currentProductGroupSelected!.groupId,
                        inventoryName: this.state.currentProductGroupSelected!.groupNameDisplay,
                        category: 'group',
                    }
                ]);
            }
        }

        this.setState({
            currentProductGroupSelected: null,
        });
    }

    handleAddProductToInventoryClicked = () => {
        if (this.state.currentProductSelected) {
            const { values, setFieldValue } = this.props;

            const alreadyExistProduct = values.fields.inventoryItems.find(i => i.category === 'product'
                && i.inventoryId === this.state.currentProductSelected!.productId);

            if (!alreadyExistProduct) {
                setFieldValue('fields.inventoryItems', [
                    ...values.fields.inventoryItems,
                    {
                        inventoryId: this.state.currentProductSelected!.productId,
                        inventoryName: this.state.currentProductSelected!.productName,
                        category: 'product',
                    }
                ]);
            }
        }

        this.setState({
            currentProductSelected: null,
        });
    }

    handleRemoveInventoryClicked = (inventory: Inventory) => {
        const { values, setFieldValue } = this.props;
        const nonRemoveInventoryItems = values.fields.inventoryItems.filter(item => item.inventoryId !== inventory.inventoryId
            && item.order !== inventory.order);

        setFieldValue('fields.inventoryItems', [
            ...nonRemoveInventoryItems
        ]);
    }

    handleInventoryArrowClicked = (arrowDirection: string, selected: number) => {
        const { values, setFieldValue } = this.props;

        const inventoryItems = [...values.fields.inventoryItems];
        if (arrowDirection === 'up') {
            const temp = inventoryItems[selected];
            inventoryItems[selected] = inventoryItems[selected - 1];
            inventoryItems[selected - 1] = temp;
        } else {
            const temp = inventoryItems[selected];
            inventoryItems[selected] = inventoryItems[selected + 1];
            inventoryItems[selected + 1] = temp;
        }

        setFieldValue('fields.inventoryItems', inventoryItems);
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

        const response = await deleteMenuGroup(this.state.menuInformation!.id);
        if (response && response.body) {
            if (response.body.error) {
                setBodyMessage(response.body.error);
            } else {
                setBodyMessage('ลบข้อมูลเรียบร้อยแล้ว');
                setRedirectUrl(`${application.contextRoot}spa/menu/search`);
            }
            handleNotificationOpen();
        }
    };

    render() {
        const { values, handleChange, handleSubmit, setFieldValue } = this.props;
        const menuImageLink = values.fields.menuImageFileName && <a href={`${application.shopUrl}image/menu/${values.fields.menuImageFileName}`} target="_blank"><PhotoLibraryIcon /></a>;

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
                            เมนูหลัก
                        </Typography>
                        <Grid item sm={12} xs={12}>
                            <RootMenuSelector
                                menuGroup={values.fields.groupParent}
                                menuGroupSelectedCallback={this.handleMainMenuGroupSelected}
                            />
                        </Grid>
                        <Grid item sm={7} xs={12}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Typography variant="body1">
                                    เมนูย่อย
                                </Typography>
                                <Grid item sm={12} xs={12}>
                                    <TextField
                                        name="fields.groupNameDisplay"
                                        label="ชื่อเมนูบน Web"
                                        variant="outlined"
                                        fullWidth={true}
                                        onChange={handleChange}
                                        value={values.fields.groupNameDisplay}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <TextField
                                        name="fields.groupNameSearch"
                                        label="ชื่อเมนูบน URL"
                                        variant="outlined"
                                        fullWidth={true}
                                        onChange={handleChange}
                                        value={values.fields.groupNameSearch}
                                        size="small"
                                    />
                                </Grid>
                                <FlexGrid item sm={12} xs={12}>
                                    <TypographyCenter variant="body1">
                                        รูปเมนู
                                    </TypographyCenter>
                                    <UploadImage
                                        name="fields.menuImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            setFieldValue("fields.menuImage", event.currentTarget.files ? event.currentTarget.files[0] : null);
                                        }}
                                    />
                                    {menuImageLink}
                                </FlexGrid>
                                <FlexGrid item sm={6} xs={6}>
                                    <FlexGrow>
                                        <ProductGroupSelector
                                            selectedProductGroup={this.state.currentProductGroupSelected}
                                            productGroupSelectedCallback={this.handleProductGroupSelected}
                                        />
                                    </FlexGrow>
                                    <Fab size="small" color="secondary" aria-label="add" onClick={this.handleAddProductGroupToInventoryClicked}>
                                        <AddIcon />
                                    </Fab>
                                </FlexGrid>
                                <FlexGrid item sm={6} xs={6}>
                                    <FlexGrow>
                                        <ProductSelector
                                            selectedProduct={this.state.currentProductSelected}
                                            productSelectedCallback={this.handleProductSelected}
                                        />
                                    </FlexGrow>
                                    <Fab size="small" color="secondary" aria-label="add" onClick={this.handleAddProductToInventoryClicked}>
                                        <AddIcon />
                                    </Fab>
                                </FlexGrid>
                                <Grid item sm={12} xs={12}>
                                    <InventoryList
                                        inventoryItems={values.fields.inventoryItems}
                                        handleArrowClicked={this.handleInventoryArrowClicked}
                                        handleRemoveClicked={this.handleRemoveInventoryClicked}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={6}>
                                    <PureLink to={`${application.contextRoot}spa/menu/search`}>
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
                                        {this.state.menuInformation ? 'แก้ไข' : 'บันทึก'}
                                    </Button>
                                    {this.state.menuInformation ? <Button variant="contained" color="secondary" type="button" size="small" onClick={this.onCloseConfirmClick}>ลบ</Button> : null}
                                </AlignRightGrid>
                            </Grid>
                        </Grid>
                        <Grid item sm={5} xs={12}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Typography variant="body1">
                                    รายการเมนูย่อยทั้งหมด ของเมนูหลักที่ระบุ
                                </Typography>
                                <Grid item sm={12} xs={12}>
                                    <SubMenuList groupParentIdSelected={values.fields.groupParent?.id} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ContainerWithoutPadding>
                <ConfirmDialog
                    id="confirm-dialog"
                    bodyMessage={`ท่านต้องการลบเมนู ${this.state.menuInformation?.groupNameDisplay} ใช่หรือไม่`}
                    headerMessage="ยืนการลบเมนู"
                    isOpen={this.state.isComfirmDeleteDialogOpen}
                    handleDialogClose={this.onCloseConfirmDeleteClick}
                    handleContinueClick={this.onConfirmDeleteClick}
                />
            </form>
        );
    }
}

const initialValue = {
    groupNameDisplay: '',
    groupNameSearch: '',
    groupParent: null,
    menuImageFileName: '',
    inventoryItems: [],
};

const mapPropsToValues = (props: OwnProps) => {
    return {
        fields: initialValue,
    };
};

const handleSubmit = async (values: FormValues, { props, resetForm }: FormikBag<FormProps, FormValues>) => {
    console.log(values);

    const menuInformation = props.location.state as MenuInformation;
    let response = null;

    if (menuInformation) {
        const request = mapUpdateMenuGroupRequest(menuInformation.id, values.fields);
        response = await updateMenuGroup(request);

        if (response && response.body) {
            if (response.body.error) {
                props.setBodyMessage(response.body.error);
            } else {
                props.setBodyMessage('แก้ไขข้อมูลเรียบร้อยแล้ว');
                props.setRedirectUrl(`${application.contextRoot}spa/menu/search`);
            }

            props.handleNotificationOpen();
        }
    } else {
        const request = mapCreateMenuGroupRequest(values.fields);
        response = await createMenuGroup(request);

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

export const MainMenuManagement = withNotification(withRouter(withFormik<FormProps, FormValues>({ mapPropsToValues, handleSubmit })(MainMenuManagementComponent)), 'แจ้งเตือน');
