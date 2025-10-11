import * as React from 'react';
import { FormikProps, withFormik } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import { MenuGroup } from 'interfaces/MenuGroup';
import { ProductSearchForm, ProductSearchResult } from 'interfaces/Product';
import { ProductResultList } from './ProductResultList';
import { getProducts } from 'services/ProductService';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { RootMenuSelector } from 'components/Menu/Management/RootMenuSelector';

interface OwnProps {
}

interface State {
    searchState: string;
    searchResults: ProductSearchResult[];
}

interface FormValues {
    fields: ProductSearchForm;
}

type Props = OwnProps & FormikProps<FormValues>;

class SearchProductComponent extends React.PureComponent<Props, State> {

    static displayName = 'SearchProduct';

    constructor(props: Props) {
        super(props);
        this.state = {
            searchState: '',
            searchResults: [],
        }
    }

    handleMainMenuGroupSelected = (menuGroup: MenuGroup) => {
        const { setFieldValue } = this.props;
        setFieldValue('fields.menuId', menuGroup.id);
    }

    handleSearchClick = async () => {
        const { menuId, productName } = this.props.values.fields;
        if (productName.length > 2) {
            const response = await getProducts(menuId, productName);
            this.setState({
                searchState: 'ALLOW',
                searchResults: response.body || [],
            });
        } else {
            this.setState({
                ...this.state,
                searchState: 'NOT_ALLOW'
            });
        }
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
                            <RootMenuSelector
                                menuGroupSelectedCallback={this.handleMainMenuGroupSelected}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productName"
                                label="ชื่อสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productName}
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
                            <ProductResultList productSearchResults={this.state.searchResults} />
                        </Grid>
                    </Grid>
                </ContainerWithoutPadding>
            </form>
        );
    }
}

const mapPropsToValues = (props: OwnProps): FormValues => ({
    fields: {
        menuId: null,
        productName: '',
    },
});

const handleSubmit = (values: FormValues) => {
}

export const SearchProduct = withFormik<OwnProps, FormValues>({ mapPropsToValues, handleSubmit })(SearchProductComponent);