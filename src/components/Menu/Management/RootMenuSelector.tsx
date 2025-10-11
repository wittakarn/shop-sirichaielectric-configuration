import * as React from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { MenuGroup } from 'interfaces/MenuGroup';
import { getMenuGroups } from 'services/MenuGroupService';

interface Props {
    menuGroup?: MenuGroup | null;
    menuGroupSelectedCallback: (menuGroup: MenuGroup) => void;
}

const RootMenuSelectorComponent: React.FC<Props> = (props: Props) => {
    const { menuGroup, menuGroupSelectedCallback } = props;
    const [inputValue, setInputValue] = React.useState(props.menuGroup ? props.menuGroup.groupNameSearch : '');
    const [options, setOptions] = React.useState<MenuGroup[]>([]);

    React.useEffect(() => {
        if (inputValue.length === 0) {
            return;
        }

        (async () => {
            const response = await getMenuGroups(inputValue);
            setOptions(response.body || []);
        })();

    }, [inputValue]);

    const handleInputChange = (event: React.ChangeEvent<{}>, value: any) => {
        setInputValue(value);
    };

    const handleMenuGroupSelected = (event: React.ChangeEvent<{}>, value: any) => {
        menuGroupSelectedCallback(value)
    };

    return (
        <Autocomplete
            getOptionLabel={option => option.groupNameDisplay || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={options}
            onInputChange={handleInputChange}
            onChange={handleMenuGroupSelected}
            value={menuGroup}
            fullWidth={true}
            renderInput={params => (
                <TextField
                    {...params}
                    label="เลือกเมนู"
                    fullWidth={true}
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

export const RootMenuSelector = React.memo<Props>(RootMenuSelectorComponent);
RootMenuSelector.displayName = 'RootMenuSelector';
