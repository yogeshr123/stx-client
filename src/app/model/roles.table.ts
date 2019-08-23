const roleTableColumns = [
    {
        header: 'ID',
        field: 'ID'
    },

    {
        header: 'TITLE',
        field: 'TITLE'
    },
    {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date'
    },
    {
        header: 'UPDATED_BY',
        field: 'UPDATED_BY'
    }
];

class Role {
    ID: number;
    TITLE: string;
    PERMISSIONSARRAY: number[];
    PERMISSIONS: string;
    ISCOREROLE: boolean = false;
    UPDATE_DATE: string;
    UPDATED_BY: string;

    clear(): void {
        this.ID = undefined;
        this.TITLE = '';
        this.PERMISSIONSARRAY = [];
        this.PERMISSIONS = '';
        this.ISCOREROLE = false;
        this.UPDATE_DATE = `${new Date()}`;
        this.UPDATED_BY = '';
    }
}

export { roleTableColumns, Role };

// export class RolesTable {
//     public static roles: any = [
//         {
//             id: 1,
//             title: 'Administrator',
//             isCoreRole: true,
//             permissions: [1, 2, 3, 4, 5]
//         },
//         {
//             id: 2,
//             title: 'Editor',
//             isCoreRole: false,
//             permissions: [2, 3]
//         },
//         {
//             id: 3,
//             title: 'Guest',
//             isCoreRole: false,
//             permissions: [2]
//         }
//     ];
// }


