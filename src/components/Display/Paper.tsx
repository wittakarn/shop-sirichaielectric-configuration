import { Paper } from "@mui/material";
import styled from "styled-components";

export const PaperOverflowScroll = styled(Paper)`
    &.MuiPaper-root {
        overflow-y: scroll;
        scrollbar-width: thin;
    }
`;
PaperOverflowScroll.displayName = 'PaperOverflowScroll';