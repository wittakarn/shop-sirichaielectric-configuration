import * as React from "react";
import { Formik, Form } from "formik";
import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { AlignRightGrid } from "components/Display/Grid";
import { createCustomer, deleteCustomer, getCustomer, updateCustomer } from "services/CustomerService";
import { withNotification, NotificationProps } from "components/Dialog/Notification";
import { PureLink } from "components/Display/Link";
import { useLocation } from 'react-router';
import { Customer } from "interfaces/Customer";
import { ConfirmDialog } from "components/Dialog/ConfirmDialog";
import { getGradeOptions } from "./mapper";

const validate = (values: any) => {
  const errors: any = {};
  if (!values.customerName) {
    errors.customerName = "ข้อมูลต้องระบุ";
  } else if (values.customerName.length > 100) {
    errors.customerName = "ความยาวต้องไม่เกิน 100 ตัวอักษร";
  }
  if (!values.tin) {
    errors.tin = "ข้อมูลต้องระบุ";
  } else if (values.tin.length > 13) {
    errors.tin = "ความยาวต้องไม่เกิน 13 ตัวอักษร";
  }
  if (!values.customerAddress) {
    errors.customerAddress = "ข้อมูลต้องระบุ";
  } else if (values.customerAddress.length > 200) {
    errors.customerAddress = "ความยาวต้องไม่เกิน 200 ตัวอักษร";
  }
  if (!values.customerGrade) {
    errors.customerGrade = "ข้อมูลต้องระบุ";
  }
  if (values.remark && values.remark.length > 200) {
    errors.remark = "ความยาวต้องไม่เกิน 200 ตัวอักษร";
  }
  return errors;
};

const initialValues: Customer = {
  customerName: "",
  tin: "",
  customerAddress: "",
  customerGrade: "",
  remark: "",
};

const handleSubmit = async (values: Customer, { setSubmitting, resetForm, props }: any) => {
  try {
    let response;

    if (values.id) {
      response = await updateCustomer(values);
    } else {
      response = await createCustomer(values);
    }

    if (response && response.body) {
      if (props && props.setBodyMessage) {
        props.setBodyMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
        props.handleNotificationOpen();
      }

      if (!values.id) {
        resetForm();
      }
    } else {
      if (props && props.setBodyMessage) {
        props.setBodyMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        props.handleNotificationOpen();
      }
      console.error('API error:', response.error);
    }
  } catch (error) {
    if (props && props.setBodyMessage) {
      props.setBodyMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      props.handleNotificationOpen();
    }
    console.error('Request error:', error);
  }
  setSubmitting(false);
};


const CustomerManagement: React.FC<NotificationProps> = (props) => {
  const location = useLocation<Customer>();
  const [isComfirmDeleteDialogOpen, setComfirmDeleteDialogOpen] = React.useState<boolean>(false);
  const [formInitialValues, setFormInitialValues] = React.useState<Customer>(initialValues);

  React.useEffect(() => {
    const fetchCustomer = async (customerId: number) => {
      const response = await getCustomer(customerId);
      if (response && response.body) {
        setFormInitialValues(response.body);
      }
    };

    if (location.state?.id) {
      fetchCustomer(location.state.id);
    }
  }, [location.state?.id]);

  const onDeleteClick = () => {
    setComfirmDeleteDialogOpen(true);
  }

  const onCloseConfirmDeleteClick = () => {
    setComfirmDeleteDialogOpen(false);
  }

  const onConfirmDeleteClick = async () => {
    setComfirmDeleteDialogOpen(false);

    if (formInitialValues.id) {
      const response = await deleteCustomer(formInitialValues.id);
      if (response && response.body) {
        if (response.body.error) {
          props.setBodyMessage(response.body.error);
        } else {
          props.setBodyMessage('ลบข้อมูลเรียบร้อยแล้ว');
          props.setRedirectUrl(`${application.contextRoot}spa/customer/search`);
        }
        props.handleNotificationOpen();
      }
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validate={validate}
      onSubmit={(values, actions) => handleSubmit(values, { ...actions, props })}
      enableReinitialize={true}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="customerName"
                label="ชื่อลูกค้า/บริษัท"
                variant="outlined"
                size="small"
                fullWidth
                value={values.customerName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.customerName && Boolean(errors.customerName)}
                helperText={touched.customerName && errors.customerName}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="tin"
                label="เลขประจำตัวผู้เสียภาษี"
                variant="outlined"
                size="small"
                fullWidth
                value={values.tin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.tin && Boolean(errors.tin)}
                helperText={touched.tin && errors.tin}
                inputProps={{ maxLength: 13 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="customerAddress"
                label="ที่อยู่"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={values.customerAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.customerAddress && Boolean(errors.customerAddress)}
                helperText={touched.customerAddress && errors.customerAddress}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                name="customerGrade"
                label="ประเภทลูกค้า"
                variant="outlined"
                size="small"
                fullWidth
                value={values.customerGrade}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.customerGrade && Boolean(errors.customerGrade)}
                helperText={touched.customerGrade && errors.customerGrade}
              >
                {getGradeOptions().map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="remark"
                label="หมายเหตุ"
                variant="outlined"
                size="small"
                fullWidth
                value={values.remark}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.remark && Boolean(errors.remark)}
                helperText={touched.remark && errors.remark}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item xs={6}>
              <PureLink to={`${application.contextRoot}spa/customer/search`}>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  size="small"
                >
                  ค้นหา
                </Button>
              </PureLink>
              <Button
                variant="outlined"
                color="primary"
                type="reset"
                disabled={isSubmitting}
                size="small"
              >
                เริ่มใหม่
              </Button>
            </Grid>
            <AlignRightGrid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                size="small"
              >
                บันทึก
              </Button>
              {!!values.id ? <Button variant="contained" color="secondary" type="button" size="small" onClick={onDeleteClick}>ลบ</Button> : null}
            </AlignRightGrid>
          </Grid>
          <ConfirmDialog
            id="confirm-dialog"
            bodyMessage={`ท่านต้องการลบ ${values.customerName} ใช่หรือไม่`}
            headerMessage="ยืนการลบเมนู"
            isOpen={isComfirmDeleteDialogOpen}
            handleDialogClose={onCloseConfirmDeleteClick}
            handleContinueClick={onConfirmDeleteClick}
          />
        </Form>
      )}
    </Formik>
  );
};

export default withNotification(CustomerManagement, 'แจ้งเตือน');