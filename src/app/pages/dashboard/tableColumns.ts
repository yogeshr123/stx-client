const EMRTableLoadingStatus = [
    { field: 'SCHEMA_NAME', header: 'SCHEMA_NAME' },
    { field: 'TABLE_NAME', header: 'TABLE_NAME' },
    { field: 'LOAD_STRATEGY', header: 'LOAD_STRATEGY' },
    { field: 'TABLE_STATUS', header: 'TABLE_STATUS' },
    { field: 'T1_MAX_LOAD_END_DATE', header: 'T1_MAX_LOAD_END_DATE', type: 'date' },
    { field: 'T2_MAX_LOAD_END_DATE', header: 'T2_MAX_LOAD_END_DATE', type: 'date' },
    // { field: 'AS_OF', header: 'AS_OF', type: 'dateNow' }
];

const loadingStatusSelectedColumns = [
    { field: 'SCHEMA_NAME' },
    { field: 'NEW_TABLE' },
    { field: 'COMPLETE' },
    { field: 'RUNNING' },
    { field: 'HOLD' },
    { field: 'EDW_RETIRED' },
    { field: 'TODO' },
    { field: 'T1_FAILED' },
    { field: 'T1_NO_DATA' },
    { field: 'T2_FAILED' },
    { field: 'T2_NO_DATA' }
];

const loadStatusColumns = [
    { field: 'SCHEMA_NAME' },
    { field: 'NEW_TABLE' },
    { field: 'COMPLETE' },
    { field: 'RUNNING' },
    { field: 'HOLD' },
    { field: 'EDW_RETIRED' },
    { field: 'NO_FACTORY_DATA' },
    { field: 'TODO' },
    { field: 'T1_FAILED' },
    { field: 'NO_TS_INDEX' },
    { field: 'T1_NO_DATA' },
    { field: 'T2_FAILED' },
    { field: 'T2_NO_DATA' },
    { field: 'COLUMN_METADATA_UPDATING' },
    { field: 'FILE_HEADER_UPDATING' },
    { field: 'EHC_METADATA_MISMATCH' },
];

const dataLatencySummaryColumns = [
    { field: 'SCHEMA_NAME' },
    { field: 'Never run' },
    { field: 'Current' },
    { field: 'Data <= 1 Week' },
    { field: 'Data <= 2 Week' },
    { field: 'Data <= 3 Week' },
    { field: 'Data <= 4 Week' },
    { field: 'Data <= 8 Week' },
    { field: 'Data <= 13 Week' },
    { field: 'Data <= 18 Week' },
    { field: 'Data <= 26 Week' },
    { field: 'Data <= 36 Week' },
    { field: 'Data <= 52 Week' },
    { field: 'Data >= 1 Year' },
];

export { loadingStatusSelectedColumns, EMRTableLoadingStatus, loadStatusColumns, dataLatencySummaryColumns };
