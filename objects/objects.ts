export const requireNonNull = <T>(value?: T, message?: string) => {
	if (value == null) {
		throw Error(message || 'Value is null');
	}
	return value;
};


