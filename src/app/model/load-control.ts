export const LoadControl = [
    { columnName: "SCHEMA_NAME", displayName: "SCHEMA NAME", dataType: "VARCHAR", insert: "TRUE", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "TABLE_NAME", displayName: "TABLE NAME", dataType: "VARCHAR", insert: "TRUE", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ENV_NAME", displayName: "ENV NAME", dataType: "VARCHAR", insert: "TRUE", edit: "", inputType: "select", valueSet: "PRD, DEV, QA" },
    { columnName: "TARGET_SCHEMA_NAME", displayName: "TARGET SCHEMA NAME", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "TARGET_TABLE_NAME", displayName: "TARGET TABLE NAME", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "EMAIL_ALERTS", displayName: "EMAIL ALERTS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "Y,N" },
    { columnName: "TABLE_SOURCE", displayName: "TABLE SOURCE", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "RAW_FACTORY, ORACLE" },
    { columnName: "LOAD_STRATEGY", displayName: "LOAD STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "INSERT, UPDATE, REFRESH, SAMPLED" },
    { columnName: "RAW_FACTORY_PATH", displayName: "RAW FACTORY PATH", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "RAW_FACTORY_RETENTION_STRATEGY", displayName: "RAW FACTORY RETENTION STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "NONE, GLACIER, DELETE" },
    { columnName: "RAW_FACTORY_RETENTION_DAYS", displayName: "RAW FACTORY RETENTION DAYS", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_ID", displayName: "DB ID", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_SCHEMA", displayName: "DB SCHEMA", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_TABLE", displayName: "DB TABLE", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_TABLE_PK_COLUMNS", displayName: "DB TABLE PK COLUMNS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "DB_TABLE_UPDATE_DATE_COLUMN", displayName: "DB TABLE UPDATE DATE COLUMN", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T1_PATH", displayName: "T1 PATH", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T1_RETENTION_STRATEGY", displayName: "T1 RETENTION STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "NONE, GLACIER, DELETE" },
    { columnName: "T1_RETENTION_DAYS", displayName: "T1 RETENTION DAYS", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T2_T3_RETENTION_STRATEGY", displayName: "T2 T3 RETENTION STRATEGY", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "NONE, GLACIER, DELETE" },
    { columnName: "T2_T3_RETENTION_DAYS", displayName: "T2 T3 RETENTION DAYS", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_STATUS", displayName: "ETL STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD, EDW_RETIRED, NO_FACTORY_DATA" },
    { columnName: "ETL_DAG_NAME", displayName: "ETL DAG NAME", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_DAG_RUN_ID", displayName: "ETL DAG RUN ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_DAG_RUN_URL", displayName: "ETL DAG RUN URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_PROCESS_START_DATE", displayName: "ETL PROCESS START DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_PROCESS_END_DATE", displayName: "ETL PROCESS END DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ETL_EXECUTION_STATUS", displayName: "ETL EXECUTION STATUS", dataType: "VARCHAR", insert: "", edit: "", inputType: "select", valueSet: "TODO, RUNNING, COMPLETE" },
    { columnName: "ETL_PROCESS", displayName: "ETL PROCESS", dataType: "VARCHAR", insert: "", edit: "", inputType: "select", valueSet: "T1, T2, T3, T1T2, ANALYZE" },
    { columnName: "T1_STATUS", displayName: "T1 STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD" },
    { columnName: "T1_BATCH_IN_DAYS", displayName: "T1 BATCH IN DAYS", dataType: "DECIMAL", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "1" },
    { columnName: "T1_MAX_LOAD_END_DATE", displayName: "T1 MAX LOAD END DATE", dataType: "TIMESTAMP", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T1_CLUSTER_ID", displayName: "T1 CLUSTER ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_LIVY_BATCH_ID", displayName: "T1 LIVY BATCH ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_SPARK_APP_ID", displayName: "T1 SPARK APP ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_SPARK_UI_URL", displayName: "T1 SPARK UI URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_SPARK_LOG_URL", displayName: "T1 SPARK LOG URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_PROCESS_START_DATE", displayName: "T1 PROCESS START DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_PROCESS_END_DATE", displayName: "T1 PROCESS END DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_EXECUTION_STATUS", displayName: "T1 EXECUTION STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO,RUNNING, FAILED, COMPLETE, NO_TS_INDEX, NO_DATA, FILE_HEADER_UPDATING, T2_METADATA_UPDATING, EHC_METADATA_MISMATCH" },
    { columnName: "T1_ERROR", displayName: "T1 ERROR", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T1_ERROR_TRACE", displayName: "T1 ERROR TRACE", dataType: "TEXT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_STATUS", displayName: "T2 STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD" },
    { columnName: "T2_INSERT_DIR_BATCH_SIZE", displayName: "T2 INSERT DIR BATCH SIZE", dataType: "INT", insert: "TRUE", edit: "TRUE", inputType: "textbox", valueSet: "" },
    { columnName: "T2_PARTITION_JOB_TYPE", displayName: "T2 PARTITION JOB TYPE", dataType: "VARCHAR", insert: "", edit: "", inputType: "select", valueSet: "SINGLE, MULTIPLE" },
    { columnName: "T2_MAX_LOAD_END_DATE", displayName: "T2 MAX LOAD END DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_MAX_ATLAS_VERSION", displayName: "T2 MAX ATLAS VERSION", dataType: "BIGINT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_CLUSTER_ID", displayName: "T2 CLUSTER ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_LIVY_BATCH_ID", displayName: "T2 LIVY BATCH ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_SPARK_APP_ID", displayName: "T2 SPARK APP ID", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_SPARK_UI_URL", displayName: "T2 SPARK UI URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_SPARK_LOG_URL", displayName: "T2 SPARK LOG URL", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_PROCESS_START_DATE", displayName: "T2 PROCESS START DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_PROCESS_END_DATE", displayName: "T2 PROCESS END DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_EXECUTION_STATUS", displayName: "T2 EXECUTION STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO,RUNNING, FAILED, COMPLETE, NO_DATA, FILE_HEADER_UPDATING, T2_METADATA_UPDATING, EHC_METADATA_MISMATCH" },
    { columnName: "T2_ERROR", displayName: "T2 ERROR", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "T2_ERROR_TRACE", displayName: "T2 ERROR TRACE", dataType: "TEXT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_STATUS", displayName: "ANALYZE STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO, HOLD" },
    { columnName: "ANALYZE_EXECUTION_DAYS", displayName: "ANALYZE EXECUTION DAYS", dataType: "INT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_LAST_SUCCESS_DATE", displayName: "ANALYZE LAST SUCCESS DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_PROCESS_START_DATE", displayName: "ANALYZE PROCESS START DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_PROCESS_END_DATE", displayName: "ANALYZE PROCESS END DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_EXECUTION_STATUS", displayName: "ANALYZE EXECUTION STATUS", dataType: "VARCHAR", insert: "TRUE", edit: "TRUE", inputType: "select", valueSet: "TODO,RUNNING, FAILED, COMPLETE" },
    { columnName: "ANALYZE_ERROR", displayName: "ANALYZE ERROR", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "ANALYZE_ERROR_TRACE", displayName: "ANALYZE ERROR TRACE", dataType: "TEXT", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "UPDATE_DATE", displayName: "UPDATE DATE", dataType: "TIMESTAMP", insert: "", edit: "", inputType: "textbox", valueSet: "" },
    { columnName: "UPDATED_BY", displayName: "UPDATED BY", dataType: "VARCHAR", insert: "", edit: "", inputType: "textbox", valueSet: "" }

]





