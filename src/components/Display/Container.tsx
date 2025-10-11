import styled from 'styled-components';
import { Container } from '@mui/material';

export const ContainerWithoutPadding = styled(Container)`
    &.MuiContainer-root{
        padding: 0;
    }
`;
ContainerWithoutPadding.displayName = 'ContainerWithoutPadding';