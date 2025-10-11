import * as React from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ProductGroupOption } from 'interfaces/ProductGroup';
import { getProductGroups } from 'services/ProductGroupService';

interface Props {
    selectedProductGroup?: ProductGroupOption | null;
    productGroupSelectedCallback: (selectedProductGroup: ProductGroupOption) => void;
}

const ProductGroupSelectorComponent: React.FC<Props> = (props: Props) => {
    const { selectedProductGroup, productGroupSelectedCallback } = props;
    const [inputValue, setInputValue] = React.useState(selectedProductGroup ? selectedProductGroup.groupNameDisplay : '');
    const [options, setOptions] = React.useState<ProductGroupOption[]>([]);

    React.useEffect(() => {
        if (inputValue.length === 0) {
            return;
        }

        (async () => {
            const response = await getProductGroups(null, inputValue);
            setOptions(response.body || []);
        })();

    }, [inputValue]);

    const handleInputChange = (event: React.ChangeEvent<{}>, value: any) => {
        setInputValue(value);
    };

    const handleProductGroupSelected = (event: React.ChangeEvent<{}>, value: any) => {
        productGroupSelectedCallback(value)
    };

    return (
        <Autocomplete
            getOptionLabel={option => option.groupNameDisplay || ''}
            isOptionEqualToValue={(option, value) => option.groupId === value.groupId}
            options={options}
            onInputChange={handleInputChange}
            onChange={handleProductGroupSelected}
            value={selectedProductGroup}
            renderInput={params => (
                <TextField
                    {...params}
                    label="เลือกกลุ่มสินค้า"
                    fullWidth
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'disabled',
                    }}
                    size="small"
                />
            )}
        />
    );
}

export const ProductGroupSelector = React.memo<Props>(ProductGroupSelectorComponent);
ProductGroupSelector.displayName = 'ProductGroupSelector';
