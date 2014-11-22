exports.Education = function(Sequelize, sequelize){
  return sequelize.define('Education', {
    education_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: Sequelize.INTEGER,
    degree:{ type: Sequelize.INTEGER },
    institute: { type: Sequelize.STRING },
    dept: {type:Sequelize.STRING },
    stuid:Sequelize.INTEGER,
    startdate:{type:Sequelize.DATE},
    enddate:{type:Sequelize.DATE},
    concentration:{type:Sequelize.STRING},
    obtained:{type:Sequelize.INTEGER}
  },{
    tableName: 'education'
  });
}