import * as React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TableRow, TableHead, TableCell, TableBody, Table, IconButton, Button } from '@mui/material';
import { MenuGroup } from 'interfaces/MenuGroup';
import { getSubMenuGroups, updateMenuGroupsSequence } from 'services/MenuGroupService';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { TableCellVerticalMiddle } from 'components/Display/Table';
import { FlexBox } from 'components/Display/Flex';
import { NotificationProps, withNotification } from 'components/Dialog/Notification';

interface OwnProps {
    groupParentIdSelected?: number;
}

type Props = OwnProps & NotificationProps;

const SubMenuListComponent: React.FC<Props> = (props: Props) => {
    const [subMenus, setSubMenus] = React.useState<MenuGroup[]>([]);

    React.useEffect(() => {
        if (props.groupParentIdSelected) {
            (async () => {
                const response = await getSubMenuGroups(props.groupParentIdSelected!);
                setSubMenus(response.body || []);
            })();
        } else {
            setSubMenus([]);
        }
    }, [props.groupParentIdSelected]);

    const handleArrowClicked = (arrowDirection: string, selected: number) => {
        const subMenusClone = [...subMenus];
        if (arrowDirection === 'up') {
            const temp = subMenusClone[selected];
            subMenusClone[selected] = subMenusClone[selected - 1];
            subMenusClone[selected - 1] = temp;
        } else {
            const temp = subMenusClone[selected];
            subMenusClone[selected] = subMenusClone[selected + 1];
            subMenusClone[selected + 1] = temp;
        }

        setSubMenus(subMenusClone);
    }

    const updateSequence = async () => {
        const response = await updateMenuGroupsSequence(subMenus);
        if (response && response.body) {
            if (response.body.error) {
                props.setBodyMessage(response.body.error);
            } else {
                props.setBodyMessage('เปลี่ยนลำดับเรียบร้อยแล้ว');
            }

            props.handleNotificationOpen();
        }
    }

    const bodyDetails = subMenus.map((subMenu, index) => (
        <TableRow key={subMenu.id}>
            <TableCellVerticalMiddle component="th" scope="row">
                <FlexBox>
                    {
                        <IconButton size='small' aria-label="arrow-up" onClick={() => handleArrowClicked('up', index)} disabled={index === 0}>
                            <ArrowUpwardIcon />
                        </IconButton>
                    }
                    {
                        <IconButton size='small' aria-label="arrow-down" onClick={() => handleArrowClicked('down', index)} disabled={subMenus.length <= index + 1}>
                            <ArrowDownwardIcon />
                        </IconButton>
                    }
                </FlexBox>
            </TableCellVerticalMiddle>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                {subMenu.groupNameDisplay}
            </TableCell>
            <TableCell component="th" scope="row">
                {subMenu.groupNameSearch}
            </TableCell>
        </TableRow>
    ));

    return (
        <PaperOverflowScroll color="primary">
            <Table size="small" aria-label="sub menu table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อเมนูย่อย</TableCell>
                        <TableCell>SEO</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyDetails}
                </TableBody>
            </Table>
            <FlexBox>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    size="small"
                    fullWidth={true}
                    onClick={updateSequence}
                >
                    ยืนยันการเรียงลำดับ
                </Button>
            </FlexBox>
        </PaperOverflowScroll>
    );
}

export const SubMenuList = withNotification(React.memo<Props>(SubMenuListComponent), 'แจ้งเตือน');
SubMenuList.displayName = 'SubMenuList';
