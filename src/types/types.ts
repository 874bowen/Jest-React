export interface User {
	name: string;
	address: string;
	projects: Project[];
}

export interface Project {
	name: string;
}