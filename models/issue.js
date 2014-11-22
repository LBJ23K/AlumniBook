exports.Issue = function(Sequelize, sequelize){
  return sequelize.define('Issue', {

    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    author: { type: Sequelize.INTEGER},
    title: { type: Sequelize.TEXT },
    content: { type: Sequelize.TEXT },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    parent_issue: { type: Sequelize.INTEGER },

  },{
    tableName: 'issue'
  });
}