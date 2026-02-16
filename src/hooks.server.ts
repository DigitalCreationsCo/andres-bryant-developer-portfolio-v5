import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Error:', error);
	return {
		message: 'Internal Server Error'
	};
};
