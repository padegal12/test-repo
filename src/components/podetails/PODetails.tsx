import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, useContext } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import { Text, Flex, Button, Accordion, Form,
  FormInput,
  FormButton,
  FormDropdown } from "@fluentui/react-northstar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import './PODetails.css';
import { PODetailsForm } from "../../models/PODetailsForm";
//import SupConfirmation from "../confirmation/SupplierConfirmation";
import SupConfirm from "../confirmation/SupConfirm";
//import { Confirmation } from "../../models/Confirmation";
const poDetailsForm: PODetailsForm = {
  poId: "4500001124",
  supplierDetails: "Domestic US Supplier 1",
  purchaseGroup: "401",
  purchasingDoc: "4500001124",
  items: ["00100", "00101"]
};

const itemLabelId = "item-label";
const supConfirmationPanels: { title: string; content: JSX.Element; }[] = [];
let supConfirmations: any = [];
const defaultIndex = 0;
function handleDelete(serialNo:any,seqNo:any){
  /* Call Delete function */
  supConfirmationPanels.splice(serialNo-1,1);
}

function handleSave(serialNo:any,seqNo:any){
  /* Call Save function */
  //supConfirmationPanels.splice(serialNo);
}

function handleCancel(serialNo:any,seqNo:any){
  /* Call Cancel function */
  supConfirmationPanels.splice(serialNo);
}

function handleDuplicate(serialNo:any,seqNo:any){
  const nextIndex = supConfirmationPanels.length + 1;
  const title = "Confirmation " + nextIndex;
  const curSupConfirmation = supConfirmations[serialNo-1];
  const confirmation = {
    serialNumber: nextIndex,
    seqNumber: 1,
    category: curSupConfirmation.SupplierConfirmationCategory,
    quantity: curSupConfirmation.ConfirmedQuantity,
    delDateSupConfirmation: curSupConfirmation.DeliveryDate,
    refDocNumber: curSupConfirmation.ExternalReferenceDocumentID
  }
  supConfirmationPanels.push({
      title: title,
      content: <SupConfirm confirmation={confirmation} deleteFunc={handleDelete} duplicateFunc={handleDuplicate} 
                  saveFunc={handleSave} cancelFunc={handleCancel} defState="true" />
  })
}

function addConfirmationPanel() {
  const nextIndex = supConfirmationPanels.length + 1;
  const title = "Confirmation " + nextIndex;
  const confirmation = {
    serialNumber: nextIndex,
    seqNumber: 1,
    category: "",
    quantity: 0,
    delDateSupConfirmation: "",
    refDocNumber: ""
  }
  supConfirmationPanels.push({
    title: title,
    content: <SupConfirm confirmation={confirmation} deleteFunc={handleDelete} duplicateFunc={handleDuplicate} 
                  saveFunc={handleSave} cancelFunc={handleCancel} defState="false"/>
  });
}

function convTSToDate(ts:string){
  const tsSec = parseInt(ts.substring(6,ts.length-2))/1000;
  const date = moment.unix(tsSec).format('DD-MM-YYYY');
  return date;
}

function convDateToTS(){

}

