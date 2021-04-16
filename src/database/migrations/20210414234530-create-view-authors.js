'use strict';
const view_name = 'authors ';
const query =
  `SELECT 
  IF((authe.EntityId <>  '' ),
  CONCAT(pro.Id, authe.EntityId) ,
  CONCAT(pro.Id, authp.PersonId) ) AS  Id ,
    pro.Id AS  ProposalId ,
    authp.Id AS  PersonId ,
    authe.Id AS  EntityId ,
IF((authe.EntityId <>  '' ),
     authe.EntityId ,
     authp.PersonId ) AS  AuthorId ,
IF(( authp.PersonId  <> ''),
     authp.OrderSignature ,
     authe.OrderSignature ) AS  OrderSignature ,
IF(( authe.EntityId  <> ''),
     ent.Name ,
     peo.Name ) AS  Name ,
IF(( authe . EntityId  <> ''),
     ent . FullName ,
     peo . FullName ) AS  FullName ,
IF(( authe . EntityId  <> ''),
     ent . FundationAt ,
     peo . Birthdate ) AS  BeginDate ,
IF(( authe . EntityId  <> ''),
     ent . Email ,
     peo . Email ) AS  Email ,
IF(( authe . EntityId  <> ''),
     ent . UrlPicture ,
     peo . UrlPicture ) AS  UrlPicture ,
IF(( authe . EntityId  <> ''),
     ent . Source ,
     peo . Source ) AS  Source ,
IF(( authe . EntityId  <> ''),
     ent . Initials ,
    NULL) AS  Initials 
FROM
(((( merepresentadb3 . proposals   pro 
LEFT JOIN  merepresentadb3 . authors_person   authp  ON (( pro . Id  =  authp . ProposalId )))
LEFT JOIN  merepresentadb3 . authors_entity   authe  ON (( pro . Id  =  authe . ProposalId )))
LEFT JOIN  merepresentadb3 . people   peo  ON (( peo . Id  =  authp . PersonId )))
LEFT JOIN  merepresentadb3 . entities   ent  ON (( ent . Id  =  authe . EntityId )))
ORDER BY 'ProposalId' , 'OrderSignature';`;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE VIEW ${view_name} AS ${query}`);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
