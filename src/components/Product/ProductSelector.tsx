import * as React from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ProductOption } from 'interfaces/Product';
import { getProductOptions } from 'services/ProductService';

interface Props {
    selectedProduct?: ProductOption | null;
    productSelectedCallback: (selectedProduct: ProductOption) => void;
    errorText?: string;
}

const ProductSelectorComponent: React.FC<Props> = (props: Props) => {
    const { selectedProduct, productSelectedCallback } = props;
    const [inputValue, setInputValue] = React.useState(props.selectedProduct ? props.selectedProduct.productName : '');
    const [options, setOptions] = React.useState<ProductOption[]>([]);

    React.useEffect(() => {
        if (inputValue.length === 0) {
            return;
        }

        (async () => {
            const response = await getProductOptions(inputValue);
            setOptions(response.body || []);
        })();

    }, [inputValue]);

    const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
        setInputValue(value);
    };

    const handleProductSelected = (event: React.ChangeEvent<{}>, value: any) => {
        productSelectedCallback(value)
    };

    return (
        <Autocomplete
            filterOptions={x => x}
            getOptionLabel={option => option.productName || ''}
            isOptionEqualToValue={(option, value) => option.productId === value.productId}
            options={options}
            onInputChange={handleInputChange}
            onChange={handleProductSelected}
            value={selectedProduct}
            renderInput={params => (
                <TextField
                    {...params}
                    label="เลือกสินค้า"
                    fullWidth
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'disabled',
                    }}
                    size="small"
                    error={Boolean(props.errorText)}
                    helperText={props.errorText}
                />
            )}
        />
    );
}

export const ProductSelector = React.memo<Props>(ProductSelectorComponent);
ProductSelector.displayName = 'ProductSelector';
