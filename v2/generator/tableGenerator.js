#!/usr/bin/node

const fs = require('fs');
const path = require('path');

// ---------- CONFIG ----------

// SQL input file
const sqlFile = path.join(__dirname, "../sqlCode/table.sql");

// Output directories
const outputDir = path.join(__dirname, "../outputs/table");
const backendDir = path.join(outputDir, "backend");
const frontendDir = path.join(outputDir, "frontend");

// ---------- UTILITIES ----------

// Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Convert SQL CREATE TABLE to JSON columns
function sqlToJsonColumns(sql) {
  const tableMatch = sql.match(/CREATE TABLE IF NOT EXISTS `.*`\.`(.*)`/i);
  const entity = tableMatch ? tableMatch[1] : 'unknown_table';

  const columnsMatch = sql.match(/\(([\s\S]*?)\)\s*ENGINE/i);
  if (!columnsMatch) return null;

  const columnsDef = columnsMatch[1];
  const columnLines = columnsDef.split(/,(?![^(]*\))/);

  const columns = [];

  columnLines.forEach(line => {
    line = line.trim();
    if (/^(PRIMARY|UNIQUE|FOREIGN|KEY)/i.test(line)) return;

    const parts = line.split(/\s+/);
    const colName = parts[0].replace(/`/g, '');
    columns.push(colName);
  });

  return { entity, columns };
}

// ---------- READ SQL FILE ----------
const sqlCode = fs.readFileSync(sqlFile, 'utf8');
const { entity, columns } = sqlToJsonColumns(sqlCode);
const EntityName = entity.charAt(0).toUpperCase() + entity.slice(1);

// ---------- BACKEND TEMPLATES ----------

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
            if(!id) return res.status(400).json({error: "id missing"});
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

// ---------- FRONTEND TEMPLATES ----------

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

// ---------- P-TABLE HTML ----------

const pTableHeaderRow = columns.map(c => {
  const filterType = /date|time/i.test(c) ? 'date' : 'text';
  const colClass = /msg|justify/i.test(c) ? 'c-400' : '';
  return `
          <th pSortableColumn="${c}" class="myStyleHeader ${colClass}">
            <div class="flex justify-content-between align-items-center">
              ${c.charAt(0).toUpperCase() + c.slice(1)}
              <p-sortIcon field="${c}"></p-sortIcon>
              <p-columnFilter type="${filterType}" field="${c}" display="menu" class="ml-auto"></p-columnFilter>
            </div>
          </th>`;
}).join('\n');

const pTableBodyRow = columns.map(c => {
  if (/date|time/i.test(c)) return `          <td>{{ product.${c} | date:'dd/MM/yyyy' }}</td>`;
  return `          <td>{{ product.${c} }}</td>`;
}).join('\n');

const tableComponentHtml = `
<p-table #tables [value]="${entity}Data" stripedRows="true" [paginator]="true" [rows]="20"
         [totalRecords]="totalRecords" [lazy]="true" (onLazyLoad)="load${EntityName}($event)"
         [loading]="loading" [scrollable]="true" scrollHeight="480px" [rowHover]="true"
         [rowsPerPageOptions]="[20, 40, 60, 80, 100, 200, 500, 1000, 2000]"
         emptyMessage="No records found matching your filters">
  <ng-template pTemplate="header">
    <tr>
${pTableHeaderRow}
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-product>
    <tr class="wrapText">
${pTableBodyRow}
    </tr>
  </ng-template>

  <ng-template pTemplate="emptymessage">
    <tr>
      <td colspan="${columns.length}" class="text-center" style="font-weight: bolder;">
        No records found. Please try filtering with different values.
      </td>
    </tr>
  </ng-template>
</p-table>
`.trim();

// ---------- ANGULAR COMPONENT ----------

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
  totalRecords = 0;
  loading = false;

  constructor(private service: ${EntityName}Service){}

  ngOnInit(){
    this.load${EntityName}({ first:0, rows:20 });
  }

  load${EntityName}(event: any){
    this.loading = true;
    this.service.getAll().subscribe(data => {
      this.${entity}Data = data;
      this.totalRecords = data.length;
      this.loading = false;
    });
  }
}
`.trim();

// ---------- WRITE FILES ----------

// Backend directories
ensureDir(path.join(backendDir, 'models'));
ensureDir(path.join(backendDir, 'services'));
ensureDir(path.join(backendDir, 'controllers'));
ensureDir(path.join(backendDir, 'routes'));

// Frontend directory
ensureDir(frontendDir);

// Backend files
fs.writeFileSync(path.join(backendDir, `models/${entity}.model.js`), modelContent);
fs.writeFileSync(path.join(backendDir, `services/${entity}.service.js`), serviceContent);
fs.writeFileSync(path.join(backendDir, `controllers/${entity}.controller.js`), controllerContent);
fs.writeFileSync(path.join(backendDir, `routes/${entity}.routes.js`), routesContent);

// Frontend files
fs.writeFileSync(path.join(frontendDir, `${entity}.interface.ts`), interfaceContent);
fs.writeFileSync(path.join(frontendDir, `${entity}.service.ts`), frontendServiceContent);
fs.writeFileSync(path.join(frontendDir, `${entity}-table.component.html`), tableComponentHtml);
fs.writeFileSync(path.join(frontendDir, `${entity}-table.component.ts`), tableComponentTs);

console.log("Generation completed successfully!");