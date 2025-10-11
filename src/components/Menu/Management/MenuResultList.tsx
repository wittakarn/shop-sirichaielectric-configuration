import * as React from 'react';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { withRouter, RouteComponentProps } from 'react-router';
import { MenuInformation } from 'interfaces/MenuGroup';
import { SelectableTableRow } from 'components/Display/Table';
import { PaperOverflowScroll } from 'components/Display/Paper';

interface OwnProps {
    menus: MenuInformation[];
}

type Props = OwnProps & RouteComponentProps;

const MenuResultListComponent: React.FC<Props> = (props: Props) => {

    const handleRowClick = (menu: MenuInformation) => {
        props.history.push({
            pathname: `${application.contextRoot}spa/menu/management`,
            state: menu,
        });
    };

    const bodyDetails = props.menus.map((menu, index) => (
        <SelectableTableRow key={menu.id} onClick={() => handleRowClick(menu)}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {menu.groupNameDisplay}
            </TableCell>
            <TableCell component="th" scope="row">
                {menu.groupNameSearch}
            </TableCell>
            <TableCell component="th" scope="row">
                {menu.parentGroupNameDisplay}
            </TableCell>
        </SelectableTableRow>
    ));
    return (
        <PaperOverflowScroll color="primary">
            <Table aria-label="menu result table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อเมนูบน Web</TableCell>
                        <TableCell>ชื่อเมนู SEO</TableCell>
                        <TableCell>เมนูหลัก</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
        </PaperOverflowScroll>
    );
}

export const MenuResultList = withRouter(React.memo<Props>(MenuResultListComponent));
MenuResultList.displayName = 'MenuResultList';
