
export interface App {
	name: string;
	icon: string;
	img: string;
	route: string;
	desc: string;
	class?: string;
	badge?: string;
}

export interface MenuOption {
	title: string;
	route: string;
	icon?: string;
	badge?: string;
	fragment?: string;
	app?: string;
}
export interface MenuTitle {
	title: string;
	icon?: string;
	url?: Array<string>;
}
export interface MenuSara {
	header: MenuTitle;
	options?: Array<MenuOption>;
}
