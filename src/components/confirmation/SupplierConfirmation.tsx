import React, { SyntheticEvent } from "react";
import {
  Flex,
  TeamCreateIcon,
  EditIcon,
  TableDeleteIcon,
  FormInput,
  FormDatepicker,
  FormButton
} from "@fluentui/react-northstar";

import { Confirmation } from "../../models/Confirmation";

const confirmation: Confirmation = {
  serialNumber:2,
  seqNumber: 1,
  category: "All",
  quantity: 10,
  delDateSupConfirmation: "25.06.2022",
  refDocNumber: "216775412748"
};

const SupplierConfirmationPanel = (testFunc:any ) => (
  <div>
    <Flex gap="gap.small">
      <FormInput
        label="Confirmation Category"
        name="category"
        disabled
      />
      <FormInput
        label="Quantity"
        name="supQuantity"
        disabled
      />
    </Flex>
    <br />
    <FormDatepicker
      label="Delivery Date Supplier Confirmation"
      id="delDateSupConfirmation"
    />
    <br />
    <FormInput
      label="Reference Document Number"
      name="refDocNumber"
      disabled
      value={confirmation.refDocNumber}
    />
    <br />
    <Flex gap="gap.small">
      <FormButton tinted content="Delete" icon={<TableDeleteIcon />} onClick = {testFunc}/>
      <FormButton tinted content="Duplicate" icon={<TeamCreateIcon />} />
      <FormButton tinted content="Edit" icon={<EditIcon />} />
    </Flex>
  </div>
);

export default SupplierConfirmationPanel;
