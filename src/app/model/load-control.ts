export const LoadControl = [
    { columnName: "SCHEMA_NAME", dataType: "VARCHAR", insert: "TRUE", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "TABLE_NAME", dataType: "VARCHAR", insert: "TRUE", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ENV_NAME", dataType: "VARCHAR", insert: "TRUE", edit: "", inputType: "select", valueSet: "PRD, DEV, QA" },
    { columnName: "TARGET_SCHEMA_NAME", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "TARGET_TABLE_NAME", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "EMAIL_ALERTS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "Y,N" },
    { columnName: "TABLE_SOURCE", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "RAW_FACTORY, ORACLE" },
    { columnName: "LOAD_STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "INSERT, UPDATE, REFRESH, SAMPLED" },
    { columnName: "RAW_FACTORY_PATH", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "RAW_FACTORY_RETENTION_STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "NONE, GLACIER, DELETE" },
    { columnName: "RAW_FACTORY_RETENTION_DAYS", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_ID", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_SCHEMA", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_TABLE", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_TABLE_PK_COLUMNS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_TABLE_UPDATE_DATE_COLUMN", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T1_PATH", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T1_RETENTION_STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "NONE, GLACIER, DELETE" },
    { columnName: "T1_RETENTION_DAYS", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T2_T3_RETENTION_STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "NONE, GLACIER, DELETE" },
    { columnName: "T2_T3_RETENTION_DAYS", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD, EDW_RETIRED, NO_FACTORY_DATA" },
    { columnName: "ETL_DAG_NAME", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_DAG_RUN_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_DAG_RUN_URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_PROCESS_START_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_PROCESS_END_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_EXECUTION_STATUS", dataType: "VARCHAR", insert: "", edit: "", inputType: "select", valueSet: "TODO, RUNNING, COMPLETE" },
    { columnName: "ETL_PROCESS", dataType: "VARCHAR", insert: "", edit: "", inputType: "select", valueSet: "T1, T2, T3, T1T2, ANALYZE" },
    { columnName: "T1_STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD" },
    { columnName: "T1_BATCH_IN_DAYS", dataType: "DECIMAL", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "1" },
    { columnName: "T1_MAX_LOAD_END_DATE", dataType: "TIMESTAMP", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T1_CLUSTER_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_LIVY_BATCH_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_SPARK_APP_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_SPARK_UI_URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_SPARK_LOG_URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_PROCESS_START_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_PROCESS_END_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_EXECUTION_STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO,RUNNING, FAILED, COMPLETE, NO_TS_INDEX, NO_DATA, FILE_HEADER_UPDATING, T2_METADATA_UPDATING, EHC_METADATA_MISMATCH" },
    { columnName: "T1_ERROR", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_ERROR_TRACE", dataType: "TEXT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD" },
    { columnName: "T2_INSERT_DIR_BATCH_SIZE", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T2_PARTITION_JOB_TYPE", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "SINGLE, MULTIPLE" },
    { columnName: "T2_MAX_LOAD_END_DATE", dataType: "TIMESTAMP", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "1/1/1900" },
    { columnName: "T2_MAX_ATLAS_VERSION", dataType: "BIGINT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_CLUSTER_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_LIVY_BATCH_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_SPARK_APP_ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_SPARK_UI_URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_SPARK_LOG_URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_PROCESS_START_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_PROCESS_END_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_EXECUTION_STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "TODO,RUNNING, FAILED, COMPLETE, NO_DATA, FILE_HEADER_UPDATING, T2_METADATA_UPDATING, EHC_METADATA_MISMATCH" },
    { columnName: "T2_ERROR", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_ERROR_TRACE", dataType: "TEXT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_STATUS", dataType: "VARCHAR", insert: "", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD" },
    { columnName: "ANALYZE_EXECUTION_DAYS", dataType: "INT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_LAST_SUCCESS_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_PROCESS_START_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_PROCESS_END_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_EXECUTION_STATUS", dataType: "VARCHAR", insert: "", edit: "TRUE", inputType: "select", valueSet: "TODO,RUNNING, FAILED, COMPLETE" },
    { columnName: "ANALYZE_ERROR", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_ERROR_TRACE", dataType: "TEXT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "UPDATE_DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "UPDATED_BY", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
]






