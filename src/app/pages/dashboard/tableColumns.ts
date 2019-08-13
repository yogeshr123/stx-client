const EMRTableLoadingStatus = [
    { field: 'SCHEMA_NAME', header: 'SCHEMA_NAME' },
    { field: 'TABLE_NAME', header: 'TABLE_NAME' },
    { field: 'LOAD_STRATEGY', header: 'LOAD_STRATEGY' },
    { field: 'T1_PROCESS_END_DATE', header: 'T1_PROCESS_END_DATE', type: 'date' },
    { field: 'T2_PROCESS_END_DATE', header: 'T2_PROCESS_END_DATE', type: 'date' },
    { field: 'AS_OF', header: 'AS_OF', type: 'dateNow' }
];

export { EMRTableLoadingStatus };
