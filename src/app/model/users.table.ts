const userTableColumns = [
	{
		header: 'ID',
		field: 'ID'
	},

	{
		header: 'USER_NAME',
		field: 'USER_NAME'
	},
	{
		header: 'EMAIL_ID',
		field: 'EMAIL_ID'
	},
	{
		header: 'FULL_NAME',
		field: 'FULL_NAME',
	},
	{
		header: 'ROLE',
		field: 'ROLE',
	}

];

class User {
	id: number;
	username: string;
	password: string;
	email: string;
	roles: number[];
	pic: string;
	fullname: string;
	phone: string;
	department: string;

	clear(): void {
		this.id = undefined;
		this.username = '';
		this.password = '';
		this.email = '';
		this.roles = [];
		this.fullname = '';
		this.pic = './assets/media/users/default.jpg';
		this.phone = '';
		this.department = '';
	}
}

export { userTableColumns, User };

// export class UsersTable {
// 	public static users: any = [
// 		{
// 			id: 1,
// 			username: 'admin',
// 			password: 'demo',
// 			email: 'admin@demo.com',
// 			// accessToken: '',
// 			// refreshToken: '',
// 			roles: [1], // Administrator
// 			pic: './assets/media/users/300_25.jpg',
// 			fullname: 'Sean',
// 			occupation: 'CEO',
// 			companyName: 'Keenthemes',
// 			phone: '456669067890',
// 			address: {
// 				addressLine: 'L-12-20 Vertex, Cybersquare',
// 				city: 'San Francisco',
// 				state: 'California',
// 				postCode: '45000'
// 			},
// 			socialNetworks: {
// 				linkedIn: 'https://linkedin.com/admin',
// 				facebook: 'https://facebook.com/admin',
// 				twitter: 'https://twitter.com/admin',
// 				instagram: 'https://instagram.com/admin'
// 			}
// 		},
// 		{
// 			id: 2,
// 			username: 'user',
// 			password: 'demo',
// 			email: 'user@demo.com',
// 			// accessToken: '',
// 			// refreshToken: '',
// 			roles: [2], // Manager
// 			pic: './assets/media/users/100_2.jpg',
// 			fullname: 'Megan',
// 			occupation: 'Deputy Head of Keenthemes in New York office',
// 			companyName: 'Keenthemes',
// 			phone: '456669067891',
// 			address: {
// 				addressLine: '3487  Ingram Road',
// 				city: 'Greensboro',
// 				state: 'North Carolina',
// 				postCode: '27409'
// 			},
// 			socialNetworks: {
// 				linkedIn: 'https://linkedin.com/user',
// 				facebook: 'https://facebook.com/user',
// 				twitter: 'https://twitter.com/user',
// 				instagram: 'https://instagram.com/user'
// 			}
// 		},
// 		{
// 			id: 3,
// 			username: 'guest',
// 			password: 'demo',
// 			email: 'guest@demo.com',
// 			// accessToken: '',
// 			// refreshToken: '',
// 			roles: [3], // Guest
// 			pic: './assets/media/users/default.jpg',
// 			fullname: 'Ginobili Maccari',
// 			occupation: 'CFO',
// 			companyName: 'Keenthemes',
// 			phone: '456669067892',
// 			address: {
// 				addressLine: '1467  Griffin Street',
// 				city: 'Phoenix',
// 				state: 'Arizona',
// 				postCode: '85012'
// 			},
// 			socialNetworks: {
// 				linkedIn: 'https://linkedin.com/guest',
// 				facebook: 'https://facebook.com/guest',
// 				twitter: 'https://twitter.com/guest',
// 				instagram: 'https://instagram.com/guest'
// 			}
// 		}
// 	];

// 	public static tokens: any = [
// 		{
// 			id: 1,
// 			accessToken: 'access-token-' + Math.random(),
// 			refreshToken: 'access-token-' + Math.random()
// 		}
// 	];
// }
