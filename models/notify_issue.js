exports.Notify_issue = function(Sequelize, sequelize){
  return sequelize.define('Notify_issue', {
    notify_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    member_id: { type: Sequelize.INTEGER }, 
    issue_id: { type: Sequelize.INTEGER },
    
  },{
    tableName: 'notify_issue'
  });
}