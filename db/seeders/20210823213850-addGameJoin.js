'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('GameJoins', [
     { userId: 1, gameId: 1, createdAt: new Date(), updatedAt: new Date()},
     { userId: 1, gameId: 2, createdAt: new Date(), updatedAt: new Date()},
     { userId: 1, gameId: 3, createdAt: new Date(), updatedAt: new Date()},
     { userId: 1, gameId: 4, createdAt: new Date(), updatedAt: new Date()},
     { userId: 1, gameId: 5, createdAt: new Date(), updatedAt: new Date()}
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkDelete('GameJoins', null, { truncate: true, cascade: true, restartIdentity: true });  }
};
