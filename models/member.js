exports.Member = function(Sequelize, sequelize){
  return sequelize.define('Member', {

    member_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    account: { type: Sequelize.STRING},
    password: { type: Sequelize.STRING },
    name: Sequelize.STRING,
    gender: {type: Sequelize.STRING},
    school: Sequelize.STRING,
    department: Sequelize.STRING,
    grade: {type: Sequelize.STRING},    
    photo: Sequelize.STRING,

  },{
    tableName: 'member'
  });
}