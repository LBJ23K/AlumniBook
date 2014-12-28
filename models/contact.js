exports.Contact = function(Sequelize, sequelize){
  return sequelize.define('Contact', {

    contact_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: Sequelize.INTEGER,
    name:{ 
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:null
      },
    address: {
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    },
    email:{
      type:Sequelize.STRING,
      allowNull:false,
      validate:  {
        isEmail: true
      }
    },   
    phone_mobile:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    },
    phone_work:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    },
    phone_home:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    }
  },{
    tableName: 'contact'
  });
}