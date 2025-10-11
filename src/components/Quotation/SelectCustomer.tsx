import * as React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Grid, Button } from "@mui/material";
import { AlignRightGrid } from "components/Display/Grid";
import { Customer, CustomerOption } from "interfaces/Customer";
import { CustomerSelector } from "components/Customer/CustomerSelector";
import { useHistory } from "react-router-dom";
import { getCustomer } from "services/CustomerService";
import CustomerInfo from "./CustomerInfo";

interface FormValues {
  customerOption: CustomerOption | null;
  selectedCustomer?: Customer;
}

const initialValues: FormValues = {
  customerOption: null,
};

const validate = (values: any) => {
  const errors: any = {};
  if (!values.customerOption) {
    errors.customerOption = "ข้อมูลต้องระบุ";
  }
  return errors;
};

const SelectCustomer: React.FC = () => {
  const history = useHistory();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (values.customerOption) {
      history.push({
        pathname: `${application.contextRoot}spa/quotation/create`,
        search: `?id=${values.customerOption.id}`
      });
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ errors, values, isSubmitting, setFieldValue }) => {
        const handleCustomerSelected = async (selectedCustomerOption: CustomerOption) => {
          setFieldValue("customerOption", selectedCustomerOption);
          const response = await getCustomer(selectedCustomerOption.id);

          if (response?.body) {
            setFieldValue("selectedCustomer", response.body);
          }
        };

        return (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomerSelector
                  selectedCustomer={values.customerOption}
                  customerSelectedCallback={handleCustomerSelected}
                  errorText={errors.customerOption}
                />
              </Grid>
              <Grid item xs={12}>
                {values.selectedCustomer && (
                  <CustomerInfo customer={values.selectedCustomer} />
                )}
              </Grid>
              <Grid item xs={6}>
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
                  ยืนยัน
                </Button>
              </AlignRightGrid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SelectCustomer;