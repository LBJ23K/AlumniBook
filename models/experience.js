exports.Experience = function(Sequelize, sequelize){
  return sequelize.define('Experience', {

    experience_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: Sequelize.INTEGER,
    org:{ 
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:null
      },
    dept: {
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    },
    position:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    },   
    startdate:{
      type:Sequelize.DATE,
      allowNull: true,
      defaultValue:null,
      validate:{
        isDate: true
      }
    },
    enddate:{
      type:Sequelize.DATE,
      allowNull: true,
      defaultValue:null,
      validate:{
        isDate: true
      }
    },
    description:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null
    }
  },{
    tableName: 'experience'
  });
}