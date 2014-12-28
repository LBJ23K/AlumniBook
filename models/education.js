exports.Education = function(Sequelize, sequelize){
  return sequelize.define('Education', {
    education_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: Sequelize.INTEGER,
    degree:{ 
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue:null,
      validate:{
        isNumeric:true
      } 
    },
    institute: { 
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:null 
    },
    dept: {
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null 
    },
    stuid:{
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
    concentration:{
      type:Sequelize.STRING,
      allowNull: true,
      defaultValue:null,
    },
    obtained:{
      type:Sequelize.INTEGER,
      allowNull: true,
      defaultValue:null
    }
  },{
    tableName: 'education'
  });
}