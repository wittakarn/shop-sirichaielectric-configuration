import { Tooltip, styled } from '@mui/material';

export const LightTooltip = styled(Tooltip)(({ theme }) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));