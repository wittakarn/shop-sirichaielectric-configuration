import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TableRow, TableHead, TableCell, TableBody, Table, IconButton } from '@mui/material';
import { Inventory } from 'interfaces/MenuGroup';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { DeleteTableIcon, TableCellVerticalMiddle } from 'components/Display/Table';
import { FlexBox } from 'components/Display/Flex';

interface Props {
    inventoryItems: Inventory[];
    handleArrowClicked: (arrowDirection: string, selected: number) => void;
    handleRemoveClicked: (inventory: Inventory) => void;
}

const InventoryListComponent: React.FC<Props> = (props: Props) => {
    const inventoryItemSize = props.inventoryItems.length;

    const bodyDetails = props.inventoryItems.map((item, index) => (
        <TableRow key={index}>
            <TableCellVerticalMiddle component="th" scope="row">
                <FlexBox>
                    {
                        <IconButton size='small' aria-label="arrow-up" onClick={() => props.handleArrowClicked('up', index)} disabled={index === 0}>
                            <ArrowUpwardIcon />
                        </IconButton>
                    }
                    {
                        <IconButton size='small' aria-label="arrow-down" onClick={() => props.handleArrowClicked('down', index)} disabled={inventoryItemSize <= index + 1}>
                            <ArrowDownwardIcon />
                        </IconButton>
                    }
                </FlexBox>
            </TableCellVerticalMiddle>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {item.inventoryId}
            </TableCell>
            <TableCell component="th" scope="row">
                {item.inventoryName}
            </TableCell>
            <TableCell>
                <DeleteTableIcon onClick={() => props.handleRemoveClicked(item)} />
            </TableCell>
        </TableRow>
    ));
    return (
        <PaperOverflowScroll color="primary">
            <Table size="small" aria-label="sub menu table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>#</TableCell>
                        <TableCell>รหัสรายการ</TableCell>
                        <TableCell>ชื่อรายการ</TableCell>
                        <TableCell>ลบ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
        </PaperOverflowScroll>
    );
}

export const InventoryList = React.memo<Props>(InventoryListComponent);
InventoryList.displayName = 'InventoryList';
