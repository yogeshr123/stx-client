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
        field: 'STATUS'
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

export { versionTableColumns, ENV_NAME };
