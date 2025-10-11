import styled from "styled-components";
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import SaveIcon from '@mui/icons-material/Save';

export const MiniHourglassEmptyRoundedIcon = styled(HourglassEmptyRoundedIcon)`
&.MuiSvgIcon-root{
    margin: auto;
    width: 60px !important;
}
`
MiniHourglassEmptyRoundedIcon.displayName = 'MiniHourglassEmptyRoundedIcon';

export const SaveOverlayIcon = styled(SaveIcon)`
    cursor: pointer;
`
SaveOverlayIcon.displayName = 'SaveOverlayIcon';