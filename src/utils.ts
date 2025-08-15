export const CleanString = (str: string): string => {
	return str.replace(/[^a-zA-Z0-9 ]/g, "-");
};
