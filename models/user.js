// new model

module.exports = function(sequelize, DataTypes) { 
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,	// checks if value is email!
				len: [1, 250] // > 1 en < 250 tekens
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100], // > 1 en < 250 tekens
			}
		}
	}, {
		// hooks!!
		hooks: {
			beforeValidate: function(user, options) {
				// user.email
				if (typeof user.email == "string") {
					user.email = user.email.toLowerCase();
				}

			}
		}
	})
};