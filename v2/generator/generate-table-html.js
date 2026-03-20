#!/usr/bin/node
// generate-table-html.js
// Reads ../inputs/tableinput.json and writes ../outputs/table/frontend/<entity>.table.html
// - includes p-columnFilter when filterable === true
// - includes p-sortIcon when sortable === true
// - uses label for header text
// - does not add any header class

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'inputs', 'tableinput.json');
if (!fs.existsSync(inputPath)) {
  console.error('Missing ../inputs/tableinput.json — create it first.');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// defaults and simple validation
const entity = cfg.entity || 'entity';
const columns = Array.isArray(cfg.columns) ? cfg.columns : [];
const tableVar = cfg.tableVar || 'masterData';
const rowVar = cfg.rowVar || 'row';
const scrollHeight = cfg.scrollHeight || '45rem';
const filterDelay = Number.isFinite(cfg.filterDelay) ? cfg.filterDelay : 1;
const selection = cfg.selection === true;

// helpers
function headerTh(col) {
  const field = col.name;
  const label = (col.label || field);
  const sortable = !!col.sortable;
  const filterable = !!col.filterable;
  const filterType = col.type === 'date' ? 'date' : 'text';
  const filterDisplay = col.filterDisplay || 'menu';

  let html = `      <th${sortable ? ` pSortableColumn="${field}"` : ''}>\n`;
  html += `        <div class="flex justify-content-between align-items-center">\n`;
  html += `          ${label}\n`;
  if (sortable) html += `          <p-sortIcon field="${field}"></p-sortIcon>\n`;
  if (filterable) html += `          <p-columnFilter type="${filterType}" field="${field}" display="${filterDisplay}" class="ml-auto"></p-columnFilter>\n`;
  html += `        </div>\n`;
  html += `      </th>\n`;
  return html;
}

function bodyTd(col) {
  return `      <td>{{${rowVar}.${col.name}}}</td>\n`;
}

// build header block
let headerBlock = '';
for (const col of columns) {
  headerBlock += headerTh(col);
}

// build body block
let bodyBlock = '';
for (const col of columns) {
  bodyBlock += bodyTd(col);
}

// action column (you can customize click handler/args in JSON later)
const actionBlockHeader = `      <th>\n        <div class="flex justify-content-between align-items-center">\n          Action\n        </div>\n      </th>\n`;

const actionButton = `                <p-button label="EDIT" icon="pi pi-pencil" iconPos="left" severity="warn" (click)="modify(${rowVar})"></p-button>\n`;

// selection attribute
const selectionAttr = selection ? ' [selection]="true"' : '';

// Compose final HTML
const html = `<p-table #tables [value]="${tableVar}" stripedRows="true" [scrollable]="true"
          scrollHeight="${scrollHeight}" [rowHover]="true" [loading]="isLoading" [filterDelay]="${filterDelay}"${selectionAttr}>
  <ng-template pTemplate="header">
${headerBlock}${actionBlockHeader}
    <!-- <th>
        <div class="flex justify-content-between align-items-center">
          Status
        </div>
      </th> -->
  </ng-template>

  <ng-template pTemplate="body" let-${rowVar}>
    <tr>
${bodyBlock}      <td>
${actionButton}      </td>
    </tr>
  </ng-template>
</p-table>
`;

// ensure output dir
const outDir = path.join(__dirname, '..', 'outputs', 'table', 'frontend');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, `${entity}.table.html`);
fs.writeFileSync(outFile, html, 'utf8');

console.log('Generated table HTML:', outFile);
