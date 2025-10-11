import styled from 'styled-components';
import { Grid } from '@mui/material';

export const AlignRightGrid = styled(Grid)`
    text-align: right;
`;
AlignRightGrid.displayName = 'AlignRightGrid';

export const FlexGrid = styled(Grid)`
    display: flex;
`;
FlexGrid.displayName = 'FlexGrid';

export const GridWithMarginAuto = styled(Grid)`
    &.MuiGrid-item{
        margin: auto;
    }
`;
GridWithMarginAuto.displayName = 'GridWithMarginAuto';

export const GridWithMarginMiddle = styled(Grid)`
    &.MuiGrid-item{
        margin: auto 0;
    }
`;
GridWithMarginMiddle.displayName = 'GridWithMarginAuto';
