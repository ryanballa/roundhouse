const { GraphQLList, GraphQLObjectType, GraphQLID } = require('graphql');
const { db } = require('../../../pgAdaptor');
const {
  DestinationWorkOrdersType,
  DestinationType,
  LocomotiveType,
  UserType,
  WorkOrderType,
} = require('./types');

const RootQuery = new GraphQLObjectType({
  fields: {
    destinationWorkOrders: {
      resolve() {
        const query = `SELECT * FROM work_orders_destinations`;
        return db
          .manyOrNone(query)
          .then(res => res)
          .catch(err => err);
      },
      type: new GraphQLList(DestinationWorkOrdersType),
    },
    destinations: {
      resolve() {
        const query = `SELECT * FROM destinations`;

        return db
          .manyOrNone(query)
          .then(res => res)
          .catch(err => err);
      },
      type: new GraphQLList(DestinationType),
    },
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
    workOrders: {
      resolve() {
        const query = `SELECT * FROM work_orders`;

        return db
          .manyOrNone(query)
          .then(res => res)
          .catch(err => err);
      },
      type: new GraphQLList(WorkOrderType),
    },
  },
  name: 'RootQueryType',
  type: 'Query',
});

exports.query = RootQuery;
