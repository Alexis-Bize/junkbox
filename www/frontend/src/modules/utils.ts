/** @see https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f */
export const copyToClipboard = (str: string) => {
	const elem = document.createElement('textarea');

	elem.value = str;
	elem.setAttribute('readonly', '');
	elem.style.position = 'absolute';
	elem.style.left = '-9999px';

	document.body.appendChild(elem);
	const selection = document.getSelection();

	if (selection !== null) {
		const selected =
			selection.rangeCount > 0 ? selection.getRangeAt(0) : false;

		elem.select();
		document.execCommand('copy');

		if (selected !== false) {
			selection.removeAllRanges();
			selection.addRange(selected);
		}
	}

	document.body.removeChild(elem);
};
