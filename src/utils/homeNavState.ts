export type HomeNavState = {
	scrollTop: number;
	pageCount: number;
};

let state: HomeNavState | null = null;

export const homeNavState = {
	set(next: HomeNavState) {
		state = next;
	},
	get() {
		return state;
	},
	clear() {
		state = null;
	},
};
