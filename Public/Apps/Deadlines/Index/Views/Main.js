define([
    'jquery',
    'underscore',
    'backbone',
    './Deadline',
    'text!../Templates/main.html',
    'text!../Templates/new_deadline_btn.html',
    './NewDeadline'
], function ($, _, Backbone, DeadlineShow, main_template, new_dl_btn_tpl, NewDeadlineView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_index",
        initialize: function (deadlines) {
            var base = this;
            base.deadlines = deadlines;

            base.current_page = 1;
            base.page_count = 0;
        },
        init: function (draggable_tasks, activity) {
            var base = this;
            base.draggable_tasks = draggable_tasks;
            base.activity = activity;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {

            });
            base.$el.html(template);


            base.renderPage();
        },
        renderPage: function (page) {
            var base = this;
            base.$el.find(".deadlines_container").html("");

            var new_ddl_view = new NewDeadlineView();
            base.$el.find(".deadlines_container").append(new_ddl_view.$el);
            new_ddl_view.init(base.SmartBlocks, {
                activity: base.activity
            });
            new_ddl_view.events.on("deadline_created", function () {
                base.render();
            });

            for (var k in base.deadlines.models) {
                var deadline_view = new DeadlineShow(base.deadlines.models[k]);
                base.$el.find(".deadlines_container").append(deadline_view.$el);
                deadline_view.init(base.draggable_tasks, {
                    activity: base.activity,
                    show_activity: base.activity === undefined
                });
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "click", function() {
                base.$el.find(".deadline_body").hide();
                base.$el.find(".deadline_show_container").removeClass("expanded");
                base.$el.find(".deadline_show_container").css("transform", "none");
            });
        }
    });

    return View;
});