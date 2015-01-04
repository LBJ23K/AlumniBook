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

exports.login = function(req, res){
    // var account = req.body.account.replace(/(<([^>]+)>)/ig,"");
    var query = {
        where:{
            account: profile.uid
        }
    }
    Member.find(query).success(function(member){
        console.log(JSON.stringify(member));
        if(member == null){
            // res.end("fail");
            // res.json({msg:"No user!"});
            return done({msg:"No user"}, profile);
        }
        else{
            var user = _.omit(member.dataValues, 'password', 'createdAt', 'updatedAt');
            // console.log(user)
            req.session.user = user;
            req.session.isLogin = true;
            res.json({msg:"success"});
            
        }

    });    
  }


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

exports.findAllUser = function(req, res) {
    // var id = req.session.user.member_id;
    Member.findAll({
        where: {
            // member_id: id
        },
        include: [Education, Contact, Experience]
    }).success(function(member) {
        res.json(member);
    })
}

exports.findOneUser = function(req, res) {
    // var id = req.session.user.member_id;

    Member.find({
        where: {
            member_id: req.params.id
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
                        callback(null, true);
                    }).error(function(err){
                        Experror = _.pick(err.errors[0],'type','path','value');
                        console.log(err.errors[0])
                        Experror.source = 'Education';
                        callback(null,Experror)
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
                        callback(null, true)
                    }).error(function(err){ 
                        Experror = _.pick(err.errors[0],'type','path','value');
                        Experror.source = 'Contact';
                        callback(null,Experror)
                    })
                })
            },
        	function(callback) {
                Experror = {}
                // _.each(experiencedata,function(item,i){
                //     if(i<modifyLen){
                //         Experience.find({
                //             where: {
                //                 experience_id: item.experience_id
                //                 }
                //             })
                //             .success(function(experience) {
                //                 experience.updateAttributes(experiencedata[i])
                //                 .success(function(result) {
                //                     console.log(i+' success')
                //                 })
                //                 .error(function(err){
                //                     console.log(i+' fail');
                //                     Experror = _.pick(err.errors[0],'type','path');
                //                     Experror.index = i;
                //                     Experror.msg=false;

                //                     callback(null,Experror);
                //                     // console.log(Experror)
                //                 })
                //             })
                            
                //     }
                //     else{
                //         item.member_id = id;
                //         Experience.create(item)
                //         .success(function(experience){
                //         })
                //         .error(function(err){
                //             Experror = _.pick(err.errors[0],'type','path');
                //             Experror.index = i;
                //             Experror.msg=false;
                //             callback(null,Experror);
                //         })
                //     }
                // })
                async.each(experiencedata,function(item,callback2){
                    var i =experiencedata.indexOf(item)
                    if(i<modifyLen){
                        Experience.find({
                            where: {
                                experience_id: item.experience_id
                                }
                            })
                            .success(function(experience) {
                                experience.updateAttributes(experiencedata[i])
                                .success(function(result) {
                                    callback2()
                                })
                                .error(function(err){
                                    console.log(i+' fail');
                                    Experror = _.pick(err.errors[0],'type','path','value');
                                    Experror.index = i;
                                    Experror.source = 'Experience';

                                    callback2(Experror);
                                    // console.log(Experror)
                                })
                            })
                            
                    }
                    else{
                        item.member_id = id;
                        Experience.create(item)
                        .success(function(experience){
                            callback2()
                        })
                        .error(function(err){
                            Experror = _.pick(err.errors[0],'type','path');
                            Experror.index = i;
                            Experror.msg=false;
                            callback2(Experror);
                        })
                    }
                },function(err){

                    // console.log('done')
                    // console.log(err)
                    if(err) callback(null,err)
                    else callback(null,true)
                })
                    // console.log(Experror)
                    // callback(null,null)
            }],
        function(err, results) {
            if(err) console.log(err);
            // res.json({msg:true})
            res.json(results)
        });
}


