#!/usr/bin/node

const fs = require('fs');
const path = require('path');

// Load JSON config
const configPath = path.join(__dirname, '../inputs/tableinput.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const entity = config.entity;
const columns = config.columns;

// Ensure output directory
const outputDir = path.join(__dirname, '../outputs/table/frontend');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Generate P-Table header
const pTableHeaderRow = columns.map(c =>
`      <th${c.sortable ? ` pSortableColumn="${c.name}"` : ''}>
        ${c.label}
        ${c.sortable ? `<p-sortIcon field="${c.name}"></p-sortIcon>` : ''}
      </th>`).join('\n');

// Generate P-Table body
const pTableBodyRow = columns.map(c =>
`      <td>{{row.${c.name}}}</td>`).join('\n');

// Generate full table HTML
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

// Write file
const outputPath = path.join(outputDir, `${entity}-table.component.html`);
fs.writeFileSync(outputPath, tableComponentHtml);

console.log(`Table HTML generated successfully at ${outputPath}`);