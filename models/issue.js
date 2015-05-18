exports.Issue = function(Sequelize, sequelize){
  return sequelize.define('Issue', {

    issue_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: { type: Sequelize.INTEGER},
    title: { type: Sequelize.TEXT },
    content: { type: Sequelize.TEXT },
    parent_issue: { type: Sequelize.INTEGER },
    postCategory_id: { type: Sequelize.INTEGER },

  },{
    tableName: 'issue'
  });
}