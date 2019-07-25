const columnTableColumns = [
    {
        header: 'SCHEMA_NAME',
        field: 'SCHEMA_NAME'
    },
    {
        header: 'TABLE_NAME',
        field: 'TABLE_NAME'
    },
    {
        header: 'HEADER_HASH',
        field: 'HEADER_HASH'
    },
    {
        header: 'STATUS',
        field: 'STATUS'
    },
    {
        header: 'HEADER_COLUMNS',
        field: 'HEADER_COLUMNS'
    },
    {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date'
    },
    {
        header: 'INSERT_DATE',
        field: 'INSERT_DATE',
        type: 'date'
    }
];

const headerMismatchesTableCols = [
    {
        header: 'SCHEMA NAME',
        field: 'SCHEMA_NAME'
    },
    {
        header: 'TABLE NAME',
        field: 'TABLE_NAME'
    },
    {
        header: 'HEADER HASH',
        field: 'HEADER_HASH'
    },
    {
        header: 'COLUMN STATUS',
        field: 'COLUMN_STATUS'
    },
    {
        header: 'STATUS',
        field: 'STATUS'
    },
    {
        header: 'COLUMN NAME',
        field: 'COLUMN_NAME'
    },
    {
        header: 'DATA TYPE',
        field: 'DATA_TYPE'
    },
    {
        header: 'SAMPLE VALUES',
        field: 'SAMPLE_VALUES'
    },
    {
        header: 'INSERT DATE',
        field: 'INSERT_DATE',
        type: 'date'
    }
];



export { columnTableColumns, headerMismatchesTableCols };
