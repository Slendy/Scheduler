// See https://kit.svelte.dev/docs/types#app

import type { IUser } from "$lib/shared/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
