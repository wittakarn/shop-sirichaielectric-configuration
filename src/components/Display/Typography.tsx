import { Typography } from "@mui/material";
import styled from "styled-components";

export const TypographyWithPaddingTopBottom = styled(Typography)`
    padding: 5px 0;
`;
TypographyWithPaddingTopBottom.displayName = 'TypographyWithPaddingTopBottom';

export const TypographyWithPadding = styled(Typography)`
    padding: 0.5em;
`;
TypographyWithPadding.displayName = 'TypographyWithPadding';

export const TypographyCenter = styled(Typography)`
    margin: auto;
    padding: 0.5em;
`;
TypographyCenter.displayName = 'TypographyCenter';