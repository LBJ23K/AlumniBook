exports.PostCategory = function(Sequelize, sequelize){
  return sequelize.define('PostCategory', {

    postCategory_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    category_name:Sequelize.STRING,
  },{
    tableName: 'postCategory'
  });
}