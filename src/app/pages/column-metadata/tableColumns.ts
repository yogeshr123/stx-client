const versionTableColumns = [
    {
        header: 'METADATA_VERSION',
        field: 'METADATA_VERSION'
    },
    {
        header: 'TABLE_NAME',
        field: 'TABLE_NAME'
    },
    {
        header: 'STATUS',
        field: 'STATUS'
    },
    {
        header: 'START_DATE',
        field: 'START_DATE',
        type: 'date'
    },
    {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date'
    }
];

const ENV_NAME = [
    { label: 'PRD', value: 'PRD' },
    { label: 'DEV', value: 'DEV' }
];

const columnTableColumns = [
    {
        header: 'IS_DATATYPE_CHANGED',
        field: 'IS_DATATYPE_CHANGED',
        type: 'icon'
    },
    {
        header: 'IS_RENAMED',
        field: 'IS_RENAMED',
        type: 'icon'
    },
    {
        header: 'IS_NEW',
        field: 'IS_NEW',
        type: 'icon'
    },
    {
        header: 'TARGET_COLUMN_ID',
        field: 'TARGET_COLUMN_ID'
    },
    {
        header: 'SRC_COLUMN_NAME',
        field: 'SRC_COLUMN_NAME'
    },
    {
        header: 'SRC_COLUMN_TYPE',
        field: 'SRC_COLUMN_TYPE'
    },
    {
        header: 'SRC_DATA_TYPE',
        field: 'SRC_DATA_TYPE'
    },
    {
        header: 'TARGET_COLUMN_NAME',
        field: 'TARGET_COLUMN_NAME'
    },
    {
        header: 'TARGET_DATA_TYPE',
        field: 'TARGET_DATA_TYPE'
    },
    {
        header: 'LOOKUP_TABLE_ALIAS',
        field: 'LOOKUP_TABLE_ALIAS'
    },
    {
        header: 'IS_PKEY_COLUMN',
        field: 'IS_PKEY_COLUMN',
        type: 'boolean'
    },
    {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date'
    },
    {
        header: 'INTERNAL_COLUMN',
        field: 'INTERNAL_COLUMN',
        type: 'boolean'
    },
    {
        header: 'PREDEFINED_VALUE',
        field: 'PREDEFINED_VALUE'
    },
    {
        header: 'IS_PARTITION_COLUMN',
        field: 'IS_PARTITION_COLUMN',
        type: 'boolean'
    },
    {
        header: 'IS_UPDATE_DATE_COLUMN',
        field: 'IS_UPDATE_DATE_COLUMN',
        type: 'boolean'
    },
    {
        header: 'METADATA_VERSION',
        field: 'METADATA_VERSION'
    }
];

const lookUpColumns = [
    {
        header: 'SCHEMA_NAME',
        field: 'SCHEMA_NAME'
    },
    {
        header: 'TABLE_NAME',
        field: 'TABLE_NAME'
    },
    {
        header: 'LOOKUP_SCHEMA_NAME',
        field: 'LOOKUP_SCHEMA_NAME'
    },
    {
        header: 'LOOKUP_TABLE_NAME',
        field: 'LOOKUP_TABLE_NAME'
    },
    {
        header: 'LOOKUP_TABLE_ALIAS',
        field: 'LOOKUP_TABLE_ALIAS'
    },
    {
        header: 'COLUMN_NAME_PREFIX',
        field: 'COLUMN_NAME_PREFIX'
    },
    {
        header: 'LOOKUP_JOIN_KEYS',
        field: 'LOOKUP_JOIN_KEYS'
    },
    {
        header: 'METADATA_VERSION',
        field: 'METADATA_VERSION'
    },
    {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date'
    },
];

export { versionTableColumns, ENV_NAME, columnTableColumns, lookUpColumns };
