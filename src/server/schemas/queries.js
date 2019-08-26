const { GraphQLList, GraphQLObjectType, GraphQLID } = require('graphql');
const { db } = require('../../../pgAdaptor');
const { LocomotiveType, UserType } = require('./types');

const RootQuery = new GraphQLObjectType({
  fields: {
    locomotives: {
      resolve() {
        const query = `SELECT * FROM locomotives`;

        return db
          .manyOrNone(query)
          .then(res => res)
          .catch(err => err);
      },
      type: new GraphQLList(LocomotiveType),
    },
    user: {
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM users WHERE id=$1`;
        const values = [args.id];

        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      },
      type: UserType,
    },
  },
  name: 'RootQueryType',
  type: 'Query',
});

exports.query = RootQuery;
