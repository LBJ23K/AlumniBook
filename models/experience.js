exports.Experience = function(Sequelize, sequelize){
  return sequelize.define('Experience', {

    experience_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: Sequelize.INTEGER,
    org:{ type: Sequelize.STRING },
    dept: {type:Sequelize.STRING},
    position:{type:Sequelize.STRING},   
    startdate:{type:Sequelize.DATE},
    enddate:{type:Sequelize.DATE},
    description:{type:Sequelize.STRING}
  },{
    tableName: 'experience'
  });
}