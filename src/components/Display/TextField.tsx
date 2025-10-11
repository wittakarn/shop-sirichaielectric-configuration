import { TextField } from "@mui/material";
import styled from "styled-components";

export const TextFieldWithMargin = styled(TextField)`
    &.MuiFormControl-fullWidth{
        margin: 10px;
        width: auto;
    }
`;
TextFieldWithMargin.displayName = 'TextFieldWithMargin';

export const TextFieldAlighRight = styled(TextField)`
    & .MuiInputBase-input{
        text-align: right;
    }
`;
TextFieldAlighRight.displayName = 'TextFieldAlighRight';