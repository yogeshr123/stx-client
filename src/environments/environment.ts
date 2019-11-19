// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    baseUrl: 'http://localhost:3000/api/v1/',
    RAW_FACTORY_PATH_DEFAULT_SETTING: 'stx-usw2-ehc-prd-data-factory',
    T1_PATH_DEFAULT_SETTING: 'stx-usw2-ehc-prd-data-t1',
    appModulesList: [
        'Dashboard',
        'Load Control',
        'Load Status',
        'Column Metadata',
        'Header Hash',
        'User Management',
        'DB Endponits',
        'Clusters',
        'Spark Config',
        'Email Config',
    ],
    defaultPermissions: ['Read', 'Add', 'Edit', 'Delete'],
    ssoLoginURL:
        'https://ssotstlogin.seagate.com/oamfed/idp/initiatesso?providerid=SeagateAtlasManager', // Staging SSO
    ssoLogoutURL: './logout',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
