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
      defaultValue:null,
      validate:{
        stuid: function(value) {
          var re = /[a-zA-Z][0-9]{8}/
        if(!re.test(value)) 
          throw ('stuid format error')
        }
      }
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