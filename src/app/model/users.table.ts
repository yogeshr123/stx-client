const userTableColumns = [
    {
        header: 'ID',
        field: 'ID',
    },

    {
        header: 'USER_NAME',
        field: 'USER_NAME',
    },
    {
        header: 'EMAIL_ID',
        field: 'EMAIL_ID',
    },
    {
        header: 'FULL_NAME',
        field: 'FULL_NAME',
    },
    {
        header: 'ROLE',
        field: 'ROLE',
    },
    {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date',
    },
    {
        header: 'UPDATED_BY',
        field: 'UPDATED_BY',
    },
];

class User {
    ID: number;
    USER_NAME: string;
    PASSWORD: string;
    EMAIL_ID: string;
    ROLE: number[];
    PROFILE_PIC: string;
    FULL_NAME: string;
    PHONE: string;
    DEPARTMENT: string;
    UPDATE_DATE: string;
    UPDATED_BY: string;

    clear(): void {
        this.ID = undefined;
        this.USER_NAME = '';
        this.PASSWORD = '';
        this.EMAIL_ID = '';
        this.ROLE = [];
        this.FULL_NAME = '';
        this.PROFILE_PIC = './assets/media/users/default.jpg';
        this.PHONE = '';
        this.DEPARTMENT = '';
        this.UPDATE_DATE = `${new Date()}`;
        this.UPDATED_BY = '';
    }
}

export { userTableColumns, User };
