import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { TableRow, TableHead, TableCell, TableBody, Table, TextField, Button, Grid } from '@mui/material';
import { PaperOverflowScroll } from 'components/Display/Paper';
import { Customer } from 'interfaces/Customer';
import { getCustomers } from 'services/CustomerService';
import { Formik, Form } from 'formik';
import { SelectableTableRow } from 'components/Display/Table';
import { AlignRightGrid } from 'components/Display/Grid';
import { PureLink } from 'components/Display/Link';
import { getGradeLabel } from './mapper';

interface SearchCriteria {
  customerName: string;
}

const initialValues: SearchCriteria = { customerName: '' };

const SearchCustomer: React.FC = () => {
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSearch = async (values: SearchCriteria) => {
    setLoading(true);
    try {
      const response = await getCustomers(values.customerName);
      setResults(response.body || []);
    } catch (error) {
      setResults([]);
    }
    setLoading(false);
  };

  const handleRowClick = (customer: Customer) => {
    history.push({
      pathname: `${application.contextRoot}spa/customer/management`,
      state: customer,
    });
  };

  const bodyDetails = results.map((customer, index) => (
    <SelectableTableRow key={customer.id} onClick={() => handleRowClick(customer)}>
      <TableCell component="th" scope="row">{index + 1}</TableCell>
      <TableCell component="th" scope="row">{customer.customerName}</TableCell>
      <TableCell component="th" scope="row">{customer.tin}</TableCell>
      <TableCell component="th" scope="row">{customer.customerAddress}</TableCell>
      <TableCell component="th" scope="row">{getGradeLabel(customer.customerGrade)}</TableCell>
    </SelectableTableRow>
  ));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSearch}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="customerName"
                label="ชื่อลูกค้า/บริษัท"
                variant="outlined"
                size="small"
                fullWidth
                value={values.customerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit as any}
                disabled={loading}
                size="small"
              >
                ค้นหา
              </Button>
            </Grid>
            <AlignRightGrid item sm={6} xs={6}>
              <PureLink to={`${application.contextRoot}spa/customer/management`}>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  size="small"
                >
                  เพิ่มรายการใหม่
                </Button>
              </PureLink>
            </AlignRightGrid>
            <Grid item xs={12}>
              <PaperOverflowScroll color="primary">
                <Table aria-label="customer result table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ลำดับ</TableCell>
                      <TableCell>ชื่อลูกค้า/บริษัท</TableCell>
                      <TableCell>เลขประจำตัวผู้เสียภาษี</TableCell>
                      <TableCell>ที่อยู่</TableCell>
                      <TableCell>ประเภทลูกค้า</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bodyDetails}
                  </TableBody>
                </Table>
              </PaperOverflowScroll>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default SearchCustomer;