export const PODetails = () => {
  const [material, setMaterial] = useState<string>("");
  const [poQuantity, setPOQuantity] = useState<string>();
  const [orderUnit, setOrderUnit] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [plant, setPlant] = useState<string>("");
  const [shortText, setShortText] = useState<string>("");
  const [orderAckNumber, setOrderAckNumber] = useState<string>("");
  let selectedPoItem = poDetailsForm.items[0];
  async function fetchPODetails() {
      const poId = poDetailsForm.purchasingDoc;
      const btpEndPoint = "";
      try {
        const poItemResponse = await axios.get(`${btpEndPoint}/fetchpoitemdetails/${poId}/${selectedPoItem}`);
        console.log(poItemResponse.data);
        if(poItemResponse.data.d.results){
          const poItemData = poItemResponse.data.d.results[0];
          setMaterial(poItemData.Material);
          setPOQuantity(poItemData.OrderQuantity);
          setOrderUnit(poItemData.PurchaseOrderQuantityUnit);
          setDeliveryDate(convTSToDate(poItemData.to_PurchaseOrderTP.PurchaseOrderDate));
          setPlant(poItemData.to_PlantValueHelp.PlantName);
          setShortText(poItemData.PurchaseOrderItemText);
          setOrderAckNumber(poItemData.PurgDocOrderAcknNumber);
          //clear confirmation panels and generate them again.
          supConfirmations = poItemData.to_PurOrdSupplierConfirmation.results;
          supConfirmationPanels.length = 0;
          let i =0;
          for(const element of supConfirmations){
            const serialNumber = i+1;
            const confirmation = {
              serialNumber: serialNumber,
              seqNumber: 1,
              category: element.SupplierConfirmationCategory,
              quantity: element.ConfirmedQuantity,
              delDateSupConfirmation: convTSToDate(element.DeliveryDate),
              refDocNumber: element.ExternalReferenceDocumentID
            }
            supConfirmationPanels.push({
              title: "Confirmation "+serialNumber,
              content: <SupConfirm confirmation={confirmation} deleteFunc={handleDelete} duplicateFunc={handleDuplicate} 
                            saveFunc={handleSave} cancelFunc={handleCancel} defState="true"/>
            });
            i++;
          }
        }
        else {
          alert("Purchase Order details not found");
        }
      }
      catch (err) {
        console.error(err);
      }
  }
  return (
  <div className="parent">
    <Form>
      <br/>

      <FormButton
        secondary
        content={"Launch Qualitrics Survey"}
        onClick={(e) => {
          e.preventDefault();
          window.open(
            "https://sapsandbox.eu.qualtrics.com/jfe/preview/SV_0udKZhVnildVavk?Q_CHL=preview&Q_SurveyVersionID=current",
            "_blank"
          );
        }}
      ></FormButton>
      <Text content="Supplier Details" size="medium" />
      <Text content={poDetailsForm.supplierDetails} size="medium" weight="semibold" />
      <Flex gap="gap.smaller">
        <Text content="Purchasing Group: " size="small" />
        <Text content={poDetailsForm.purchaseGroup} size="small" />
      </Flex>
      <Flex gap="gap.small">
        <FormInput
          label="Purchase Order"
          name="poNumber"
          disabled
          value={poDetailsForm.purchasingDoc}
        />
        <FormDropdown
          label={{ content: `Item:`, id: itemLabelId }}
          items={poDetailsForm.items} 
          aria-labelledby={itemLabelId}
          onChange={(_, item) => {
              selectedPoItem = item.value as string;
            }
          }
          defaultActiveSelectedIndex={defaultIndex}
        />
      </Flex>
      <Flex hAlign="start">
        <FormButton primary content="Search Order" onClick={() => {
          fetchPODetails();
        }}/>
      </Flex>
    </Form>
    <br />
    {/* Tabs - Order Sumamry*/}
    <Tabs>
      <TabList>
        <Tab>Order Summary</Tab>
        <Tab>Confirmations</Tab>
      </TabList>
      <TabPanel>
      <Flex>
          <Flex.Item size="size.half">
            <Text content="Material" size="medium" />
          </Flex.Item>
          <Flex.Item size="size.half">
            <Text content="PO Quantity" size="medium" />
          </Flex.Item>
          <Flex.Item size="size.half">
            <Text content="Order Unit" size="medium" />
          </Flex.Item>
        </Flex>
        <Flex>
          <Flex.Item size="size.half">
            <Text content={material} size="medium" weight="semibold"/>
          </Flex.Item>
          <Flex.Item size="size.half">
            <Text content={poQuantity} size="medium" weight="semibold"/>
          </Flex.Item>
          <Flex.Item size="size.half">
            <Text content={orderUnit} size="medium" weight="semibold"/>
          </Flex.Item>
        </Flex>
        <br />
        <Flex>
          <Flex.Item size="size.half">
            <Text content="Delivery Date" size="medium" />
          </Flex.Item>
          <Flex.Item size="size.half">
            <Text content="Plant" size="medium" />
          </Flex.Item>
        </Flex>
        <Flex>
          <Flex.Item size="size.half">
            <Text content={deliveryDate} size="medium" weight="semibold"/>
          </Flex.Item>
          <Flex.Item size="size.half">
            <Text content={plant} size="medium" weight="semibold"/>
          </Flex.Item>
        </Flex>
        <br />
        <Flex>
          <Text content="Short Text" />
        </Flex>
        <Text weight="semibold" content={shortText} />
        <br />
      </TabPanel>
      <TabPanel>
        <Flex gap="gap.small">
          <Form>
            <FormInput
              label="Order Acknowledgement Number"
              name="orderAckNumber"
              disabled
              value={orderAckNumber}
            />
          </Form>
        </Flex>
        <br />
        <Flex gap="gap.medium">
          <Text weight="semibold" content="Confirmations" />
          <Button primary content="+Add" onClick={() => {
            addConfirmationPanel();
          }}/>
        </Flex>
        <Accordion defaultActiveIndex={[0]} panels={supConfirmationPanels} />
        {/*
          defaultActiveIndex={[0]} panels={supConfirmationPanels}
        */}
      </TabPanel>
    </Tabs>
  </div>
  )
}
