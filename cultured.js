var main = function() {

    Parse.initialize("mbEmexQ6H0RYuZ7pMap0bw6EQxSfIYiEBrs53J8M", "rpoMrvfppT4kJf8hT21lKZiDTexzIwg42v75ih0k");


    var Plate = Parse.Object.extend("Plate", {
        newPlate: function(platename, platesize, confluency) {
            var platename = new Plate();
            platename.set("platesize", this.platesize);
            platename.set("confluency", this.confluency);
            platename.set("user", user);
            platename.setACL(new Parse.ACL(Parse.User.current()));
            platename.save();
        },
        splitPlate: function(previousConfluency, percentPrev, platesize) {

        }
    });

    var showPlate = function(plateToShow) {
        var plateTemplate = '<div class ="plate"><img src="http://files.parsetfss.com/cb7eab5d-9002-4a01-9bb5-c71e43d54bc7/tfss-94e29190-374c-48a1-a1f8-bb011e419cbd-10cm.jpg"/><div class = "plateinfo"><p class="confluency">' + plateToShow.get("confluency") + '</p></div></div>';
        $('#title').after(plateTemplate);
    }

//invite user to split plates
    $(".plate").hover(function() {
        $('.plateinfo').children('.confluency').css("display", "none");
        $('.plateinfo').append('<p id = "split">Click to Split</p>');
    }, function() {
        $('.plateinfo').children('.confluency').css("display", "");
        $('#split').remove();
    });

//split plates on click
    $(document).on("click", ".plate", function() {
        console.log("for sanity");
        $(this).remove();
        alert("testing with split to two plates arbitray confluency");
        var plate1 = new Plate();
        plate1.set("confluency", "10%");
        var plate2 = new Plate();
        plate2.set("confluency", "11%");
        plate1.save(null, {
            success: function(plate1) {
                alert('New plate created with id: ' + plate1.id);
            }
        }).then(showPlate(plate1));
        plate2.save(null, {
            success: function(plate2) {
                alert('New plate created with id: ' + plate2.id);
            }
        }).then(showPlate(plate2));
    })

//Plates View
    var PlatesView = Parse.View.extend({

        events:{
        },

        el: ".content",

        initialize: function() {
            
        }
    })    

//Login
    var LogInView = Parse.View.extend({
        events: {
            "submit form.login-form": "logIn",
            "submit form.signup-form": "signUp"
        },

        el: ".content",

        initialize: function() {
            _.bindAll(this, "logIn", "signUp");
            this.render();
        },

        logIn: function(e) {
            var self = this;
            var username = this.$("#login-username").val();
            var password = this.$("login-password").val();

            Parse.User.logIn(username, password, {
                success: function(user) {
                    new PlatesView();
                    delete self;
                },

                error: function (user, error) {
                    self.$(".signup-form .error").html(error.message).show();
                    this.$(".signup-form button").removeAttr("disabled");
                }
            });

            this.$(".signup-form button").attr("disabled", "disabled");

            return false;
        },

        render: function() {
            this.$el.html(_.template($("#login-template").html()));
            this.delegateEvents();
        }
    });


// View Manager
    var AppView = Parse.View.extend({
        el: $("#cultured"),

        initialize: function() {
            if (Parse.User.current()) {
                new PlatesView();
            } else {
                new LogInView();
            }
        }
    });
}


$(document).ready(main);