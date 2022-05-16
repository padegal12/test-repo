import React, { useState, useEffect, useContext } from "react";
import {
    Flex,
    TeamCreateIcon,
    EditIcon,
    TableDeleteIcon,
    SaveIcon,
    FormInput,
    FormDatepicker,
    FormButton
  } from "@fluentui/react-northstar";

export default function SupConfirm ({
  confirmation, deleteFunc, duplicateFunc, saveFunc, cancelFunc, defState
}) {
  const [state1, setState1] = useState("");
  setState1("false");
  if(state1 == "true") {
    return (<div>
      <Flex gap="gap.small">
        <FormInput
          label="Confirmation Category"
          name="category"
          disabled
          value={confirmation.category}
        />
        <FormInput
          label="Quantity"
          name="supQuantity"
          disabled
          value={confirmation.quantity}
        />
        </Flex>
        <br />
        <FormDatepicker
          label="Delivery Date Supplier Confirmation"
          id="delDateSupConfirmation"
          disabled
          defaultValue={confirmation.delDateSupConfirmation}
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
          <FormButton tinted content="Delete" icon={<TableDeleteIcon />} onClick = { () =>
                deleteFunc(confirmation.serialNumber,confirmation.seqNumber)} 
                
              />
          <FormButton tinted content="Duplicate" icon={<TeamCreateIcon />} onClick = { () =>
                duplicateFunc(confirmation.serialNumber,confirmation.seqNumber)}/>

          <FormButton tinted content="Edit" icon={<EditIcon />} />
        </Flex>
        <br />
      </div>)
  } else {
    return (
      <div>
            <Flex gap="gap.small">
              <FormInput
                label="Confirmation Category"
                name="category"
                value={confirmation.category}
              />
              <FormInput
                label="Quantity"
                name="supQuantity"
                value={confirmation.quantity}
              />
              </Flex>
              <br />
              <FormDatepicker
                label="Delivery Date Supplier Confirmation"
                id="delDateSupConfirmation"
                defaultValue={confirmation.delDateSupConfirmation}
              />
              <br />
              <FormInput
                label="Reference Document Number"
                name="refDocNumber"
                value={confirmation.refDocNumber}
              />
              <br />
              <Flex gap="gap.small">
                <FormButton tinted content="Save" icon={<SaveIcon />} onClick = { () =>
                      saveFunc(confirmation.serialNumber,confirmation.seqNumber)}
                    />
                <FormButton tinted content="Cancel" icon={<TableDeleteIcon />} onClick = { () =>
                      cancelFunc(confirmation.serialNumber,confirmation.seqNumber)}/>
              </Flex>
              <br />
              </div>
    )
  }
}