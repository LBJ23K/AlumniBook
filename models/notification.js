exports.Notification = function(Sequelize, sequelize){
  return sequelize.define('Notification', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: { type: Sequelize.INTEGER }, 
    issue_id: { type: Sequelize.INTEGER },
    type: {
    	type:   Sequelize.ENUM,
    	values: ['comment', 'update', 'delete']
  	},
  	read: {
    	type:   Sequelize.ENUM,
    	values: ['unread', 'read']
  	}
  },{
    tableName: 'notification'
  });
}