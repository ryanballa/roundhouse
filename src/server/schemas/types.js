const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const DestinationType = new GraphQLObjectType({
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
  name: 'Destination',
  type: 'Query',
});

const DestinationWorkOrdersType = new GraphQLObjectType({
  fields: {
    destination_id: { type: GraphQLID },
    work_order_id: { type: GraphQLID },
  },
  name: 'DestinationWorkOrders',
  type: 'Query',
});

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

const WorkOrderType = new GraphQLObjectType({
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
  name: 'WorkOrder',
  type: 'Query',
});

exports.DestinationWorkOrdersType = DestinationWorkOrdersType;
exports.DestinationType = DestinationType;
exports.LocomotiveType = LocomotiveType;
exports.UserType = UserType;
exports.WorkOrderType = WorkOrderType;
