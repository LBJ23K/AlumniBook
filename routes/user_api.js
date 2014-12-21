var Member = require('../models').Member;
var Education = require('../models').Education;
var Experience = require('../models').Experience;
var Contact = require('../models').Contact;

var _ = require('underscore');
var async = require('async');
var local = require("../config/local");
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
    local.model.mysql.database,
    local.model.mysql.account,
    local.model.mysql.password,
    local.model.mysql.options
);

exports.getUser = function(req, res) {
    var id = req.session.user.member_id;
    Member.find({
        where: {
            member_id: id
        },
        include: [Education, Contact, Experience]
    }).success(function(member) {
        // console.log(member)
    	res.json(member);
    })
}
exports.getUserData = function(req,res){
    var id = req.params.id;
    Member.find({
        where: {
            member_id: id
        },
        include: [Education, Contact, Experience]
    }).success(function(member) {

        res.json(member);
    })
}
exports.modifyUser = function(req, res) {
    var id = req.session.user.member_id;
    // var educationdata = JSON.parse(req.body.education);
    // var contactdata = JSON.parse(req.body.contact);
    // var experiencedata = JSON.parse(req.body.experience);
    var educationdata = req.body.Education;
    var contactdata = req.body.Contact;
    var experiencedata = req.body.Experiences;
    var modifyLen = req.body.expLen;
    var i=0;
    // console.log(educationdata)
    // console.log(contactdata)
    // console.log(experiencedata)
    // return;
    
    async.series([
            function(callback) {
                Education.find({
                    where: {
                        member_id: id
                    }
                }).success(function(education) {
                    education.updateAttributes(educationdata).success(function(result) {
                        callback(null, result)
                    })
                })
            },
            function(callback) {
                Contact.find({
                    where: {
                        member_id: id
                    }
                }).success(function(contact) {
                    contact.updateAttributes(contactdata).success(function(result) {
                        callback(null, result)
                    })
                })
            },
        	function(callback) {
                _.each(experiencedata,function(item,i){
                    if(i<modifyLen){
                        Experience.find({
                    where: {
                        experience_id: item.experience_id
                        }
                    }).success(function(experience) {
                        experience.updateAttributes(experiencedata[i]).success(function(result) {
                            })
                        })
                    }
                    else{
                        item.member_id = id;
                        Experience.create(item).success(function(experience){
                        })
                    }
                    
                })
                    callback(null,null)
                    // console.log(experiencedata[i])
                    
                // if(modifyLen==experiencedata.length) callback(null, null)
                // for(i=modifyLen;i<experiencedata.length;i++){
                //     experiencedata[i].member_id = id;
                //     Experience.create(experiencedata[i]).success(function(experience){
                //         console.log('create ok')
                //         callback(null, null)

                //     })
                // }
                // _.each(experiencedata,function(item){
                //     item.member_id = id;
                //     Experience.findOrCreate({where:item,defaults:{}}).success(function(experience) {
                //     console.log('exp success')
                // })
                // })
                
            }],
        function(err, results) {
            if(err) console.log(err)
            res.json({msg:true})
            // res.json(results)
        });
}

function validateData(target){
    var re = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/;
    var msg = [];
    var i =0;
    var educationdata = target.Education;
    var contactdata = target.Contact;
    var experiencedata = target.Experiences;
    
    if(isNaN(educationdata.degree)) msg.push({msg:false,type:'Education degree'})
    if(isNaN(educationdata.stuid)) msg.push({msg:false,type:'Education stuid'})
    if(!re.test(contactdata.email)) msg.push({msg:false,type:'Contact email'})
    for(i=0;i<experiencedata.length;i++){
        
    }
  
}
