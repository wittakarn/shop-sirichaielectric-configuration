import * as React from 'react';
import styled from 'styled-components';
import { TableRow, TableHead, TableCell, TableBody, Table } from '@mui/material';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { DeleteTableIcon } from 'components/Display/Table';
import { GroupImage } from 'interfaces/GroupImage';

export const Image = styled.img`
    max-width: 12rem;
`;
Image.displayName = 'Image';

interface Props {
    groupSpecs: GroupImage[];
    handleRemoveClicked: (index: number) => void;
}

const GroupSpecListComponent: React.FC<Props> = (props: Props) => {

    const bodyDetails = props.groupSpecs.map((groupSpec, index) => {
        const imageUrl = groupSpec.file ? URL.createObjectURL(groupSpec.file)
            : `${application.shopUrl}image/specification-group/${groupSpec.fileName}`;
        return <TableRow key={index}>
            <TableCell component="th" scope="row">
                {index + 1}
            </TableCell>
            <TableCell component="th" scope="row">
                <Image src={imageUrl} />
            </TableCell>
            <TableCell>
                <DeleteTableIcon onClick={() => props.handleRemoveClicked(index)} />
            </TableCell>
        </TableRow>
    });

    return (
        <PaperOverflowScroll color="primary">
            <Table size="small" aria-label="sub menu table">
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>รูป</TableCell>
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

export const GroupSpecList = React.memo<Props>(GroupSpecListComponent);
GroupSpecList.displayName = 'GroupSpecList';
