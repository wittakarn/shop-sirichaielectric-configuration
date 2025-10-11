import * as React from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { CustomerOption } from 'interfaces/Customer';
import { getCustomerOptions } from 'services/CustomerService';

interface Props {
    selectedCustomer?: CustomerOption | null;
    customerSelectedCallback: (selectedCustomer: CustomerOption) => void;
    errorText?: string;
}

const CustomerSelectorComponent: React.FC<Props> = (props: Props) => {
    const { selectedCustomer, customerSelectedCallback } = props;
    const [inputValue, setInputValue] = React.useState(props.selectedCustomer ? props.selectedCustomer.customerName : '');
    const [options, setOptions] = React.useState<CustomerOption[]>([]);

    React.useEffect(() => {
        if (inputValue.length === 0) {
            return;
        }

        (async () => {
            const response = await getCustomerOptions(inputValue);
            setOptions(response.body || []);
        })();

    }, [inputValue]);

    const handleInputChange = (event: React.ChangeEvent<{}>, value: any) => {
        setInputValue(value);
    };

    const handleCustomerSelected = (event: React.ChangeEvent<{}>, value: any) => {
        customerSelectedCallback(value)
    };

    return (
        <Autocomplete
            filterOptions={x => x}
            getOptionLabel={option => option.customerName || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={options}
            onInputChange={handleInputChange}
            onChange={handleCustomerSelected}
            value={selectedCustomer}
            renderInput={params => (
                <TextField
                    {...params}
                    label="เลือกลูกค้า"
                    fullWidth
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'disabled',
                    }}
                    size="small"
                    error={!!props.errorText}
                    helperText={props.errorText}
                />
            )}
        />
    );
}

export const CustomerSelector = React.memo<Props>(CustomerSelectorComponent);
CustomerSelector.displayName = 'CustomerSelector';
