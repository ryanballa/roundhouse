const graphql = require('graphql');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql;
const { db } = require('../../../pgAdaptor');
const { DestinationType } = require('./types');

const RootMutation = new GraphQLObjectType({
  fields: {
    addDestination: {
      args: {
        name: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO destinations(name) VALUES ($1) RETURNING name`;
        const values = [args.name];

        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      },
      type: DestinationType,
    },
    addDestinationWorkOrder: {
      args: {
        destinationId: { type: GraphQLID },
        workOrderId: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO work_orders_destinations(destination_id, work_order_id) VALUES ($1, $2) RETURNING id`;
        const values = [args.destinationId, args.workOrderId];

        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      },
      type: DestinationType,
    },
    addWorkOrder: {
      args: {
        name: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO work_orders(name) VALUES ($1) RETURNING name`;
        const values = [args.name];

        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      },
      type: DestinationType,
    },
  },
  name: 'RootMutationType',
  type: 'Mutation',
});

exports.mutation = RootMutation;
