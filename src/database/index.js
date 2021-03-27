const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Person = require('../models/Person');
const Deputado = require('../models/Deputado');
const Senador = require('../models/Senador');
const Proposal = require('../models/Proposal');
const Entity = require('../models/Entity');
const Cost = require('../models/Cost');
const connection = new Sequelize(dbConfig);

Person.init(connection);
Deputado.init(connection);
Senador.init(connection);
Proposal.init(connection);
Entity.init(connection);
Cost.init(connection);

Deputado.associate(connection.models);
Senador.associate(connection.models);
Cost.associate(connection.models);
Person.associate(connection.models);

module.exports = connection;