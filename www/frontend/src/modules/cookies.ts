//#region typings

type CookieOptions = {
	maxAge?: number;
	sameSite?: boolean | 'lax' | 'strict' | 'none';
};

//#endregion
//#region public methods

export const getCookie = (name: string) => {
	const match = document.cookie.match(
		'(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)'
	);

	return match ? match.pop() : '';
};

export const setCookie = (
	name: string,
	value: string,
	options: CookieOptions = {}
) => {
	const parsedOptions: string[] = [];

	(Object.keys(options) as Array<keyof typeof options>).forEach(option => {
		parsedOptions.push(`${option}=${options[option]}`);
	});

	document.cookie = `${name}=${value};${parsedOptions.join(';')}`;
};

export const isWelcomeMailDeleted = () =>
	getCookie('box_welcome_mail_deleted') === 'yes';

export const deleteBoxCookies = () => {
	document.cookie.split(';').forEach(c => {
		document.cookie = c
			.replace(/^ +/, '')
			.replace(
				/=.*/,
				'=;expires=' + new Date().toUTCString() + ';path=/'
			);
	});
};

//#endregion
