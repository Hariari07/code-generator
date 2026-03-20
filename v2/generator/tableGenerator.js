#!/usr/bin/node

const fs = require('fs');
const path = require('path');

// Load JSON config
const config = JSON.parse(fs.readFileSync('../inputs/tableinput.json', 'utf8'));
const entity = config.entity;
const columns = config.columns;
const EntityName = entity.charAt(0).toUpperCase() + entity.slice(1);

// ensure directories
const ensureDir = (p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

// BACKEND TEMPLATES
const modelContent = `
const pool = require('../db');

class ${EntityName}Model {
    static async getAll() {
        const [rows] = await pool.query('SELECT ${columns.join(', ')} FROM ${entity}');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(
            'SELECT ${columns.join(', ')} FROM ${entity} WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}
module.exports = ${EntityName}Model;
`.trim();

const serviceContent = `
const ${EntityName}Model = require('../models/${entity}.model');

class ${EntityName}Service {
    static async getAll() {
        return await ${EntityName}Model.getAll();
    }

    static async getById(id) {
        return await ${EntityName}Model.getById(id);
    }
}
module.exports = ${EntityName}Service;
`.trim();

const controllerContent = `
const ${EntityName}Service = require('../services/${entity}.service');

class ${EntityName}Controller {
    static async getAll(req, res) {
        try {
            const data = await ${EntityName}Service.getAll();
            return res.json(data);
        } catch(e){
            return res.status(500).json({error: e.message});
        }
    }

    static async getOne(req, res) {
        try {
            const { id } = req.body;
            if(!id){
                return res.status(400).json({error: "id missing"});
            }
            const data = await ${EntityName}Service.getById(id);
            return res.json(data);
        } catch(e){
            return res.status(500).json({error: e.message});
        }
    }
}
module.exports = ${EntityName}Controller;
`.trim();

const routesContent = `
const express = require('express');
const router = express.Router();
const ${EntityName}Controller = require('../controllers/${entity}.controller');

router.get('/', ${EntityName}Controller.getAll);
router.post('/getOne', ${EntityName}Controller.getOne);

module.exports = router;
`.trim();

//
// FRONTEND TEMPLATES
//
const interfaceContent = `
export interface ${EntityName} {
${columns.map(c => `  ${c}: any;`).join('\n')}
}
`.trim();

const frontendServiceContent = `
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ${EntityName} } from './${entity}.interface';

@Injectable({ providedIn: 'root' })
export class ${EntityName}Service {
  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get<${EntityName}[]>('/api/${entity}');
  }

  getById(id: number){
    return this.http.post<${EntityName}>('/api/${entity}/getOne', { id });
  }
}
`.trim();

//
// P-TABLE (clean header, no class)
//
const pTableHeaderRow = columns.map(c =>
`      <th pSortableColumn="${c}">
        ${c}
        <p-sortIcon field="${c}"></p-sortIcon>
      </th>`
).join('\n');

const pTableBodyRow = columns.map(c =>
`      <td>{{row.${c}}}</td>`
).join('\n');

const tableComponentHtml = `
<p-table [value]="${entity}Data" [scrollable]="true" scrollHeight="450px">
  <ng-template pTemplate="header">
    <tr>
${pTableHeaderRow}
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-row>
    <tr>
${pTableBodyRow}
    </tr>
  </ng-template>
</p-table>
`.trim();

//
// Angular Component
//
const tableComponentTs = `
import { Component, OnInit } from '@angular/core';
import { ${EntityName}Service } from './${entity}.service';
import { ${EntityName} } from './${entity}.interface';

@Component({
  selector: 'app-${entity}-table',
  templateUrl: './${entity}-table.component.html'
})
export class ${EntityName}TableComponent implements OnInit {
  ${entity}Data: ${EntityName}[] = [];

  constructor(private service: ${EntityName}Service){}

  ngOnInit(){
    this.service.getAll().subscribe(data => this.${entity}Data = data);
  }
}
`.trim();

const formControls = columns.map(c => `      ${c}: [''],`).join('\n');

//
// Dialog
//
const editDialogHtml = `
<p-dialog [(visible)]="showEdit" header="Edit ${EntityName}" modal="true">
 <form [formGroup]="form">
${columns.map(c => `  <input formControlName="${c}" placeholder="${c}" />`).join('\n')}
 </form>
</p-dialog>
`.trim();

const editDialogTs = `
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
 selector: 'app-${entity}-edit',
 templateUrl: './${entity}-edit.component.html'
})
export class ${EntityName}EditComponent {
  form: FormGroup;
  showEdit = false;

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
${formControls}
    });
  }
}
`.trim();

//
// WRITE FILES
//
ensureDir('../outputs/table/backend/models');
ensureDir('../outputs/table/backend/services');
ensureDir('../outputs/table/backend/controllers');
ensureDir('../outputs/table/backend/routes');

fs.writeFileSync(`../outputs/table/backend/models/${entity}.model.js`, modelContent);
fs.writeFileSync(`../outputs/table/backend/services/${entity}.service.js`, serviceContent);
fs.writeFileSync(`../outputs/table/backend/controllers/${entity}.controller.js`, controllerContent);
fs.writeFileSync(`../outputs/table/backend/routes/${entity}.routes.js`, routesContent);

// frontend
ensureDir('../outputs/table/frontend');
fs.writeFileSync(`../outputs/table/frontend/${entity}.interface.ts`, interfaceContent);
fs.writeFileSync(`../outputs/table/frontend/${entity}.service.ts`, frontendServiceContent);
fs.writeFileSync(`../outputs/table/frontend/${entity}-table.component.html`, tableComponentHtml);
fs.writeFileSync(`../outputs/table/frontend/${entity}-table.component.ts`, tableComponentTs);
fs.writeFileSync(`../outputs/table/frontend/${entity}-edit.component.html`, editDialogHtml);
fs.writeFileSync(`../outputs/table/frontend/${entity}-edit.component.ts`, editDialogTs);

console.log('Generation completed successfully');
