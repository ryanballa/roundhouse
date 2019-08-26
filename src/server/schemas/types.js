const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const LocomotiveType = new GraphQLObjectType({
  fields: {
    id: { type: GraphQLString },
    road: { type: GraphQLString },
  },
  name: 'Locomotive',
  type: 'Query',
});

const UserType = new GraphQLObjectType({
  fields: {
    full_name: { type: GraphQLString },
    id: { type: GraphQLString },
    username: { type: GraphQLString },
  },
  name: 'User',
  type: 'Query',
});

exports.LocomotiveType = LocomotiveType;
exports.UserType = UserType;
