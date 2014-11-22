exports.Contact = function(Sequelize, sequelize){
  return sequelize.define('Contact', {

    contact_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: Sequelize.INTEGER,
    name:{ type: Sequelize.STRING },
    address: {type:Sequelize.STRING},
    email:{type:Sequelize.STRING},   
    phone_mobile:{type:Sequelize.STRING},
    phone_work:{type:Sequelize.STRING},
    phone_home:{type:Sequelize.STRING}
  },{
    tableName: 'contact'
  });
}