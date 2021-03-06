define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadlines.html',
    'Organization/Apps/Deadlines/Index/Views/Main'
], function ($, _, Backbone, deadline_template, DeadlinesIndex) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_deadlines",
        initialize: function (activity) {
            var base = this;
            base.model = activity;
            base.activity = activity;
        },
        init: function () {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            console.log(SmartBlocks);

            var deadlines = base.activity.getDeadlines();
            var deadlines_index = new DeadlinesIndex(deadlines);
            base.$el.html(deadlines_index.$el);
            deadlines_index.init(base.SmartBlocks, base.activity);

            SmartBlocks.Blocks.Organization.Data.deadlines.on("add", function () {
                deadlines_index.deadlines = base.activity.getDeadlines();
                deadlines_index.renderPage();
            });
            SmartBlocks.Blocks.Organization.Data.deadlines.on("remove", function () {
                deadlines_index.deadlines = base.activity.getDeadlines();
                deadlines_index.renderPage();
            });
        },
        registerEvents: function () {
            var base = this;

        }
    });

    return View;
});