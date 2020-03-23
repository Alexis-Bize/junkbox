export const getSenderInitials = (sender: string) => {
	const match = sender.split('<')[0].match(/[a-zA-Z0-9]+/g) || [];
	const slice = match.slice(0, 2);
	const extract = [(slice[0] || '').charAt(0), (slice[1] || '').charAt(0)];
	return extract.join('').toUpperCase();
};
