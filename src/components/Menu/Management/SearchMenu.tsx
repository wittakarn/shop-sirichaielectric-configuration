import * as React from 'react';
import { FormikProps, withFormik } from 'formik';
import { Grid, TextField, Button } from '@mui/material';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { AlignRightGrid } from 'components/Display/Grid';
import { PureLink } from 'components/Display/Link';
import { MenuInformation, MenuGroupSearchForm } from 'interfaces/MenuGroup';
import { MenuResultList } from './MenuResultList';
import { getMenuInformation } from 'services/MenuGroupService';

interface OwnProps {
}

interface State {
    searchResults: MenuInformation[];
}

interface FormValues {
    fields: MenuGroupSearchForm;
}

type Props = OwnProps & FormikProps<FormValues>;

class SearchMenuComponent extends React.PureComponent<Props, State> {

    static displayName = 'SearchMenu';

    constructor(props: Props) {
        super(props);
        this.state = {
            searchResults: [],
        }
    }

    handleSearchClick = async () => {
        const response = await getMenuInformation(this.props.values.fields);
        this.setState({
            searchResults: response.body || [],
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
                                name="fields.menuGroupNameDisplay"
                                label="ชื่อเมนูบน Web"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.menuGroupNameDisplay}
                                autoFocus={true}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="fields.productGroupNameDisplay"
                                label="ชื่อกลุ่มสินค้า"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.fields.productGroupNameDisplay}
                                size="small"
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
                        <AlignRightGrid item sm={6} xs={6}>
                            <PureLink to={`${application.contextRoot}spa/menu/management`}>
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
                            <MenuResultList menus={this.state.searchResults}  />
                        </Grid>
                    </Grid>
                </ContainerWithoutPadding>
            </form>
        );
    }
}

const mapPropsToValues = (props: OwnProps): FormValues => ({
    fields: {
        menuGroupNameDisplay: '',
        productGroupNameDisplay: '',
        productName: '',
    },
});

const handleSubmit = (values: FormValues) => {
}

export const SearchMenu = withFormik<OwnProps, FormValues>({ mapPropsToValues, handleSubmit })(SearchMenuComponent);