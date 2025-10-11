import * as React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { FormikProps, withFormik } from 'formik';
import { ProductGroupResultList } from './GroupResultList';
import { ProductOption } from 'interfaces/Product';
import { ProductGroup, ProductGroupSearchForm } from 'interfaces/ProductGroup';
import { getProductGroups } from 'services/ProductGroupService';
import { AlignRightGrid } from 'components/Display/Grid';
import { PureLink } from 'components/Display/Link';
import { ProductSelector } from '../ProductSelector';

interface OwnProps {
}

interface State {
    searchResults: ProductGroup[];
}

interface FormValues {
    fields: ProductGroupSearchForm;
}

type Props = OwnProps & FormikProps<FormValues>;

class SearchProductGroupComponent extends React.PureComponent<Props, State> {

    static displayName = 'SearchProductGroup';

    constructor(props: Props) {
        super(props);
        this.state = {
            searchResults: [],
        }
    }

    handleSearchClick = async () => {
        const { productId, groupNameDisplay } = this.props.values.fields;
        const response = await getProductGroups(productId, groupNameDisplay);
        this.setState({
            searchResults: response.body,
        });
    }

    handleProductSelected = (selectedProduct: ProductOption) => {
        this.props.setFieldValue("fields.productId", selectedProduct.productId);
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
                            <ProductSelector productSelectedCallback={this.handleProductSelected}/>
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
                        <AlignRightGrid item sm={6} xs={6}>
                            <PureLink to={`${application.contextRoot}spa/product-group/management`}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    size="small"
                                >
                                    เพิ่มรายการใหม่
                                </Button>
                            </PureLink>
                        </AlignRightGrid>
                        <Grid item sm={12} xs={12}>
                            <ProductGroupResultList productGroups={this.state.searchResults || []} />
                        </Grid>
                    </Grid>
                </ContainerWithoutPadding>
            </form>
        );
    }
}

const mapPropsToValues = (props: OwnProps): FormValues => ({
    fields: {
        productId: null,
        groupNameDisplay: '',
    }
});

const handleSubmit = (values: FormValues) => {
}

export const SearchProductGroup = withFormik<OwnProps, FormValues>({ mapPropsToValues, handleSubmit })(SearchProductGroupComponent);