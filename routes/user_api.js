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
    var id = req.params.id;
    Member.find({
        where: {
            member_id: id
        },
        include: [Education, Contact, Experience]
    }).success(function(member) {
        console.log(member);
    })
}

exports.modifyUser = function(req, res) {
    var id = req.body.id;
    var educationdata = JSON.parse(req.body.education);
    var contactdata = JSON.parse(req.body.contact);
    var experiencedata = JSON.parse(req.body.experience);

    async.series([
            function(callback) {
                Education.find({
                    where: {
                        member_id: id
                    }
                }).success(function(education) {
                    // console.log(education)
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
                Experience.find({
                    where: {
                        member_id: id
                    }
                }).success(function(experience) {
                    experience.updateAttributes(experiencedata).success(function(result) {
                        callback(null, result)
                    })
                })
            }],
        function(err, results) {
            res.send(results)
        });
}