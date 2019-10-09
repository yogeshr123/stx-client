export const environment = {
  production: true,
  baseUrl: 'https://ehcload.seagate.com/api/v1/',
  RAW_FACTORY_PATH_DEFAULT_SETTING: 'stx-usw2-ehc-prd-data-factory',
  T1_PATH_DEFAULT_SETTING: 'stx-usw2-ehc-prd-data-t1',
  appModulesList: ['Dashboard', 'Load Control', 'Load Status', 'Column Metadata', 'Header Hash', 'User Management', 'DB Endponits', 'Clusters', 'Spark Config'],
  defaultPermissions: ['Read', 'Add', 'Edit', 'Delete'],
  ssoLoginURL: 'https://ssotstlogin.seagate.com/oamfed/idp/initiatesso?providerid=SeagateAtlasManager',
  // ssoLogoutURL: 'https://ssotstlogin.seagate.com/oam/server/logout'
  ssoLogoutURL: './logout'
};
