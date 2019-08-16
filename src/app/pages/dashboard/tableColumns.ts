const EMRTableLoadingStatus = [
    { field: 'SCHEMA_NAME', header: 'SCHEMA_NAME' },
    { field: 'TABLE_NAME', header: 'TABLE_NAME' },
    { field: 'LOAD_STRATEGY', header: 'LOAD_STRATEGY' },
    { field: 'T1_PROCESS_END_DATE', header: 'T1_PROCESS_END_DATE', type: 'date' },
    { field: 'T2_PROCESS_END_DATE', header: 'T2_PROCESS_END_DATE', type: 'date' },
    { field: 'AS_OF', header: 'AS_OF', type: 'dateNow' }
];

const loadStatusColumns = [
    { field: 'SCHEMA_NAME' },
    { field: 'Fully Loading' },
    { field: 'Error Hold' },
    { field: 'Hold All Processes' },
    { field: 'Hold Tier 2/3' },
    { field: 'Hold Table DDL Needed' },
    { field: 'Low Priority Table On Hold' },
    { field: 'No Data Feed' },
    { field: 'Grand Total' }
];

const dataLatencySummaryColumns = [
    { field: 'SCHEMA_NAME' },
    { field: 'Current' },
    { field: 'Data < 1 Week' },
    { field: 'Data < 2 Week' },
    { field: 'Data < 3 Week' },
    { field: 'Data < 4 Week' },
    { field: 'Data < 8 Week' },
    { field: 'Data <=13 Week' },
    { field: 'Data <=18 Week' },
    { field: 'Data <=26 Week' },
];

export { EMRTableLoadingStatus, loadStatusColumns, dataLatencySummaryColumns };
