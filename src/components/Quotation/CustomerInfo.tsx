import { Customer } from "interfaces/Customer";
import * as React from "react";
import styled from "styled-components";

const CustomerInfoBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
`;
CustomerInfoBox.displayName = 'CustomerInfoBox';

const CustomerInfo: React.FC<{ customer: Customer | null }> = (props: { customer: Customer | null }) => {
  if (!props.customer) {
    return null;
  }

  return <CustomerInfoBox>
    <strong>ข้อมูลลูกค้า</strong>
    <div>ชื่อ: {props.customer.customerName}</div>
    <div>เลขประจำตัวผู้เสียภาษี: {props.customer.tin}</div>
    <div>ที่อยู่: {props.customer.customerAddress}</div>
    <div>ระดับลูกค้า: {props.customer.customerGrade}</div>
  </CustomerInfoBox>
}

export default React.memo(CustomerInfo);