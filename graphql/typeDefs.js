const { gql } = require('apollo-server');

module.exports = gql`
	scalar JSON

	type User {
		id: ID
		username: String!
		email: String
		token: String
		imageUrl: String
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

	type LatestMessage {
		content: String!
		from: String!
		createdAt: String!
	}

	type Query {
		getUsersByGroup(name: String!): [User]!
		getUsers: [User]!
		getUser: JSON
		login(username: String!, password: String!): User!
		getMessages(otherUser: String!, type: String!): [Message]!
		getLatestMessages: JSON
	}

	type Mutation {
		signup(email: String!, password: String!, confirmPassword: String!, username: String!): User!
		addContact(id: String!): [String]!
		removeContact(id: String!): [String]!
		sendMessage(to: String!, content: String!): Message!
		createGroup(name: String!): Group!
		deleteGroup(id: String!): String!
		addMember(userId: String!, groupName: String!): [User]!
		removeMember(userId: String!, groupName: String!): [User]!
		leftGroup(groupName: String!): String!
	}

	type Subscription {
		newMessage: Message!
	}
`;
