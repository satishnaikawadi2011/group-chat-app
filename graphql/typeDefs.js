const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		id: ID
		username: String!
		email: String
		token: String
		createdAt: String
		groups: [Group]!
		contacts: [String]!
	}

	type Message {
		id: ID!
		from: String!
		to: String!
		content: String!
		createdAt: String
		type: String!
	}

	type Group {
		id: ID!
		name: String!
		admin: String!
		createdAt: String
		members: [User]
	}

	type Query {
		getUsersByGroup(name: String!): [User]!
		getUsers: [User]!
		login(username: String!, password: String!): User!
	}

	type Mutation {
		signup(email: String!, password: String!, confirmPassword: String!, username: String!): User!
		addContact(id: String!): [String]!
		sendMessage(to: String!, content: String!): Message!
		createGroup(name: String!): Group!
		addMember(userId: String!, groupName: String!): [User]!
	}
`;
