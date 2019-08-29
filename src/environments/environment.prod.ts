export const environment = {
  production: true,
  baseUrl: 'http://10.219.42.183:8080/api/v1/',
  RAW_FACTORY_PATH_DEFAULT_SETTING: 'stx-usw2-ehc-prd-data-factory',
  T1_PATH_DEFAULT_SETTING: 'stx-usw2-ehc-prd-data-t1',
  appModulesList: ['Dashboard', 'Load Control', 'Load Status', 'Column Metadata', 'Header Hash', 'User Management', 'DB Endponits', 'Clusters', 'Spark Config'],
  defaultPermissions: ['Read', 'Add', 'Edit', 'Delete'],
  airflowExperimentalDevApiUrl: 'http://10.219.45.30:8080/api/experimental/',
  airflowExperimentalProdApiUrl: 'http://internal-stg-uw2-prd-airflow-ialb-1020463354.us-west-2.elb.amazonaws.com:8080/api/experimental/'
};
