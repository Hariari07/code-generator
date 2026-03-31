[
  {
    "tableName": "signup",
    "dbName": "hlmmasters",
    "primaryKey": "id",
    "fields": [
      "idsignup",
      "branchName",
      "userName",
      "password",
      "emailid",
      "referalCode",     
      "activeStatus"
    ],
    "frontEndCommanUrl": "/register",
    "frontend": {
      "formName": "signupForm",
      "columns": 1,
      "fields": [
        {
          "fieldName": "idsignup",
          "label": "Idsignup",
          "type": "text",
          "primengModule": "InputText",
          "required": true
        },
        {
          "fieldName": "branchName",
          "label": "Branch Name",
          "type": "text",
          "primengModule": "Select",
          "required": true,
          "options": ["default"]
        },
        {
          "fieldName": "userName",
          "label": "User Name",
          "type": "text",
          "primengModule": "InputText",
          "required": true
        },
        {
          "fieldName": "password",
          "label": "Password",
          "type": "password",
          "primengModule": "password",
          "required": true
        },
        {
          "fieldName": "emailid",
          "label": "Emailid",
          "type": "email",
          "primengModule": "InputText",
          "required": true
        },
        {
          "fieldName": "referalCode",
          "label": "Referal Code",
          "type": "text",
          "primengModule": "InputNumber",
          "required": true
        },
        {
          "fieldName": "activeStatus",
          "label": "Active Status",
          "type": "text",
          "primengModule": "InputText",
          "required": true
        }
      ]
    }
  }
]


## Table Generateor
{
  "entity": "tenderItems",
  "columns": [
    {
      "name": "itemName",
      "label": "Item Name",
      "type": "text",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "specification",
      "label": "Specification",
      "type": "text",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "quantity",
      "label": "quantity",
      "type": "text",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "doj",
      "label": "Joining Date",
      "type": "date",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "doj",
      "label": "Joining Month",
      "type": "date",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "doj",
      "label": "Joining Year",
      "type": "date",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "designation",
      "label": "Designation",
      "type": "text",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "department",
      "label": "Department",
      "type": "text",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "workingStatus",
      "label": "Working Status",
      "type": "text",
      "sortable": true,
      "filterable": true
    },
    {
      "name": "dateOfExit",
      "label": "Date of Exit",
      "type": "date",
      "sortable": true,
      "filterable": false      
    }
  ]
}
