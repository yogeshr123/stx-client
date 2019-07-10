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
        field: 'IS_PKEY_COLUMN'
    },
    {
        header: 'DATE UPDATED',
        field: 'UPDATE_DATE'
    },
    {
        header: 'INTERNAL COLUMN',
        field: 'INTERNAL_COLUMN'
    },
    {
        header: 'PREDEFINED_VALUE',
        field: 'PREDEFINED_VALUE'
    },
    {
        header: 'IS_PARTITION_COLUMN',
        field: 'IS_PARTITION_COLUMN'
    },
    {
        header: 'IS_UPDATE_DATE_COLUMN',
        field: 'IS_UPDATE_DATE_COLUMN'
    },
    {
        header: 'IS_DATATYPE_CHANGED',
        field: 'IS_DATATYPE_CHANGED'
    },
    {
        header: 'IS_RENAMED',
        field: 'IS_RENAMED'
    },
    {
        header: 'IS_NEW',
        field: 'IS_NEW'
    }
];

export { versionTableColumns, ENV_NAME, columnTableColumns };
