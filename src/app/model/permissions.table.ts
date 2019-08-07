const permissionTableColumns = [
    {
        header: 'ID',
        field: 'ID'
    },

    {
        header: 'TITLE',
        field: 'TITLE'
    },
    {
        header: 'NAME',
        field: 'NAME'
    },
    {
        header: 'PARENT',
        field: 'PARENT',
    }
];

class Permission {
    ID: number;
    TITLE: string;
    level: number;
    PARENT: number;
    isSelected: boolean;
    NAME: string;
    children: Permission[];

    clear(): void {
        this.ID = undefined;
        this.TITLE = '';
        this.level = 1;
        this.PARENT = undefined;
        this.isSelected = false;
        this.NAME = '';
        this.children = [];
    }
}
export { permissionTableColumns, Permission };