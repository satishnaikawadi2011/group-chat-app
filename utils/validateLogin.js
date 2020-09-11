module.exports = (inputs) => {
	const { username, password } = inputs;

	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Username must not be empty !';
	}
	if (password === '') {
		errors.password = 'password must not be empty !';
	}
	else if (password.length < 6) {
		errors.password = 'Password must be at least 6 characters !';
	}

	return {
		errors,
		valid  : Object.keys(errors).length < 1
	};
};
