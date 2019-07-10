const columnTableColumns = [
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
        header: 'STATUS',
        field: 'STATUS'
    },
    {
        header: 'HEADER COLUMNS',
        field: 'HEADER_COLUMNS'
    },
    {
        header: 'UPDATE DATE',
        field: 'UPDATE_DATE'
    },
    {
        header: 'INSERT DATE',
        field: 'INSERT_DATE'
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
        field: 'INSERT_DATE'
    }
];



export { columnTableColumns, headerMismatchesTableCols };
