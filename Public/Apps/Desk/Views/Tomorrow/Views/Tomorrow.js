define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    'Organization/Apps/Deadlines/Index/Views/Main',
    'jqueryui',
    'fullCalendar'
], function ($, _, Backbone, main_template, DeadlinesIndexView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tomorrow_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {});
            base.$el.html(template);


            var firstHour = 7;
            base.events = [];
            for (var k in SmartBlocks.Blocks.Organization.Data.planned_tasks.models) {
                var planned_task = SmartBlocks.Blocks.Organization.Data.planned_tasks.models[k];
                var start = planned_task.getStart();
                var end = new Date(start);
                var duration = parseInt(planned_task.get("duration"));
                end.setTime(end.getTime() + duration);
                var event = {
                    title: planned_task.get("content") ? planned_task.get("content") : "Untitled",
                    start: start,
                    end: end,
                    allDay: false,
                    id: planned_task.get("id"),
                    className: "planned_task_cal",
                    color: "gray"
                };
                base.events.push(event);
            }
            var now = new Date();
            now.setDate(now.getDate() + 1);
            base.$el.find(".calendar_container").fullCalendar({
                header: {
                    left: '',
                    center: '',
                    right: ''
                },
                editable: true,
                droppable: true,
                events: base.events,
                defaultView: "agendaDay",
                allDaySlot: false,
                height: 550,
                firstHour: firstHour,
                date: now.getDate(),
                month: now.getMonth(),
                year: now.getFullYear(),
                drop: function (date, allDay, jsEvent, ui) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    if (allDay) {
                        date.setHours(12);
                    }
                    var end = new Date(date);
                    end.setHours(end.getHours() + 1);

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)


                    var planned_task = new SmartBlocks.Blocks.Organization.Models.PlannedTask();
                    var task = SmartBlocks.Blocks.Organization.Data.tasks.get($(this).attr("id"));
                    planned_task.setStart(date);
                    planned_task.set("duration", 3600000);
                    planned_task.set("content", task.get("name"));
                    planned_task.set("task", task);
                    planned_task.save({}, {
                        success: function () {
                            base.$el.fullCalendar('renderEvent', copiedEventObject);
                            SmartBlocks.Blocks.Organization.Data.planned_tasks.add(planned_task);
                            var newEvent = {
                                title: planned_task.get('content'),
                                start: date,
                                id: planned_task.get("id"),
                                allDay: allDay,
                                end: end,
                                className: "planned_task_cal",
                                color: "gray"
                            };


                            base.$el.find(".calendar_container").fullCalendar('renderEvent', newEvent);
                        }
                    });


                },
                eventDrop: function (event, jsEvent, ui, view) {
                    var planned_task = SmartBlocks.Blocks.Organization.Data.planned_tasks.get(event.id);
                    if (planned_task) {
                        planned_task.setStart(event.start);

                        console.log(event, planned_task.getStart());
                        planned_task.save();

                    }

                },
                eventResize: function (event) {
                    var planned_task = SmartBlocks.Blocks.Organization.Data.planned_tasks.get(event.id);

                    if (planned_task) {
                        planned_task.setStart(event.start);
                        planned_task.set("duration", event.end.getTime() - event.start.getTime());

                        console.log(event, planned_task.getStart());

                        planned_task.save({}, {
                            success: function () {
                                SmartBlocks.events.trigger("updated_planned_task");
                            }
                        });

                    }

                },
                eventClick: function (event, e) {
                    var elt = $(this);
                    if (!elt.hasClass("selected")) {
                        base.$el.find(".selected").removeClass("selected");
                        elt.addClass("selected");
                        base.planned_task = SmartBlocks.Blocks.Organization.Data.planned_tasks.get(event.id);
                        base.renderDescriptor();
                        base.manual = true;

                    } else {
                        base.$el.find(".selected").removeClass("selected");
                        base.planned_task = undefined;
                        base.$el.find(".descriptor_container_top").addClass("disabled");
                        base.manual = false;
                    }
                },
                eventRender: function (event, element) {
                    var elt = $(element);
                    elt.addClass("planned_task_evt_" + event.id);
                    elt.mouseup(function (e) {
                        if (e.which == 1) {

                        }
                    });
                }
            });

            var deadlines_index = new DeadlinesIndexView(SmartBlocks.Blocks.Organization.Data.deadlines);
            base.$el.find(".deadlines_index_container").html(deadlines_index.$el);
            deadlines_index.init(true);

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});