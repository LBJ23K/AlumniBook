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
      allowNull:true,
      defaultValue:null,
      validate:  {
        isEmail: true
      }
    },   
    phone_mobile:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null,
      validate:{
        phone: function(value) {
          var re = /\d{4}-\d{3}-\d{3}/
        if(!re.test(value)) {
          throw ('phone format error')
        }
      }
    }
    },
    phone_work:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null,
      validate:{
        phone: function(value) {
          var re = /(\(\d{2}\))?\d{4}-\d{4}/
        if(!re.test(value)) {
          throw ('phone format error')
        }
      }
    }
  },
    phone_home:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null,
      validate:{
        phone: function(value) {
          var re = /(\(\d{2}\))?\d{4}-\d{4}/
        if(!re.test(value)) {
          throw ('phone format error')
        }
      }
    }
  }
  },{
    tableName: 'contact'
  });
}