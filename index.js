const { ApolloServer, PubSub } = require('apollo-server');
require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 2020;

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context   : ({ req, connection }) => ({ req, connection, pubsub })
});

mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB connected');
		return server.listen({ port });
	})
	.then((res) => {
		console.log(`server running at ${res.url}`);
	});
