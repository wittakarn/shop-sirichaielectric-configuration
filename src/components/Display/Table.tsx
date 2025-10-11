import styled from 'styled-components';
import { TableRow, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const SelectableTableRow = styled(TableRow)`
    &:hover{
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.04);
    }
`;
SelectableTableRow.displayName = 'SelectableTableRow';

export const DeleteTableIcon = styled(DeleteIcon)`
    cursor: pointer;
`;
DeleteTableIcon.displayName = 'DeleteTableIcon';

export const TableCellRight = styled(TableCell)`
    &.MuiTableCell-root{
        text-align: right;
    }
`;
TableCellRight.displayName = 'TableCellRight';

export const TableCellCenter = styled(TableCell)`
    &.MuiTableCell-root{
        text-align: center;
    }
`;
TableCellCenter.displayName = 'TableCellCenter';

export const SelectableTableCell = styled(TableCell)`
    &:hover{
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.04);
    }
`;
SelectableTableCell.displayName = 'SelectableTableCell';

export const TableCellVerticalMiddle = styled(TableCellCenter)`
    &.MuiTableCell-root{
        padding: 0;
    }
`;
TableCellVerticalMiddle.displayName = 'TableCellVerticalMiddle';

export const TableCellFlex = styled(TableCell)`
    &.MuiTableCell-root{
        display: flex;
        flex-wrap: wrap;
    }
`;
TableCellFlex.displayName = 'TableCellFlex';
