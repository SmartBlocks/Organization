define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Models/Activity',
    'Organization/Apps/Common/Collections/ActivityTypes'
], function ($, _, Backbone, MainViewTemplate, Activity, ActivityTypesCollection) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_create_view",
        initialize: function () {
            var base = this;
            base.activity = new Activity();
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;



            base.activity_types = SmartBlocks.Blocks.Organization.Data.activity_types;
            base.render();
            base.registerEvents();

        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {
                activity_types: base.activity_types.models
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;


            base.$el.delegate(".creation_form", "submit", function () {
                var form = $(this);
                var valid = true;
                var name = base.$el.find(".name_input").val();
                if (name != "" && name.match(/^[a-zA-Z]+$/i)) {
                    base.activity.set("name", name);

                    base.$el.find(".name_field_error").hide();
                } else {
                    valid = false;
                    base.$el.find(".name_field_error").show();
                }
                var type = base.$el.find(".type_input").val();
                if (type > 0) {
                    base.activity.set("type", base.activity_types.get(type));
                    base.$el.find(".type_field_error").hide();
                } else {
                    valid = false;
                    base.$el.find(".type_field_error").show();
                }
                if (valid) {
                    base.activity.save({}, {
                        success: function () {
                            SmartBlocks.Blocks.Organization.Data.activities.add(base.activity);
                            window.location = "#Organization/activities/" + base.activity.get('id');
                        }
                    });
                }


            });

            base.$el.delegate(".cancel_button", "click", function () {
                SmartBlocks.router.back();
            });
        }
    });

    return View;
});