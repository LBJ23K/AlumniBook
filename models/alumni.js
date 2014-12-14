exports.Alumni = function(Sequelize, sequelize){
  return sequelize.define('Alumni', {

    alumni_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    stuid:Sequelize.INTEGER,
    gradeid:Sequelize.STRING,
    gender:Sequelize.STRING,
  },{
    tableName: 'alumni'
  });
}