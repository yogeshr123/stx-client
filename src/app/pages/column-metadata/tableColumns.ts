const versionTableColumns = [
    {
        header: 'Table Name',
        field: 'TABLE_NAME'
    },
    {
        header: 'Version',
        field: 'METADATA_VERSION'
    },
    {
        header: 'Status',
        field: 'STATUS',
        value: 'NEW'
    },
    {
        header: 'Start Date Time',
        field: 'START_DATE'
    },
    {
        header: 'Updated Date Time',
        field: 'UPDATE_DATE'
    }
];

const ENV_NAME = [
    { label: 'PRD', value: 'PRD' },
    { label: 'DEV', value: 'DEV' }
];

const columnTableColumns = [
    {
        header: 'TARGET COLUMN ID',
        field: 'TARGET_COLUMN_ID'
    },
    {
        header: 'SRC COLUMN NAME',
        field: 'SRC_COLUMN_NAME'
    },
    {
        header: 'SRC COLUMN TYPE',
        field: 'SRC_COLUMN_TYPE'
    },
    {
        header: 'SRC DATA TYPE',
        field: 'SRC_DATA_TYPE'
    },
    {
        header: 'TARGET COLUMN NAME',
        field: 'TARGET_COLUMN_NAME'
    },
    {
        header: 'TARGET DATA TYPE',
        field: 'TARGET_DATA_TYPE'
    },
    {
        header: 'PRIMARY KEY',
        field: 'IS_PKEY_COLUMN',
        type: 'boolean'
    },
    {
        header: 'DATE UPDATED',
        field: 'UPDATE_DATE',
        type: 'date'
    },
    {
        header: 'INTERNAL COLUMN',
        field: 'INTERNAL_COLUMN',
        type: 'boolean'
    },
    {
        header: 'PREDEFINED VALUE',
        field: 'PREDEFINED_VALUE'
    },
    {
        header: 'IS PARTITION COLUMN',
        field: 'IS_PARTITION_COLUMN',
        type: 'boolean'
    },
    {
        header: 'IS UPDATE_DATE COLUMN',
        field: 'IS_UPDATE_DATE_COLUMN',
        type: 'boolean'
    },
    {
        header: 'IS DATATYPE CHANGED',
        field: 'IS_DATATYPE_CHANGED',
        type: 'boolean'
    },
    {
        header: 'IS RENAMED',
        field: 'IS_RENAMED',
        type: 'boolean'
    },
    {
        header: 'IS NEW',
        field: 'IS_NEW',
        type: 'boolean'
    }
];

export { versionTableColumns, ENV_NAME, columnTableColumns };
