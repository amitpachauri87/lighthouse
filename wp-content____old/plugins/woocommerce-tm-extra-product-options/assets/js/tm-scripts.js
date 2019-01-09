/* Image click fix */
(function($) {
    "use strict";
    $(".tm-extra-product-options .use_images_containter .tmcp-field-wrap label").on("click", function() {        
        return false;
    });
    $(".tm-extra-product-options label img").on("click", function() {
        var label=$(this).closest("label");
        
        var box=$("#" + label.attr("for"));
        var _check=false;
        if ($(box).is(":checked")){
            _check=true;                                
        }
        if (box.is(".tmcp-field.tmcp-radio") && _check){
            return;
        }
        if (!_check){
            var boxes=$('[name="'+box.attr("name")+'"]');
            $(boxes).removeAttr("checked").prop("checked",false);
            $(box).attr("checked","checked").prop("checked",true);
        }else{
            $(box).removeAttr("checked").prop("checked",false);
        }
        $(box).trigger('change').trigger('tmredirect');
    });

})(jQuery);

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik MΓ¶ller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    "use strict";

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
            timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
* jquery.resizestop (and resizestart)
* by: Fatih Kadir Akın
*
* License is CC0, published to the public domain.
*/
(function(a){var b=Array.prototype.slice;a.extend(a.event.special,{resizestop:{add:function(d){var c=d.handler;a(this).resize(function(f){clearTimeout(c._timer);f.type="resizestop";var g=a.proxy(c,this,f);c._timer=setTimeout(g,d.data||200)})}},resizestart:{add:function(d){var c=d.handler;a(this).on("resize",function(f){clearTimeout(c._timer);if(!c._started){f.type="resizestart";c.apply(this,arguments);c._started=true}c._timer=setTimeout(a.proxy(function(){c._started=false},this),d.data||300)})}}});a.extend(a.fn,{resizestop:function(){a(this).on.apply(this,["resizestop"].concat(b.call(arguments)))},resizestart:function(){a(this).on.apply(this,["resizestart"].concat(b.call(arguments)))}})})(jQuery);

(function($) {
    "use strict";

    if (!$.is_on_screen) {
        $.fn.is_on_screen = function(){
            var win = $(window);
            var u = $.tm_getPageScroll();
            var viewport = {
                top : u[1],
                left : u[0]
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();
         
            var bounds = this.offset();
            bounds.right = bounds.left + this.outerWidth();
            bounds.bottom = bounds.top + this.outerHeight();
         
            return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
        };
    }

    if (!$.tm_tooltip) {
        $.tm_tooltip = function(jobj) {
            if (typeof jobj === 'undefined') {
                jobj = $( '.tm-tooltip' );
            }
            var targets = jobj,
                target  = false,
                tooltip = false,
                title   = false;
            if (!targets.length>0 || targets.data('tm-has-tm-tip')){
                return;
            }
            targets.data('tm-has-tm-tip',1);
            targets.each(function(i,el){
                var current_element = $(el);
                var is_swatch = current_element.attr( 'data-tm-tooltip-swatch' );
                if (is_swatch){
                    var label=current_element.closest('.tmcp-field-wrap');
                    if (label.length==0){
                        label=current_element.closest('.cpf_hide_element');
                    }
                    label=label.find('.checkbox_image_label,.tm-tip-html');
                    var tip=$(label).html();
                    current_element.data('tm-tip-html',tip);
                    $(label).hide();
                }

            });
            targets.on( 'mouseenter tmshowtooltip', function(){
                
                target  = $( this );
                if (target.data('is_moving')){
                    return;
                }
                var tip     = target.attr( 'title' );
                var tiphtml = target.attr( 'data-tm-tooltip-html' );
                var is_swatch = target.attr( 'data-tm-tooltip-swatch' );
                tooltip = $( '<div id="tm-tooltip" class="tm-tip"></div>' );
                
                if( !((tip && tip != '') || is_swatch || tiphtml )){
                    return false;
                }
                
                if (target.attr( 'data-tm-tooltip-html' )){
                    tip = target.attr( 'data-tm-tooltip-html' );
                }else{
                    tip = target.attr( 'title' );
                }
                if (is_swatch){
                    tip=target.data('tm-tip-html');
                }
                if (typeof jobj === 'undefined'){
                    target.removeAttr( 'title' );
                }
                tooltip.css( 'opacity', 0 )
                       .html( tip )
                       .appendTo( 'body' );
         
                var init_tooltip = function(nofx){
                    if (nofx==1){
                        if (is_swatch){
                            tip=target.data('tm-tip-html');
                        }else{
                            if (target.attr( 'data-tm-tooltip-html' )){
                                tip = target.attr( 'data-tm-tooltip-html' );
                            }else{
                                tip = target.attr( 'title' );
                            }                            
                        }
                        tooltip.html(tip);    
                    }
                    
                    if( $( window ).width() < tooltip.outerWidth() * 1.5 ){
                        tooltip.css( 'max-width', $( window ).width() / 2 );
                    }else{
                        tooltip.css( 'max-width', 340 );
                    }
                    var u = $.tm_getPageScroll();
                    var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                        pos_top  = target.offset().top - tooltip.outerHeight() - 20;
                    //tooltip.html(target.offset().top-u[1]);
                    var pos_from_top=target.offset().top-u[1]-tooltip.outerHeight();
                    
                    if( pos_left < 0 ){
                        pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                        tooltip.addClass( 'left' );
                    }else{
                        tooltip.removeClass( 'left' );
                    }
                    if( pos_left + tooltip.outerWidth() > $( window ).width() ){
                        pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                        tooltip.addClass( 'right' );
                    }else{
                        tooltip.removeClass( 'right' );
                    }
                    if( pos_top < 0 || pos_from_top < 0){
                        pos_top  = target.offset().top + target.outerHeight();
                        tooltip.addClass( 'top' );
                    }else{
                        tooltip.removeClass( 'top' );
                    }
                    var speed=50;
                    if (nofx){
                        tooltip.css( { left: pos_left, top: (pos_top+10) } ); 
                        target.data('is_moving',false);                       
                    }else{
                        tooltip.css( { left: pos_left, top: pos_top } )
                           .animate( { top: '+=10', opacity: 1 }, speed );
                    }
                };
         
                init_tooltip();
                $( window ).resize( init_tooltip );
                target.data('is_moving',false);
                var remove_tooltip = function(){
                    if (target.data('is_moving')){
                        return;
                    }
                    tooltip.animate( { top: '-=10', opacity: 0 }, 50, function(){
                        $( this ).remove();
                    });
         
                    if (!tiphtml && !is_swatch){
                        target.attr( 'title', tip );
                    }
                };

                target.on( 'tmmovetooltip', function(){target.data('is_moving',true);init_tooltip(1);} );
                target.on( 'mouseleave tmhidetooltip', remove_tooltip );
                tooltip.on( 'click', remove_tooltip );
            });
            return targets;
        }
    }

    $.fn.aserializeArray = function() {
        var rselectTextarea = /^(?:select|textarea)/i,
            rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;
        if (!this.get(0).elements) {
            $(this).wrap('<form></form>');
            var varretval = this.parent().map(function() {
                return this.elements ? $.makeArray(this.elements) : this;
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            }).map(function(i, elem) {
                var val = $(this).val();
                return val == null ? null : $.isArray(val) ? $.map(val, function(val, i) {
                    return {
                        name: elem.name,
                        value: val
                    };
                }) : {
                    name: elem.name,
                    value: val
                };
            }).get();
            $(this).unwrap();
            return varretval;
        } else {
            return this.map(function() {
                return this.elements ? $.makeArray(this.elements) : this;
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            }).map(function(i, elem) {
                var val = $(this).val();
                return val == null ? null : $.isArray(val) ? $.map(val, function(val, i) {
                    return {
                        name: elem.name,
                        value: val
                    };
                }) : {
                    name: elem.name,
                    value: val
                };
            }).get();
        }
    }
    $.fn.serializeObject = function(){
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
    

    if (!$().on) {
        $.fn.on = function(types, selector, data, fn) {
            return this.delegate(selector, types, data, fn);
        }
    }

    /* https://github.com/kvz/phpjs/blob/master/functions/array/array_values.js */
    if (!$.tm_array_values) {
        $.tm_array_values = function(input) {
            var tmp_arr = [], key = '';
            for (key in input) {
                tmp_arr[tmp_arr.length] = input[key];
            }
            return tmp_arr;
        }
    }

    /* https://github.com/kvz/phpjs/blob/master/functions/misc/uniqid.js */
    if (!$.tm_uniqid) {
        $.tm_uniqid = function(prefix, more_entropy) {
            if (typeof prefix === 'undefined') {
                prefix = '';
            }
            var retId;
            var formatSeed = function (seed, reqWidth) {
                seed = parseInt(seed, 10)
                  .toString(16); // to hex str
                if (reqWidth < seed.length) {
                      // so long we split
                    return seed.slice(seed.length - reqWidth);
                }
                if (reqWidth > seed.length) {
                      // so short we pad
                    return Array(1 + (reqWidth - seed.length))
                        .join('0') + seed;
                }
                return seed;
            };
            // BEGIN REDUNDANT
            if (!this.php_js) {
                this.php_js = {};
            }
              // END REDUNDANT
            if (!this.php_js.uniqidSeed) {
                // init seed with big random int
                this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
            }
            this.php_js.uniqidSeed++;

              // start with prefix, add current milliseconds hex string
            retId = prefix;
            retId += formatSeed(parseInt(new Date()
                .getTime() / 1000, 10), 8);
              // add seed hex string
            retId += formatSeed(this.php_js.uniqidSeed, 5);
            if (more_entropy) {
                // for more entropy we add a float lower to 10
                retId += (Math.random() * 10)
                  .toFixed(8)
                  .toString();
            }

            return retId;
        }
    }

    /**
     * Textarea and select clone() bug workaround | Spencer Tipping
     * Licensed under the terms of the MIT source code license
     * https://github.com/spencertipping/jquery.fix.clone/blob/master/jquery.fix.clone.js
     */

    if (!$().tm_clone) {
        $.fn.tm_clone = function() {
            var result = $.fn.clone.apply(this, arguments),
                my_textareas = this.find('textarea').add(this.filter('textarea')),
                result_textareas = result.find('textarea').add(result.filter('textarea')),
                my_selects = this.find('select').add(this.filter('select')),
                result_selects = result.find('select').add(result.filter('select'));
            for (var i = 0, l = my_textareas.length; i < l; ++i) {
                $(result_textareas[i]).val($(my_textareas[i]).val());
            }
            for (var i = 0, l = my_selects.length; i < l; ++i) {
                for (var j = 0, m = my_selects[i].options.length; j < m; ++j) {
                    if (my_selects[i].options[j].selected === true) {
                        result_selects[i].options[j].selected = true;
                    }
                }
            }
            return result;
        }
    }

    (function() {
        // based on easing equations from Robert Penner (http://www.robertpenner.com/easing)
        var baseEasings = {};
        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(i, name) {
            baseEasings[name] = function(p) {
                return Math.pow(p, i + 2);
            };
        });
        $.extend(baseEasings, {
            Sine: function(p) {
                return 1 - Math.cos(p * Math.PI / 2);
            },
            Circ: function(p) {
                return 1 - Math.sqrt(1 - p * p);
            },
            Elastic: function(p) {
                return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
            },
            Back: function(p) {
                return p * p * (3 * p - 2);
            },
            Bounce: function(p) {
                var pow2,
                    bounce = 4;

                while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
                return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
            }
        });
        $.each(baseEasings, function(name, easeIn) {
            $.easing["easeIn" + name] = easeIn;
            $.easing["easeOut" + name] = function(p) {
                return 1 - easeIn(1 - p);
            };
            $.easing["easeInOut" + name] = function(p) {
                return p < 0.5 ?
                    easeIn(p * 2) / 2 :
                    1 - easeIn(p * -2 + 2) / 2;
            };
        });
    })();

    if (!$().tm_getPageSize) {
        $.tm_getPageSize = function() {
            var e, t, pageHeight, pageWidth;
            if (window.innerHeight && window.scrollMaxY) {
                e = window.innerWidth + window.scrollMaxX;
                t = window.innerHeight + window.scrollMaxY;
            } else if (document.body.scrollHeight > document.body.offsetHeight) {
                e = document.body.scrollWidth;
                t = document.body.scrollHeight;
            } else {
                e = document.body.offsetWidth;
                t = document.body.offsetHeight;
            }
            var n, r;
            if (self.innerHeight) {
                if (document.documentElement.clientWidth) {
                    n = document.documentElement.clientWidth;
                } else {
                    n = self.innerWidth;
                }
                r = self.innerHeight
            } else if (document.documentElement && document.documentElement.clientHeight) {
                n = document.documentElement.clientWidth;
                r = document.documentElement.clientHeight;
            } else if (document.body) {
                n = document.body.clientWidth;
                r = document.body.clientHeight;
            }
            if (t < r) {
                pageHeight = r;
            } else {
                pageHeight = t;
            } if (e < n) {
                pageWidth = n;
            } else {
                pageWidth = e;
            }
            return new Array(pageWidth, pageHeight, n, r, e, t);

        }
    }

    if (!$().tm_getPageScroll) {
        $.tm_getPageScroll = function() {
            var e, t;
            if (self.pageYOffset) {
                t = self.pageYOffset;
                e = self.pageXOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) {
                t = document.documentElement.scrollTop;
                e = document.documentElement.scrollLeft;
            } else if (document.body) {
                t = document.body.scrollTop;
                e = document.body.scrollLeft;
            }
            return new Array(e, t);

        }
    }

    if (!$().tm_floatbox) {
        $.fn.tm_floatbox = function(t) {
            function s(e) {
                if (o(e, n)) {
                    return n;
                } else {
                    return false;
                }
            }

            function f() {
                if (t.hideelements) $("embed, object, select").css({
                    visibility: "visible"
                });
                if (t.showoverlay == true) {
                    if (t._ovl) {
                        t._ovl.unbind();
                        t._ovl.remove();
                    }
                }  
                //$(t.floatboxID).removeClass("animated appear");
                $(t.floatboxID).removeClass("fadeInDown").addClass("fadeOutDown");
                $(t.floatboxID).animate({
                    opacity: 0
                    
                    
                    }, 1000, function() {
                        $(t.floatboxID).remove();                      
                    }
                );
                

                
                var _in = $.fn.tm_floatbox.instances.length;
                if (_in > 0) {
                    var _t = $.fn.tm_floatbox.instances[_in - 1];
                    if (t.id == _t.id) $.fn.tm_floatbox.instances.pop();
                }

                $(window).off("scroll.tmfloatbox");
            }

            function o(n, s) {
                if (s.length == 1) {
                    f();
                    if (t.hideelements) $("embed, object, select").css({
                        visibility: "hidden"
                    });
                    $(t.type).attr("id", t.id).addClass(t.classname).html(t.data).appendTo(n);
                    var _in = $.fn.tm_floatbox.instances.length;
                    if (_in > 0) {
                        var _t = $.fn.tm_floatbox.instances[_in - 1];
                        t.zIndex = _t.zIndex + 100;
                    }
                    $.fn.tm_floatbox.instances.push(t);
                    $(t.floatboxID).css({
                        width: t.width,
                        height: t.height
                    });
                    var o = $.tm_getPageSize();
                    var u = $.tm_getPageScroll();
                    var l = 0;
                    var c = parseInt(u[1] + (o[3] - $(t.floatboxID).height()) / 2);
                    var h = parseInt(u[0] + (o[2] - $(t.floatboxID).width()) / 2);
                    $(t.floatboxID).css({
                        top: l + "px",
                        left: h + "px",
                        "z-index": t.zIndex
                    });
                    r = l;
                    i = h;
                    n.cancelfunc = t.cancelfunc;
                    if (t.showoverlay == true) {
                        t._ovl = $('<div class="fl-overlay"></div>').css({
                            zIndex: (t.zIndex - 1),
                            opacity: .8
                        });
                        t._ovl.appendTo("body");
                        if (!t.ismodal) t._ovl.click(t.cancelfunc);
                    }
                    if (t.showfunc) {
                        t.showfunc.call();
                    }
                   
                    $(t.floatboxID).addClass("animated fadeInDown");
                    if (t.refresh=="fixed"){
                        var top = parseInt( (o[3] - $(t.floatboxID).height()) / 2);
                        $(t.floatboxID).css({
                            position: "fixed",
                            top: top + "px",
                        });
                    }else{
                        a();
                        $(window).on("scroll.tmfloatbox",doit);
                    }

                    return true;
                } else {
                    return false;
                }
            }

            function requestTick() {
                if(!ticking) {
                    if (t.refresh){
                        setTimeout(function() {
                            requestAnimationFrame(update);
                        }, t.refresh );
                    }else{
                        requestAnimationFrame(update);
                    }
                    
                    ticking = true;
                }
            }

            function update() {
                a();
                ticking = false;
            }

            function doit(){
                requestTick();
            }

            function u(n, r) {
                $(t.floatboxID).css({
                    top: n + "px",
                    left: r + "px",
                    opacity: 1
                });
            }

            function a() {
                var n = $.tm_getPageSize();
                var s = $.tm_getPageScroll();
                var o = parseInt(s[1] + (n[3] - $(t.floatboxID).height()) / 2);
                var a = parseInt(s[0] + (n[2] - $(t.floatboxID).width()) / 2);
                o = parseInt((o - r) / t.fps);
                a = parseInt((a - i) / t.fps);
                r += o;
                i += a;
                u(r, i);
            }

            t = jQuery.extend({
                id: "flasho",
                classname: "flasho",
                type: "div",
                data: "",
                width: "500px",
                height: "auto",
                refresh: false,
                fps: 4,
                hideelements: false,
                showoverlay: true,
                zIndex: 100100,
                ismodal: false,
                cancelfunc: f,
                showfunc: null
            }, t);
            t.floatboxID = "#" + t.id;
            t.type = "<" + t.type + ">";
            var n = this;
            var r = 0;
            var i = 0;
            var ticking = false;

            return s(this);
        }
        $.fn.tm_floatbox.instances = [];
        
    }

    if (!$().tmtabs) {
        $.fn.tmtabs = function() {
            var elements = this;
            
            if (elements.length==0){
                return;
            }

            return elements.each(function(){
                var t=$(this),
                    headers = t.find(".tm-tab-headers .tab-header");
                if (headers.length==0){
                    return;
                }
                var init_open=0,
                    last=false,
                    current="";
                headers.each(function(i,header){
                    
                    var id="."+$(header).attr("data-id");
                    $(header).data("tab",id);
                    t.find(id).hide().data("state","closed");
                    if (!init_open && $(header).is(".open")){
                        $(header).removeClass("closed open").addClass("open").data("state","open");
                        $(header).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-up");
                        t.find(id).data("state","open").show();
                        init_open=1;
                        current=id;
                        last=$(header);
                    }else{
                        $(header).removeClass("closed open").addClass("closed").data("state","closed");
                    }
                    
                    $(header).on("closetab.tmtabs",function(e){
                        var _tab=t.find($(this).data("tab"));
                        $(this).removeClass("closed open").addClass("closed");
                        $(this).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-down");
                        _tab.hide().removeClass("animated fadeInDown");
                    });

                    $(header).on("opentab.tmtabs",function(e){
                        $(this).removeClass("closed open").addClass("open");
                        $(this).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-up");
                        t.find($(this).data("tab")).show().removeClass("animated fadeInDown").addClass("animated fadeInDown");
                        current=$(this).data("tab");
                    });
                    
                    $(header).on("click.tmtabs",function(e){
                        e.preventDefault();
                        if (current==$(this).data("tab")){
                            return;
                        }
                        if (last){
                            $(last).trigger("closetab.tmtabs");
                        }
                        $(this).trigger("opentab.tmtabs");
                        last=$(this);
                    });

                });
            });
        };
    }
    
    if (!$().tmtoggle) {
        $.fn.tmtoggle = function() {
            var elements = this;
            
            if (elements.length==0){
                return;
            }

            return elements.each(function(){
                var t=$(this);
                if (!t.data('tm-toggle-init')){
                    t.data('tm-toggle-init',1);
                    var headers = t.find(".tm-toggle"),
                        wrap=t.find(".tm-collapse-wrap"),
                        wraps=$(".tm-collapse.tmaccordion").find(".tm-toggle");
                    if (headers.length==0 || wrap.length==0){
                        return;
                    }

                    if (wrap.is(".closed")){
                        $(wrap).removeClass("closed open").addClass("closed").hide();
                        $(headers).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-down");
                    }else{
                        $(wrap).removeClass("closed open").addClass("open").show();
                        $(headers).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-up");
                    }

                    headers.each(function(i,header){
                                            
                        $(header).on("closewrap.tmtoggle",function(e){
                            if (t.is('.tmaccordion') && $(wrap).is(".closed")){
                                return;
                            }                                            
                            $(wrap).removeClass("closed open").addClass("closed");
                            $(this).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-down");
                            $(wrap).removeClass("animated fadeInDown");
                            if (t.is('.tmaccordion')){
                                $(wrap).hide();
                            }else{
                                $(wrap).animate({"height":"toggle"},100,function(){$(wrap).hide();});
                            }                        
                            $(window).trigger("tmlazy");
                        });

                        $(header).on("openwrap.tmtoggle",function(e){
                            if (t.is('.tmaccordion')){
                                $(wraps).not($(this)).trigger("closewrap.tmtoggle");
                            }
                            $(wrap).removeClass("closed open").addClass("open");
                            $(this).find(".tm-arrow").removeClass("fa-angle-down fa-angle-up").addClass("fa-angle-up");
                            $(wrap).show().removeClass("animated fadeInDown").addClass("animated fadeInDown");
                            $(window).trigger("tmlazy");
                            if (t.is('.tmaccordion') && !t.is_on_screen()){
                                $(window).scrollTo($(header));
                            }
                        });
                        
                        $(header).on("click.tmtoggle",function(e){
                            e.preventDefault();
                            if ($(wrap).is(".closed")){
                                $(this).trigger("openwrap.tmtoggle");                            
                            }else{
                                $(this).trigger("closewrap.tmtoggle");
                            }
                        });

                    });
                }
            });
        };
    }

    if (!$().tmpoplink) {
        $.fn.tmpoplink = function() {
            var elements = this;
            
            if (elements.length==0){
                return;
            }

            var floatbox_template= function(data) {
                var out = '';
                out = "<div class=\'header\'><h3>" + data.title + "<\/h3><\/div>" +
                    "<div id=\'" + data.id + "\' class=\'float_editbox\'>" +
                    data.html + "<\/div>" +
                    "<div class=\'footer\'><div class=\'inner\'><span class=\'tm-button button button-secondary button-large details_cancel\'>" +
                    tm_epo_js.i18n_close +
                    "<\/span><\/div><\/div>";
                return out;
            }

            return elements.each(function(){
                var t=$(this),
                    id=$(this).attr('href'),
                    title=$(this).attr('data-title')?$(this).attr('data-title'):tm_epo_js.i18n_addition_options,
                    html = $(id).html(),
                    $_html = floatbox_template({
                        "id": "temp_for_floatbox_insert",
                        "html": html,
                        "title": title
                    }),
                    clicked=false;

                t.on("click.tmpoplink",function(e){
                    e.preventDefault();
                    var _to = $("body").tm_floatbox({
                        "fps": 1,
                        "ismodal": false,
                        "refresh": 100,
                        "width": "80%",
                        "height": "80%",
                        "classname": "flasho tm_wrapper",
                        "data": $_html
                    });

                    $(".details_cancel").click(function() {
                        if (clicked){
                            return;
                        }
                        clicked=true;
                        if (_to){
                             clicked=false;
                            _to.cancelfunc();
                        }
                    });
                });
                

                
            });
        };
    }

})(jQuery);

// jQuery Mask Plugin v1.11.2
// github.com/igorescobar/jQuery-Mask-Plugin
(function(a){"function"===typeof define&&define.amd?define(["jquery"],a):a(window.jQuery||window.Zepto)})(function(a){var y=function(b,d,e){b=a(b);var g=this,l=b.val(),m;d="function"===typeof d?d(b.val(),void 0,b,e):d;var c={invalid:[],getCaret:function(){try{var k,r=0,a=b.get(0),f=document.selection,c=a.selectionStart;if(f&&-1===navigator.appVersion.indexOf("MSIE 10"))k=f.createRange(),k.moveStart("character",b.is("input")?-b.val().length:-b.text().length),r=k.text.length;else if(c||"0"===c)r=c;
return r}catch(d){}},setCaret:function(k){try{if(b.is(":focus")){var r,a=b.get(0);a.setSelectionRange?a.setSelectionRange(k,k):a.createTextRange&&(r=a.createTextRange(),r.collapse(!0),r.moveEnd("character",k),r.moveStart("character",k),r.select())}}catch(c){}},events:function(){b.on("keyup.mask",c.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){b.keydown().keyup()},100)}).on("change.mask",function(){b.data("changed",!0)}).on("blur.mask",function(){l===b.val()||b.data("changed")||
b.trigger("change");b.data("changed",!1)}).on("keydown.mask, blur.mask",function(){l=b.val()}).on("focus.mask",function(k){!0===e.selectOnFocus&&a(k.target).select()}).on("focusout.mask",function(){e.clearIfNotMatch&&!m.test(c.val())&&c.val("")})},getRegexMask:function(){for(var k=[],b,a,c,e,h=0;h<d.length;h++)(b=g.translation[d[h]])?(a=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),c=b.optional,(b=b.recursive)?(k.push(d[h]),e={digit:d[h],pattern:a}):k.push(c||b?a+"?":a)):k.push(d[h].replace(/[-\/\\^$*+?.()|[\]{}]/g,
"\\$&"));k=k.join("");e&&(k=k.replace(RegExp("("+e.digit+"(.*"+e.digit+")?)"),"($1)?").replace(RegExp(e.digit,"g"),e.pattern));return RegExp(k)},destroyEvents:function(){b.off("keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(k){var a=b.is("input")?"val":"text";if(0<arguments.length){if(b[a]()!==k)b[a](k);a=b}else a=b[a]();return a},getMCharsBeforeCount:function(a,b){for(var c=0,f=0,e=d.length;f<e&&f<a;f++)g.translation[d.charAt(f)]||(a=b?a+1:a,c++);return c},caretPos:function(a,
b,e,f){return g.translation[d.charAt(Math.min(a-1,d.length-1))]?Math.min(a+e-b-f,e):c.caretPos(a+1,b,e,f)},behaviour:function(b){b=b||window.event;c.invalid=[];var e=b.keyCode||b.which;if(-1===a.inArray(e,g.byPassKeys)){var d=c.getCaret(),f=c.val().length,p=d<f,h=c.getMasked(),l=h.length,n=c.getMCharsBeforeCount(l-1)-c.getMCharsBeforeCount(f-1);c.val(h);!p||65===e&&b.ctrlKey||(8!==e&&46!==e&&(d=c.caretPos(d,f,l,n)),c.setCaret(d));return c.callbacks(b)}},getMasked:function(b){var a=[],l=c.val(),f=
0,p=d.length,h=0,m=l.length,n=1,q="push",u=-1,t,w;e.reverse?(q="unshift",n=-1,t=0,f=p-1,h=m-1,w=function(){return-1<f&&-1<h}):(t=p-1,w=function(){return f<p&&h<m});for(;w();){var x=d.charAt(f),v=l.charAt(h),s=g.translation[x];if(s)v.match(s.pattern)?(a[q](v),s.recursive&&(-1===u?u=f:f===t&&(f=u-n),t===u&&(f-=n)),f+=n):s.optional?(f+=n,h-=n):s.fallback?(a[q](s.fallback),f+=n,h-=n):c.invalid.push({p:h,v:v,e:s.pattern}),h+=n;else{if(!b)a[q](x);v===x&&(h+=n);f+=n}}b=d.charAt(t);p!==m+1||g.translation[b]||
a.push(b);return a.join("")},callbacks:function(a){var g=c.val(),m=g!==l,f=[g,a,b,e],p=function(a,b,c){"function"===typeof e[a]&&b&&e[a].apply(this,c)};p("onChange",!0===m,f);p("onKeyPress",!0===m,f);p("onComplete",g.length===d.length,f);p("onInvalid",0<c.invalid.length,[g,a,b,c.invalid,e])}};g.mask=d;g.options=e;g.remove=function(){var a=c.getCaret();c.destroyEvents();c.val(g.getCleanVal());c.setCaret(a-c.getMCharsBeforeCount(a));return b};g.getCleanVal=function(){return c.getMasked(!0)};g.init=
function(d){d=d||!1;e=e||{};g.byPassKeys=a.jMaskGlobals.byPassKeys;g.translation=a.jMaskGlobals.translation;g.translation=a.extend({},g.translation,e.translation);g=a.extend(!0,{},g,e);m=c.getRegexMask();!1===d?(e.placeholder&&b.attr("placeholder",e.placeholder),b.attr("autocomplete","off"),c.destroyEvents(),c.events(),d=c.getCaret(),c.val(c.getMasked()),c.setCaret(d+c.getMCharsBeforeCount(d,!0))):(c.events(),c.val(c.getMasked()))};g.init(!b.is("input"))};a.maskWatchers={};var A=function(){var b=
a(this),d={},e=b.attr("data-mask");b.attr("data-mask-reverse")&&(d.reverse=!0);b.attr("data-mask-clearifnotmatch")&&(d.clearIfNotMatch=!0);"true"===b.attr("data-mask-selectonfocus")&&(d.selectOnFocus=!0);if(z(b,e,d))return b.data("mask",new y(this,e,d))},z=function(b,d,e){e=e||{};var g=a(b).data("mask"),l=JSON.stringify;b=a(b).val()||a(b).text();try{return"function"===typeof d&&(d=d(b)),"object"!==typeof g||l(g.options)!==l(e)||g.mask!==d}catch(m){}};a.fn.mask=function(b,d){d=d||{};var e=this.selector,
g=a.jMaskGlobals,l=a.jMaskGlobals.watchInterval,m=function(){if(z(this,b,d))return a(this).data("mask",new y(this,b,d))};a(this).each(m);e&&""!==e&&g.watchInputs&&(clearInterval(a.maskWatchers[e]),a.maskWatchers[e]=setInterval(function(){a(document).find(e).each(m)},l));return this};a.fn.unmask=function(){clearInterval(a.maskWatchers[this.selector]);delete a.maskWatchers[this.selector];return this.each(function(){var b=a(this).data("mask");b&&b.remove().removeData("mask")})};a.fn.cleanVal=function(){return this.data("mask").getCleanVal()};
a.applyDataMask=function(){a(document).find(a.jMaskGlobals.maskElements).filter(q.dataMaskAttr).each(A)};var q={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};a.jMaskGlobals=a.jMaskGlobals||{};q=a.jMaskGlobals=a.extend(!0,{},q,a.jMaskGlobals);
q.dataMask&&a.applyDataMask();setInterval(function(){a.jMaskGlobals.watchDataMask&&a.applyDataMask()},q.watchInterval)});


/*! jQuery JSON plugin v2.5.1 | github.com/Krinkle/jquery-json */
!function($){"use strict";var escape=/["\\\x00-\x1f\x7f-\x9f]/g,meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},hasOwn=Object.prototype.hasOwnProperty;$.toJSON="object"==typeof JSON&&JSON.stringify?JSON.stringify:function(a){if(null===a)return"null";var b,c,d,e,f=$.type(a);if("undefined"===f)return void 0;if("number"===f||"boolean"===f)return String(a);if("string"===f)return $.quoteString(a);if("function"==typeof a.toJSON)return $.toJSON(a.toJSON());if("date"===f){var g=a.getUTCMonth()+1,h=a.getUTCDate(),i=a.getUTCFullYear(),j=a.getUTCHours(),k=a.getUTCMinutes(),l=a.getUTCSeconds(),m=a.getUTCMilliseconds();return 10>g&&(g="0"+g),10>h&&(h="0"+h),10>j&&(j="0"+j),10>k&&(k="0"+k),10>l&&(l="0"+l),100>m&&(m="0"+m),10>m&&(m="0"+m),'"'+i+"-"+g+"-"+h+"T"+j+":"+k+":"+l+"."+m+'Z"'}if(b=[],$.isArray(a)){for(c=0;c<a.length;c++)b.push($.toJSON(a[c])||"null");return"["+b.join(",")+"]"}if("object"==typeof a){for(c in a)if(hasOwn.call(a,c)){if(f=typeof c,"number"===f)d='"'+c+'"';else{if("string"!==f)continue;d=$.quoteString(c)}f=typeof a[c],"function"!==f&&"undefined"!==f&&(e=$.toJSON(a[c]),b.push(d+":"+e))}return"{"+b.join(",")+"}"}},$.evalJSON="object"==typeof JSON&&JSON.parse?JSON.parse:function(str){return eval("("+str+")")},$.secureEvalJSON="object"==typeof JSON&&JSON.parse?JSON.parse:function(str){var filtered=str.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(filtered))return eval("("+str+")");throw new SyntaxError("Error parsing JSON, source is not valid.")},$.quoteString=function(a){return a.match(escape)?'"'+a.replace(escape,function(a){var b=meta[a];return"string"==typeof b?b:(b=a.charCodeAt(),"\\u00"+Math.floor(b/16).toString(16)+(b%16).toString(16))})+'"':'"'+a+'"'}}(jQuery);

/*! Lazy Load 1.9.3 - MIT license - Copyright 2010-2013 Mika Tuupola */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);

/*
 *  Project: prettyCheckable
 *  Description: jQuery plugin to replace checkboxes and radios for custom images
 *  Author: Arthur Gouveia
 *  License: Licensed under the MIT License
 */
/*
 *  Project: prettyCheckable
 *  Description: jQuery plugin to replace checkboxes and radios for custom images
 *  Author: Arthur Gouveia
 *  License: Licensed under the MIT License
 */
/* global jQuery:true, ko:true */
;(function ( $, window, document, undefined ) {
    'use strict';

    var pluginName = 'prettyCheckable',
        dataPlugin = 'plugin_' + pluginName,
        defaults = {
            label: '',
            labelPosition: 'right',
            customClass: '',
            color: 'blue',
            nolabel:true
        };

    var addCheckableEvents = function (element) {
        if (window.ko) {
            $(element).on('change', function(e) {
                e.preventDefault();
                //only changes from knockout model
                if (e.originalEvent === undefined) {
                    var clickedParent = $(this).closest('.clearfix'),
                        fakeCheckable = $(clickedParent).find('a:first'),
                        isChecked = fakeCheckable.hasClass('checked');
                    if (isChecked === true) {
                        fakeCheckable.addClass('checked');
                    } else {
                        fakeCheckable.removeClass('checked');
                    }
                }
            });
        }

        element.find('a:first, label').on('touchstart click', function(e){
            e.preventDefault();
            var clickedParent = $(this).closest('.clearfix'),
                input = clickedParent.find('input'),
                fakeCheckable = clickedParent.find('a:first');

            if (fakeCheckable.hasClass('disabled') === true) {
                return;
            }

            if (input.prop('type') === 'radio') {
                $('input[name="' + input.attr('name') + '"]').each(function(index, el){
                    $(el).prop('checked', false).parent().find('a:first').removeClass('checked');
                });
            }

            if (window.ko) {
                ko.utils.triggerEvent(input[0], 'click');
            } else {
                if (input.prop('checked')) {
                    input.prop('checked', false).change();
                } else {
                    input.prop('checked', true).change();
                }
            }
            fakeCheckable.toggleClass('checked');
        });

        element.find('a:first').on('keyup', function(e){
            if (e.keyCode === 32) {
                $(this).click();
            }
        });
    };

    var Plugin = function ( element ) {
        this.element = element;
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {
        init: function ( options ) {
            $.extend( this.options, options );
            var el = $(this.element);
            el.parent().addClass('has-pretty-child');
            el.css('display', 'none');
            var classType = el.data('type') !== undefined ? el.data('type') : el.attr('type');
            var label = null,
                elLabelId = el.attr('id');
            if (elLabelId !== undefined && !this.options.nolabel) {
                var elLabel = $('label[for=' + elLabelId + ']');
                if (elLabel.length > 0) {
                    label = elLabel.text();
                    elLabel.remove();
                }
            }
            if (this.options.label === '') {
                this.options.label = label;
            }
            label = el.data('label') !== undefined ? el.data('label') : this.options.label;
            var labelPosition = el.data('labelposition') !== undefined ? 'label' + el.data('labelposition') : 'label' + this.options.labelPosition;
            var customClass = el.data('customclass') !== undefined ? el.data('customclass') : this.options.customClass;
            var color =  el.data('color') !== undefined ? el.data('color') : this.options.color;
            //var disabled = el.prop('disabled') === true ? 'disabled' : '';
            // temp fix
            var disabled = el.prop('disabled') === true ? '' : '';
            var containerClasses = ['pretty' + classType, labelPosition, customClass, color].join(' ');
            el.wrap('<div class="clearfix ' + containerClasses + '"></div>').parent().html();
            var dom = [];
            var isChecked = el.prop('checked') ? 'checked' : '';
            if (labelPosition === 'labelright') {
                dom.push('<a href="#" class="' + isChecked + ' ' + disabled + '"></a>');
                if(!this.options.nolabel)dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');
            } else {
                dom.push('<label for="' + el.attr('id') + '">' + label + '</label>');
                if(!this.options.nolabel)dom.push('<a href="#" class="' + isChecked + ' ' + disabled + '"></a>');
            }
            el.parent().append(dom.join('\n'));
            addCheckableEvents(el.parent());
        },

        check: function () {
            if ($(this.element).prop('type') === 'radio') {
                $('input[name="' + $(this.element).attr('name') + '"]').each(function(index, el){
                    $(el).prop('checked', false).attr('checked', false).parent().find('a:first').removeClass('checked');
                });
            }
            $(this.element).prop('checked', true).attr('checked', true).parent().find('a:first').addClass('checked');
        },
        uncheck: function () {
            $(this.element).prop('checked', false).attr('checked', false).parent().find('a:first').removeClass('checked');
        },
        enable: function () {
            $(this.element).removeAttr('disabled').parent().find('a:first').removeClass('disabled');
        },
        disable: function () {
            $(this.element).attr('disabled', 'disabled').parent().find('a:first').addClass('disabled');
        },
        destroy: function () {
            var el = $(this.element),
                clonedEl = el.clone(),
                label = null,
                elLabelId = el.attr('id');

            if (elLabelId !== undefined && !this.options.nolabel) {
                var elLabel = $('label[for=' + elLabelId + ']');
                if (elLabel.length > 0) {
                    elLabel.insertBefore(el.parent());
                }
            }
            clonedEl.removeAttr('style').insertAfter(elLabel);
            el.parent().remove();
        }
    };

    $.fn[ pluginName ] = function ( arg ) {
        var args, instance;
        if (!( this.data( dataPlugin ) instanceof Plugin )) {
            this.data( dataPlugin, new Plugin( this ) );
        }
        instance = this.data( dataPlugin );
        if (instance){
            instance.element = this;
            if (typeof arg === 'undefined' || typeof arg === 'object') {
                if ( typeof instance.init === 'function' ) {
                    instance.init( arg );
                }
            } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {
                args = Array.prototype.slice.call( arguments, 1 );
                return instance[arg].apply( instance, args );
            } else {
                $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);
            }
        }
    };
}(jQuery, window, document));

/*
 *  Project: nouislider (http://refreshless.com/nouislider/)
 *  Description: noUiSlider is a range slider without bloat
 *  License: http://www.wtfpl.net/about/
 */
(function(){function c(a){return a.split("").reverse().join("")}function l(a,b){return a.substring(0,b.length)===b}function q(a,b,d){if((a[b]||a[d])&&a[b]===a[d])throw Error(b);}function m(a,b,d,e,n,h,w,k,A,H,D,g){w=g;var l,s=D="";h&&(g=h(g));if("number"!==typeof g||!isFinite(g))return!1;a&&0===parseFloat(g.toFixed(a))&&(g=0);0>g&&(l=!0,g=Math.abs(g));!1!==a&&(h=g,g=Math.pow(10,a),g=(Math.round(h*g)/g).toFixed(a));g=g.toString();-1!==g.indexOf(".")?(a=g.split("."),h=a[0],d&&(D=d+a[1])):h=g;b&&(h=
c(h).match(/.{1,3}/g),h=c(h.join(c(b))));l&&k&&(s+=k);e&&(s+=e);l&&A&&(s+=A);s=s+h+D;n&&(s+=n);H&&(s=H(s,w));return s}function u(a,b,d,c,e,h,w,k,A,H,D,g){var m;a="";D&&(g=D(g));if(!g||"string"!==typeof g)return!1;k&&l(g,k)&&(g=g.replace(k,""),m=!0);c&&l(g,c)&&(g=g.replace(c,""));A&&l(g,A)&&(g=g.replace(A,""),m=!0);if(c=e)c=g.slice(-1*e.length)===e;c&&(g=g.slice(0,-1*e.length));b&&(g=g.split(b).join(""));d&&(g=g.replace(d,"."));m&&(a+="-");a=(a+g).replace(/[^0-9\.\-.]/g,"");if(""===a)return!1;a=Number(a);
w&&(a=w(a));return"number"===typeof a&&isFinite(a)?a:!1}function a(a){var b,d,c,n={};for(b=0;b<e.length;b+=1)if(d=e[b],c=a[d],void 0===c)n[d]="negative"!==d||n.negativeBefore?"mark"===d&&"."!==n.thousand?".":!1:"-";else if("decimals"===d)if(0<=c&&8>c)n[d]=c;else throw Error(d);else if("encoder"===d||"decoder"===d||"edit"===d||"undo"===d)if("function"===typeof c)n[d]=c;else throw Error(d);else if("string"===typeof c)n[d]=c;else throw Error(d);q(n,"mark","thousand");q(n,"prefix","negative");q(n,"prefix",
"negativeBefore");return n}function b(a,b,d){var c,n=[];for(c=0;c<e.length;c+=1)n.push(a[e[c]]);n.push(d);return b.apply("",n)}function d(c){if(!(this instanceof d))return new d(c);"object"===typeof c&&(c=a(c),this.to=function(a){return b(c,m,a)},this.from=function(a){return b(c,u,a)})}var e="decimals thousand mark prefix postfix encoder decoder negativeBefore negative edit undo".split(" ");window.wNumb=d})();(function(c){function l(a){return a instanceof c||c.zepto&&c.zepto.isZ(a)}function q(a,b,d){var e=this,f=!1;this.changeHandler=function(a){var b=e.formatInstance.from(c(this).val());if(!1===b||isNaN(b))return c(this).val(e.lastSetValue),!1;e.changeHandlerMethod.call("",a,b)};this.el=!1;this.formatInstance=d;c.each(u,function(d,c){f=c.call(e,a,b);return!f});if(!f)throw new RangeError("(Link) Invalid Link.");}function m(a){this.items=[];this.elements=[];this.origin=a}var u=[function(a,b){if("string"===
typeof a&&0===a.indexOf("-inline-"))return this.method=b||"html",this.target=this.el=c(a.replace("-inline-","")||"<div/>"),!0},function(a){if("string"===typeof a&&0!==a.indexOf("-")){this.method="val";var b=document.createElement("input");b.name=a;b.type="hidden";this.target=this.el=c(b);return!0}},function(a){if("function"===typeof a)return this.target=!1,this.method=a,!0},function(a,b){if(l(a)&&!b)return a.is("input, select, textarea")?(this.method="val",this.target=a.on("change.liblink",this.changeHandler)):
(this.target=a,this.method="html"),!0},function(a,b){if(l(a)&&("function"===typeof b||"string"===typeof b&&a[b]))return this.method=b,this.target=a,!0}];q.prototype.set=function(a){var b=Array.prototype.slice.call(arguments).slice(1);this.lastSetValue=this.formatInstance.to(a);b.unshift(this.lastSetValue);("function"===typeof this.method?this.method:this.target[this.method]).apply(this.target,b)};m.prototype.push=function(a,b){this.items.push(a);b&&this.elements.push(b)};m.prototype.reconfirm=function(a){var b;
for(b=0;b<this.elements.length;b+=1)this.origin.LinkConfirm(a,this.elements[b])};m.prototype.remove=function(a){for(a=0;a<this.items.length;a+=1)this.items[a].target.off(".liblink");for(a=0;a<this.elements.length;a+=1)this.elements[a].remove()};m.prototype.change=function(a){if(this.origin.LinkIsEmitting)return!1;this.origin.LinkIsEmitting=!0;var b=Array.prototype.slice.call(arguments,1),d;b.unshift(a);for(d=0;d<this.items.length;d+=1)this.items[d].set.apply(this.items[d],b);this.origin.LinkIsEmitting=
!1};c.fn.Link=function(a){var b=this;if(!1===a)return b.each(function(){this.linkAPI&&(c.map(this.linkAPI,function(a){a.remove()}),delete this.linkAPI)});if(void 0===a)a=0;else if("string"!==typeof a)throw Error("Flag must be string.");return{to:function(d,e,f){return b.each(function(){var b=a;0===b&&(b=this.LinkDefaultFlag);this.linkAPI||(this.linkAPI={});this.linkAPI[b]||(this.linkAPI[b]=new m(this));var p=new q(d,e,f||this.LinkDefaultFormatter);p.target||(p.target=c(this));p.changeHandlerMethod=
this.LinkConfirm(b,p.el);this.linkAPI[b].push(p,p.el);this.LinkUpdate(b)})}}}})(window.jQuery||window.Zepto);(function(c){function l(a){return"number"===typeof a&&!isNaN(a)&&isFinite(a)}function q(a,b){return 100*b/(a[1]-a[0])}function m(a,b){for(var d=1;a>=b[d];)d+=1;return d}function u(a,b,d,c){this.xPct=[];this.xVal=[];this.xSteps=[c||!1];this.xNumSteps=[!1];this.snap=b;this.direction=d;for(var f in a)if(a.hasOwnProperty(f)){b=f;d=a[f];c=void 0;"number"===typeof d&&(d=[d]);if("[object Array]"!==Object.prototype.toString.call(d))throw Error("noUiSlider: 'range' contains invalid value.");c="min"===b?0:
"max"===b?100:parseFloat(b);if(!l(c)||!l(d[0]))throw Error("noUiSlider: 'range' value isn't numeric.");this.xPct.push(c);this.xVal.push(d[0]);c?this.xSteps.push(isNaN(d[1])?!1:d[1]):isNaN(d[1])||(this.xSteps[0]=d[1])}this.xNumSteps=this.xSteps.slice(0);for(f in this.xNumSteps)this.xNumSteps.hasOwnProperty(f)&&(a=Number(f),(b=this.xNumSteps[f])&&(this.xSteps[a]=q([this.xVal[a],this.xVal[a+1]],b)/(100/(this.xPct[a+1]-this.xPct[a]))))}u.prototype.getMargin=function(a){return 2===this.xPct.length?q(this.xVal,
a):!1};u.prototype.toStepping=function(a){var b=this.xVal,c=this.xPct;if(a>=b.slice(-1)[0])a=100;else{var e=m(a,b),f,l;f=b[e-1];l=b[e];b=c[e-1];c=c[e];f=[f,l];a=q(f,0>f[0]?a+Math.abs(f[0]):a-f[0]);a=b+a/(100/(c-b))}this.direction&&(a=100-a);return a};u.prototype.fromStepping=function(a){this.direction&&(a=100-a);var b;var c=this.xVal;b=this.xPct;if(100<=a)b=c.slice(-1)[0];else{var e=m(a,b),f,l;f=c[e-1];l=c[e];c=b[e-1];f=[f,l];b=100/(b[e]-c)*(a-c)*(f[1]-f[0])/100+f[0]}a=Math.pow(10,7);return Number((Math.round(b*
a)/a).toFixed(7))};u.prototype.getStep=function(a){this.direction&&(a=100-a);var b=this.xPct,c=this.xSteps,e=this.snap;if(100!==a){var f=m(a,b);e?(c=b[f-1],b=b[f],a=a-c>(b-c)/2?b:c):(c[f-1]?(e=b[f-1],c=c[f-1],b=Math.round((a-b[f-1])/c)*c,b=e+b):b=a,a=b)}this.direction&&(a=100-a);return a};u.prototype.getApplicableStep=function(a){var b=m(a,this.xPct);a=100===a?2:1;return[this.xNumSteps[b-2],this.xVal[b-a],this.xNumSteps[b-a]]};u.prototype.convert=function(a){return this.getStep(this.toStepping(a))};
c.noUiSlider={Spectrum:u}})(window.jQuery||window.Zepto);(function(c){function l(a){return"number"===typeof a&&!isNaN(a)&&isFinite(a)}function q(a,b){if(!l(b))throw Error("noUiSlider: 'step' is not numeric.");a.singleStep=b}function m(a,b){if("object"!==typeof b||c.isArray(b))throw Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw Error("noUiSlider: Missing 'min' or 'max' in 'range'.");a.spectrum=new c.noUiSlider.Spectrum(b,a.snap,a.dir,a.singleStep)}function u(a,b){var d=b;b=c.isArray(d)?d:[d];if(!c.isArray(b)||!b.length||
2<b.length)throw Error("noUiSlider: 'start' option is incorrect.");a.handles=b.length;a.start=b}function a(a,b){a.snap=b;if("boolean"!==typeof b)throw Error("noUiSlider: 'snap' option must be a boolean.");}function b(a,b){a.animate=b;if("boolean"!==typeof b)throw Error("noUiSlider: 'animate' option must be a boolean.");}function d(a,b){if("lower"===b&&1===a.handles)a.connect=1;else if("upper"===b&&1===a.handles)a.connect=2;else if(!0===b&&2===a.handles)a.connect=3;else if(!1===b)a.connect=0;else throw Error("noUiSlider: 'connect' option doesn't match handle count.");
}function e(a,b){switch(b){case "horizontal":a.ort=0;break;case "vertical":a.ort=1;break;default:throw Error("noUiSlider: 'orientation' option is invalid.");}}function f(a,b){if(!l(b))throw Error("noUiSlider: 'margin' option must be numeric.");a.margin=a.spectrum.getMargin(b);if(!a.margin)throw Error("noUiSlider: 'margin' option is only supported on linear sliders.");}function z(a,b){if(!l(b))throw Error("noUiSlider: 'limit' option must be numeric.");a.limit=a.spectrum.getMargin(b);if(!a.limit)throw Error("noUiSlider: 'limit' option is only supported on linear sliders.");
}function p(a,b){switch(b){case "ltr":a.dir=0;break;case "rtl":a.dir=1;a.connect=[0,2,1,3][a.connect];break;default:throw Error("noUiSlider: 'direction' option was not recognized.");}}function r(a,b){if("string"!==typeof b)throw Error("noUiSlider: 'behaviour' must be a string containing options.");var c=0<=b.indexOf("tap"),d=0<=b.indexOf("drag"),h=0<=b.indexOf("fixed"),e=0<=b.indexOf("snap");a.events={tap:c||e,drag:d,fixed:h,snap:e}}function n(a,b){a.format=b;if("function"===typeof b.to&&"function"===
typeof b.from)return!0;throw Error("noUiSlider: 'format' requires 'to' and 'from' methods.");}var h={to:function(a){return a.toFixed(2)},from:Number};c.noUiSlider.testOptions=function(w){var k={margin:0,limit:0,animate:!0,format:h},A;A={step:{r:!1,t:q},start:{r:!0,t:u},connect:{r:!0,t:d},direction:{r:!0,t:p},snap:{r:!1,t:a},animate:{r:!1,t:b},range:{r:!0,t:m},orientation:{r:!1,t:e},margin:{r:!1,t:f},limit:{r:!1,t:z},behaviour:{r:!0,t:r},format:{r:!1,t:n}};w=c.extend({connect:!1,direction:"ltr",behaviour:"tap",
orientation:"horizontal"},w);c.each(A,function(a,b){if(void 0===w[a]){if(b.r)throw Error("noUiSlider: '"+a+"' is required.");return!0}b.t(k,w[a])});k.style=k.ort?"top":"left";return k}})(window.jQuery||window.Zepto);(function(c){function l(a){return Math.max(Math.min(a,100),0)}function q(a,b,c){a.addClass(b);setTimeout(function(){a.removeClass(b)},c)}function m(a,b){var d=c("<div><div/></div>").addClass(h[2]),e=["-lower","-upper"];a&&e.reverse();d.children().addClass(h[3]+" "+h[3]+e[b]);return d}function u(a,b,c){switch(a){case 1:b.addClass(h[7]);c[0].addClass(h[6]);break;case 3:c[1].addClass(h[6]);case 2:c[0].addClass(h[7]);case 0:b.addClass(h[6])}}function a(a,b,c){var d,e=[];for(d=0;d<a;d+=1)e.push(m(b,d).appendTo(c));
return e}function b(a,b,d){d.addClass([h[0],h[8+a],h[4+b]].join(" "));return c("<div/>").appendTo(d).addClass(h[1])}function d(d,k,e){function f(){return B[["width","height"][k.ort]]()}function m(a){var b,c=[v.val()];for(b=0;b<a.length;b+=1)v.trigger(a[b],c)}function g(a){return 1===a.length?a[0]:k.dir?a.reverse():a}function r(a){return function(b,c){v.val([a?null:c,a?c:null],!0)}}function s(a){var b=c.inArray(a,C);v[0].linkAPI&&v[0].linkAPI[a]&&v[0].linkAPI[a].change(F[b],t[b].children(),v)}function z(a,
b,c){var d=a[0]!==t[0][0]?1:0,e=y[0]+k.margin,f=y[1]-k.margin,g=y[0]+k.limit,n=y[1]-k.limit;1<t.length&&(b=d?Math.max(b,e):Math.min(b,f));!1!==c&&k.limit&&1<t.length&&(b=d?Math.min(b,g):Math.max(b,n));b=E.getStep(b);b=l(parseFloat(b.toFixed(7)));if(b===y[d])return!1;a.css(k.style,b+"%");a.is(":first-child")&&a.toggleClass(h[17],50<b);y[d]=b;F[d]=E.fromStepping(b);s(C[d]);return!0}function x(a,b,c,d){a=a.replace(/\s/g,".nui ")+".nui";return b.on(a,function(a){if(v.attr("disabled")||v.hasClass(h[14]))return!1;
a.preventDefault();var b=0===a.type.indexOf("touch"),e=0===a.type.indexOf("mouse"),f=0===a.type.indexOf("pointer"),g,J,I=a;0===a.type.indexOf("MSPointer")&&(f=!0);a.originalEvent&&(a=a.originalEvent);b&&(g=a.changedTouches[0].pageX,J=a.changedTouches[0].pageY);if(e||f)f||void 0!==window.pageXOffset||(window.pageXOffset=document.documentElement.scrollLeft,window.pageYOffset=document.documentElement.scrollTop),g=a.clientX+window.pageXOffset,J=a.clientY+window.pageYOffset;I.points=[g,J];I.cursor=e;a=
I;a.calcPoint=a.points[k.ort];c(a,d)})}function G(a,b){var c=b.handles||t,d,e=!1,e=100*(a.calcPoint-b.start)/f(),k=c[0][0]!==t[0][0]?1:0;var h=b.positions;d=e+h[0];e+=h[1];1<c.length?(0>d&&(e+=Math.abs(d)),100<e&&(d-=e-100),d=[l(d),l(e)]):d=[d,e];e=z(c[0],d[k],1===c.length);1<c.length&&(e=z(c[1],d[k?0:1],!1)||e);e&&m(["slide"])}function L(a){c("."+h[15]).removeClass(h[15]);a.cursor&&c("body").css("cursor","").off(".nui");p.off(".nui");v.removeClass(h[12]);m(["set","change"])}function K(a,b){1===b.handles.length&&
b.handles[0].children().addClass(h[15]);a.stopPropagation();x(n.move,p,G,{start:a.calcPoint,handles:b.handles,positions:[y[0],y[t.length-1]]});x(n.end,p,L,null);a.cursor&&(c("body").css("cursor",c(a.target).css("cursor")),1<t.length&&v.addClass(h[12]),c("body").on("selectstart.nui",!1))}function M(a){var b=a.calcPoint,d=0;a.stopPropagation();c.each(t,function(){d+=this.offset()[k.style]});d=b<d/2||1===t.length?0:1;b-=B.offset()[k.style];b=100*b/f();k.events.snap||q(v,h[14],300);z(t[d],b);m(["slide",
"set","change"]);k.events.snap&&K(a,{handles:[t[d]]})}var v=c(d),y=[-1,-1],B,t,E=k.spectrum,F=[],C=["lower","upper"].slice(0,k.handles);k.dir&&C.reverse();d.LinkUpdate=s;d.LinkConfirm=function(a,b){var d=c.inArray(a,C);b&&b.appendTo(t[d].children());k.dir&&(d=1===d?0:1);return r(d)};d.LinkDefaultFormatter=k.format;d.LinkDefaultFlag="lower";d.reappend=function(){var a,b;for(a=0;a<C.length;a+=1)this.linkAPI&&this.linkAPI[b=C[a]]&&this.linkAPI[b].reconfirm(b)};if(v.hasClass(h[0]))throw Error("Slider was already initialized.");
B=b(k.dir,k.ort,v);t=a(k.handles,k.dir,B);u(k.connect,v,t);(function(a){var b;if(!a.fixed)for(b=0;b<t.length;b+=1)x(n.start,t[b].children(),K,{handles:[t[b]]});a.tap&&x(n.start,B,M,{handles:t});a.drag&&(b=B.find("."+h[7]).addClass(h[10]),a.fixed&&(b=b.add(B.children().not(b).children())),x(n.start,b,K,{handles:t}))})(k.events);d.vSet=function(a){if(v[0].LinkIsEmitting)return this;var b;a=c.isArray(a)?a:[a];k.dir&&1<k.handles&&a.reverse();k.animate&&-1!==y[0]&&q(v,h[14],300);b=1<t.length?3:1;1===a.length&&
(b=1);var d,e,f;k.limit&&(b+=1);for(d=0;d<b;d+=1)e=d%2,f=a[e],null!==f&&!1!==f&&("number"===typeof f&&(f=String(f)),f=k.format.from(f),(!1===f||isNaN(f)||!1===z(t[e],E.toStepping(f),d===3-k.dir))&&s(C[e]));m(["set"]);return this};d.vGet=function(){var a,b=[];for(a=0;a<k.handles;a+=1)b[a]=k.format.to(F[a]);return g(b)};d.destroy=function(){c(this).off(".nui").removeClass(h.join(" ")).empty();delete this.LinkUpdate;delete this.LinkConfirm;delete this.LinkDefaultFormatter;delete this.LinkDefaultFlag;
delete this.reappend;delete this.vGet;delete this.vSet;delete this.getCurrentStep;delete this.getInfo;delete this.destroy;return e};d.getCurrentStep=function(){var a=c.map(y,function(a,b){var c=E.getApplicableStep(a);return[[F[b]-c[2]>=c[1]?c[2]:c[0],c[2]]]});return g(a)};d.getInfo=function(){return[E,k.style,k.ort]};v.val(k.start)}function e(a){if(!this.length)throw Error("noUiSlider: Can't initialize slider on empty selection.");var b=c.noUiSlider.testOptions(a,this);return this.each(function(){d(this,
b,a)})}function f(a){return this.each(function(){if(this.destroy){var b=c(this).val(),d=this.destroy(),e=c.extend({},d,a);c(this).noUiSlider(e);this.reappend();d.start===e.start&&c(this).val(b)}else c(this).noUiSlider(a)})}function z(){return this[0][arguments.length?"vSet":"vGet"].apply(this[0],arguments)}var p=c(document),r=c.fn.val,n=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",
end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},h="noUi-target noUi-base noUi-origin noUi-handle noUi-horizontal noUi-vertical noUi-background noUi-connect noUi-ltr noUi-rtl noUi-dragable  noUi-state-drag  noUi-state-tap noUi-active  noUi-stacking".split(" ");c.fn.val=function(){var a=arguments,b=c(this[0]);return arguments.length?this.each(function(){(c(this).hasClass(h[0])?z:r).apply(c(this),a)}):(b.hasClass(h[0])?z:r).call(b)};c.fn.noUiSlider=
function(a,b){return(b?f:e).call(this,a)}})(window.jQuery||window.Zepto);(function(c){function l(a){return c.grep(a,function(b,d){return d===c.inArray(b,a)})}function q(a,b,d,e){if("range"===b||"steps"===b)return a.xVal;if("count"===b){b=100/(d-1);var f,l=0;for(d=[];100>=(f=l++*b);)d.push(f);b="positions"}if("positions"===b)return c.map(d,function(b){return a.fromStepping(e?a.getStep(b):b)});if("values"===b)return e?c.map(d,function(b){return a.fromStepping(a.getStep(a.toStepping(b)))}):d}function m(a,b,d,e){var f=a.direction,m={},p=a.xVal[0],r=a.xVal[a.xVal.length-1],
n=!1,h=!1,w=0;a.direction=0;e=l(e.slice().sort(function(a,b){return a-b}));e[0]!==p&&(e.unshift(p),n=!0);e[e.length-1]!==r&&(e.push(r),h=!0);c.each(e,function(f){var l,p,r,g=e[f],q=e[f+1],s,u,x,G;"steps"===d&&(l=a.xNumSteps[f]);l||(l=q-g);if(!1!==g&&void 0!==q)for(p=g;p<=q;p+=l){s=a.toStepping(p);r=s-w;x=r/b;x=Math.round(x);G=r/x;for(r=1;r<=x;r+=1)u=w+r*G,m[u.toFixed(5)]=["x",0];x=-1<c.inArray(p,e)?1:"steps"===d?2:0;f||!n||g||(x=0);p===q&&h||(m[s.toFixed(5)]=[p,x]);w=s}});a.direction=f;return m}function u(a,
b,d,e,f){function l(b,c,d){c='class="'+c+" "+c+"-"+p+" "+c;var e=d[1];d=["-normal","-large","-sub"][e&&f?f(d[0],e):e];return c+d+'" style="'+a+": "+b+'%"'}var p=["horizontal","vertical"][b],m=c("<div/>");m.addClass("noUi-pips noUi-pips-"+p);c.each(e,function(a,b){d&&(a=100-a);m.append("<div "+l(a,"noUi-marker",b)+"></div>");b[1]&&m.append("<div "+l(a,"noUi-value",b)+">"+Math.round(b[0])+"</div>")});return m}c.fn.noUiSlider_pips=function(a){var b=a.mode,d=a.density||1,e=a.filter||!1,f=a.values||!1,
l=a.stepped||!1;return this.each(function(){var a=this.getInfo(),r=q(a[0],b,f,l),r=m(a[0],d,b,r);return c(this).append(u(a[1],a[2],a[0].direction,r,e))})}})(window.jQuery||window.Zepto);

/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.13
 */
;(function(k){'use strict';k(['jquery'],function($){var j=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};j.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:!0};j.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(f,g,h){if(typeof g=='object'){h=g;g=0}if(typeof h=='function')h={onAfter:h};if(f=='max')f=9e9;h=$.extend({},j.defaults,h);g=g||h.duration;h.queue=h.queue&&h.axis.length>1;if(h.queue)g/=2;h.offset=both(h.offset);h.over=both(h.over);return this._scrollable().each(function(){if(f==null)return;var d=this,$elem=$(d),targ=f,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}var e=$.isFunction(h.offset)&&h.offset(d,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=j.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=e[pos]||0;if(h.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*h.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&h.queue){if(old!=attr[key])animate(h.onAfterFirst);delete attr[key]}});animate(h.onAfter);function animate(a){$elem.animate(attr,g,h.easing,a&&function(){a.call(this,targ,h)})}}).end()};j.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||typeof a=='object'?a:{top:a,left:a}}return j})}(typeof define==='function'&&define.amd?define:function(a,b){if(typeof module!=='undefined'&&module.exports){module.exports=b(require('jquery'))}else{b(jQuery)}}));

// Spectrum Colorpicker v1.6.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT
// Spectrum Colorpicker v1.6.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT
!function(t){"use strict";"function"===typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports&&"object"==typeof module?module.exports=t:t(jQuery)}(function(t,e){"use strict";var r={beforeShow:p,move:p,change:p,show:p,hide:p,color:!1,flat:!1,showInput:!1,allowEmpty:!1,showButtons:!0,clickoutFiresChange:!1,showInitial:!1,showPalette:!1,showPaletteOnly:!1,hideAfterPaletteSelect:!1,togglePaletteOnly:!1,showSelectionPalette:!0,localStorageKey:!1,appendTo:"body",maxSelectionSize:7,cancelText:"cancel",chooseText:"choose",togglePaletteMoreText:"more",togglePaletteLessText:"less",clearText:"Clear Color Selection",noColorSelectedText:"No Color Selected",preferredFormat:!1,className:"",containerClassName:"",replacerClassName:"",showAlpha:!1,theme:"sp-light",palette:[["#ffffff","#000000","#ff0000","#ff8000","#ffff00","#008000","#0000ff","#4b0082","#9400d3"]],selectionPalette:[],disabled:!1,offset:null},a=[],n=!!/msie/i.exec(window.navigator.userAgent),i=function(){function t(t,e){return!!~(""+t).indexOf(e)}var e=document.createElement("div");var r=e.style;return r.cssText="background-color:rgba(0,0,0,.5)",t(r.backgroundColor,"rgba")||t(r.backgroundColor,"hsla")}(),s=function(){var e=t("<input type='color' value='!' />")[0];return"color"===e.type&&"!"!==e.value}(),o=["<div class='sp-replacer'>","<div class='sp-preview'><div class='sp-preview-inner'></div></div>","<div class='sp-dd'>&#9660;</div>","</div>"].join(""),l=function(){var t="";if(n)for(var e=1;e<=6;e++)t+="<div class='sp-"+e+"'></div>";return["<div class='sp-container sp-hidden'>","<div class='sp-palette-container'>","<div class='sp-palette sp-thumb sp-cf'></div>","<div class='sp-palette-button-container sp-cf'>","<button type='button' class='sp-palette-toggle'></button>","</div>","</div>","<div class='sp-picker-container'>","<div class='sp-top sp-cf'>","<div class='sp-fill'></div>","<div class='sp-top-inner'>","<div class='sp-color'>","<div class='sp-sat'>","<div class='sp-val'>","<div class='sp-dragger'></div>","</div>","</div>","</div>","<div class='sp-clear sp-clear-display'>","</div>","<div class='sp-hue'>","<div class='sp-slider'></div>",t,"</div>","</div>","<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>","</div>","<div class='sp-input-container sp-cf'>","<input class='sp-input' type='text' spellcheck='false'  />","</div>","<div class='sp-initial sp-thumb sp-cf'></div>","<div class='sp-button-container sp-cf'>","<a class='sp-cancel' href='#'></a>","<button type='button' class='sp-choose'></button>","</div>","</div>","</div>"].join("")}();function c(e,r,a,n){var s=[];for(var o=0;o<e.length;o++){var l=e[o];if(l){var c=tinycolor(l);var f=c.toHsl().l<.5?"sp-thumb-el sp-thumb-dark":"sp-thumb-el sp-thumb-light";f+=tinycolor.equals(r,l)?" sp-thumb-active":"";var u=c.toString(n.preferredFormat||"rgb");var h=i?"background-color:"+c.toRgbString():"filter:"+c.toFilter();s.push('<span title="'+u+'" data-color="'+c.toRgbString()+'" class="'+f+'"><span class="sp-thumb-inner" style="'+h+';" /></span>')}else{var d="sp-clear-display";s.push(t("<div />").append(t('<span data-color="" style="background-color:transparent;" class="'+d+'"></span>').attr("title",n.noColorSelectedText)).html())}}return"<div class='sp-cf "+a+"'>"+s.join("")+"</div>"}function f(){for(var t=0;t<a.length;t++)a[t]&&a[t].hide()}function u(e,a){var n=t.extend({},r,e);return n.callbacks={move:v(n.move,a),change:v(n.change,a),show:v(n.show,a),hide:v(n.hide,a),beforeShow:v(n.beforeShow,a)},n}function h(r,h){var p=u(h,r),v=p.flat,y=p.showSelectionPalette,w=p.localStorageKey,_=p.theme,x=p.callbacks,k=m($e,10),S=!1,C=0,P=0,A=0,M=0,H=0,R=0,F=0,T=0,O=0,N=0,j=0,q=1,D=[],E=[],I={},z=p.selectionPalette.slice(0),B=p.maxSelectionSize,L="sp-dragging",K=null;var V=r.ownerDocument,$=V.body,W=t(r),X=!1,Y=t(l,V).addClass(_),G=Y.find(".sp-picker-container"),Q=Y.find(".sp-color"),J=Y.find(".sp-dragger"),U=Y.find(".sp-hue"),Z=Y.find(".sp-slider"),te=Y.find(".sp-alpha-inner"),ee=Y.find(".sp-alpha"),re=Y.find(".sp-alpha-handle"),ae=Y.find(".sp-input"),ne=Y.find(".sp-palette"),ie=Y.find(".sp-initial"),se=Y.find(".sp-cancel"),oe=Y.find(".sp-clear"),le=Y.find(".sp-choose"),ce=Y.find(".sp-palette-toggle"),fe=W.is("input"),ue=fe&&s&&"color"===W.attr("type"),he=fe&&!v,de=he?t(o).addClass(_).addClass(p.className).addClass(p.replacerClassName):t([]),pe=he?de:W,ge=de.find(".sp-preview-inner"),ve=p.color||fe&&W.val(),be=!1,me=p.preferredFormat,ye=me,we=!p.showButtons||p.clickoutFiresChange,_e=!ve,xe=p.allowEmpty&&!ue;function ke(){if(p.showPaletteOnly&&(p.showPalette=!0),ce.text(p.showPaletteOnly?p.togglePaletteMoreText:p.togglePaletteLessText),p.palette){D=p.palette.slice(0),E=t.isArray(D[0])?D:[D],I={};for(var e=0;e<E.length;e++)for(var r=0;r<E[e].length;r++){var a=tinycolor(E[e][r]).toRgbString();I[a]=!0}}Y.toggleClass("sp-flat",v),Y.toggleClass("sp-input-disabled",!p.showInput),Y.toggleClass("sp-alpha-enabled",p.showAlpha),Y.toggleClass("sp-clear-enabled",xe),Y.toggleClass("sp-buttons-disabled",!p.showButtons),Y.toggleClass("sp-palette-buttons-disabled",!p.togglePaletteOnly),Y.toggleClass("sp-palette-disabled",!p.showPalette),Y.toggleClass("sp-palette-only",p.showPaletteOnly),Y.toggleClass("sp-initial-disabled",!p.showInitial),Y.addClass(p.className).addClass(p.containerClassName),$e()}function Se(){if(n&&Y.find("*:not(input)").attr("unselectable","on"),ke(),he&&W.after(de).hide(),xe||oe.hide(),v)W.after(Y).hide();else{var e="parent"===p.appendTo?W.parent():t(p.appendTo);1!==e.length&&(e=t("body")),e.append(Y)}Ce(),pe.bind("click.spectrum touchstart.spectrum",function(e){X||Oe(),we&&Ve(!0),e.stopPropagation(),t(e.target).is("input")||e.preventDefault()}),(W.is(":disabled")||p.disabled===!0)&&Ge(),Y.click(g),ae.change(Te),ae.bind("paste",function(){setTimeout(Te,1)}),ae.keydown(function(t){13==t.keyCode&&Te()}),se.text(p.cancelText),se.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),De(),qe()}),oe.attr("title",p.clearText),oe.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),_e=!0,Be(),v&&Ve(!0)}),le.text(p.chooseText),le.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),n&&ae.is(":focus")&&ae.trigger("change"),ze()&&(Ve(!0),qe())}),ce.text(p.showPaletteOnly?p.togglePaletteMoreText:p.togglePaletteLessText),ce.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),p.showPaletteOnly=!p.showPaletteOnly,p.showPaletteOnly||v||Y.css("left","-="+(G.outerWidth(!0)+5)),ke()}),b(ee,function(t,e,r){q=t/R,_e=!1,r.shiftKey&&(q=Math.round(10*q)/10),Be()},Re,Fe),b(U,function(t,e){O=parseFloat(e/M),_e=!1,p.showAlpha||(q=1),Be()},Re,Fe),b(Q,function(t,e,r){if(r.shiftKey){if(!K){var a=N*C;var n=P-j*P;var i=Math.abs(t-a)>Math.abs(e-n);K=i?"x":"y"}}else K=null;var s=!K||"x"===K;var o=!K||"y"===K;s&&(N=parseFloat(t/C)),o&&(j=parseFloat((P-e)/P)),_e=!1,p.showAlpha||(q=1),Be()},Re,Fe),ve?(Ee(ve),Le(),ye=me||tinycolor(ve).format,Pe(ve)):Le(),v&&Ne();function r(e){return e.data&&e.data.ignore?(Ee(t(e.target).closest(".sp-thumb-el").data("color")),Be()):(Ee(t(e.target).closest(".sp-thumb-el").data("color")),Be(),Ve(!0),p.hideAfterPaletteSelect&&qe()),!1}var a=n?"mousedown.spectrum":"click.spectrum touchstart.spectrum";ne.delegate(".sp-thumb-el",a,r),ie.delegate(".sp-thumb-el:nth-child(1)",a,{ignore:!0},r)}function Ce(){if(w&&window.localStorage){try{var e=window.localStorage[w].split(",#");e.length>1&&(delete window.localStorage[w],t.each(e,function(t,e){Pe(e)}))}catch(r){}try{z=window.localStorage[w].split(";")}catch(r){}}}function Pe(e){if(y){var r=tinycolor(e).toRgbString();if(!I[r]&&-1===t.inArray(r,z))for(z.push(r);z.length>B;)z.shift();if(w&&window.localStorage)try{window.localStorage[w]=z.join(";")}catch(a){}}}function Ae(){var t=[];if(p.showPalette)for(var e=0;e<z.length;e++){var r=tinycolor(z[e]).toRgbString();I[r]||t.push(z[e])}return t.reverse().slice(0,p.maxSelectionSize)}function Me(){var e=Ie();var r=t.map(E,function(t,r){return c(t,e,"sp-palette-row sp-palette-row-"+r,p)});Ce(),z&&r.push(c(Ae(),e,"sp-palette-row sp-palette-row-selection",p)),ne.html(r.join(""))}function He(){if(p.showInitial){var t=be;var e=Ie();ie.html(c([t,e],e,"sp-palette-row-initial",p))}}function Re(){(P<=0||C<=0||M<=0)&&$e(),Y.addClass(L),K=null,W.trigger("dragstart.spectrum",[Ie()])}function Fe(){Y.removeClass(L),W.trigger("dragstop.spectrum",[Ie()])}function Te(){var t=ae.val();if(null!==t&&""!==t||!xe){var e=tinycolor(t);e.isValid()?(Ee(e),Ve(!0)):ae.addClass("sp-validation-error")}else Ee(null),Ve(!0)}function Oe(){S?qe():Ne()}function Ne(){var e=t.Event("beforeShow.spectrum");return S?void $e():(W.trigger(e,[Ie()]),void(x.beforeShow(Ie())===!1||e.isDefaultPrevented()||(f(),S=!0,t(V).bind("click.spectrum",je),t(window).bind("resize.spectrum",k),de.addClass("sp-active"),Y.removeClass("sp-hidden"),$e(),Le(),be=Ie(),He(),x.show(be),W.trigger("show.spectrum",[be]))))}function je(t){2!=t.button&&(we?Ve(!0):De(),qe())}function qe(){S&&!v&&(S=!1,t(V).unbind("click.spectrum",je),t(window).unbind("resize.spectrum",k),de.removeClass("sp-active"),Y.addClass("sp-hidden"),x.hide(Ie()),W.trigger("hide.spectrum",[Ie()]))}function De(){Ee(be,!0)}function Ee(t,e){if(tinycolor.equals(t,Ie()))return void Le();var r,a;!t&&xe?_e=!0:(_e=!1,r=tinycolor(t),a=r.toHsv(),O=a.h%360/360,N=a.s,j=a.v,q=a.a),Le(),r&&r.isValid()&&!e&&(ye=me||r.getFormat())}function Ie(t){return t=t||{},xe&&_e?null:tinycolor.fromRatio({h:O,s:N,v:j,a:Math.round(100*q)/100},{format:t.format||ye})}function ze(){return!ae.hasClass("sp-validation-error")}function Be(){Le(),x.move(Ie()),W.trigger("move.spectrum",[Ie()])}function Le(){ae.removeClass("sp-validation-error"),Ke();var t=tinycolor.fromRatio({h:O,s:1,v:1});Q.css("background-color",t.toHexString());var e=ye;q<1&&(0!==q||"name"!==e)&&("hex"===e||"hex3"===e||"hex6"===e||"name"===e)&&(e="rgb");var r=Ie({format:e}),a="";if(ge.removeClass("sp-clear-display"),ge.css("background-color","transparent"),!r&&xe)ge.addClass("sp-clear-display");else{var s=r.toHexString(),o=r.toRgbString();if(i||1===r.alpha?ge.css("background-color",o):(ge.css("background-color","transparent"),ge.css("filter",r.toFilter())),p.showAlpha){var l=r.toRgb();l.a=0;var c=tinycolor(l).toRgbString();var f="linear-gradient(left, "+c+", "+s+")";n?te.css("filter",tinycolor(c).toFilter({gradientType:1},s)):(te.css("background","-webkit-"+f),te.css("background","-moz-"+f),te.css("background","-ms-"+f),te.css("background","linear-gradient(to right, "+c+", "+s+")"))}a=r.toString(e)}p.showInput&&ae.val(a),p.showPalette&&Me(),He()}function Ke(){var t=N;var e=j;if(xe&&_e)re.hide(),Z.hide(),J.hide();else{re.show(),Z.show(),J.show();var r=t*C;var a=P-e*P;r=Math.max(-A,Math.min(C-A,r-A)),a=Math.max(-A,Math.min(P-A,a-A)),J.css({top:a+"px",left:r+"px"});var n=q*R;re.css({left:n-F/2+"px"});var i=O*M;Z.css({top:i-T+"px"})}}function Ve(t){var e=Ie(),r="",a=!tinycolor.equals(e,be);e&&(r=e.toString(ye),Pe(e)),fe&&W.val(r),t&&a&&(x.change(e),W.trigger("change",[e]))}function $e(){C=Q.width(),P=Q.height(),A=J.height(),H=U.width(),M=U.height(),T=Z.height(),R=ee.width(),F=re.width(),v||(Y.css("position","absolute"),Y.offset(p.offset?p.offset:d(Y,pe))),Ke(),p.showPalette&&Me(),W.trigger("reflow.spectrum")}function We(){W.show(),pe.unbind("click.spectrum touchstart.spectrum"),Y.remove(),de.remove(),a[Je.id]=null}function Xe(r,a){return r===e?t.extend({},p):a===e?p[r]:(p[r]=a,void ke())}function Ye(){X=!1,W.attr("disabled",!1),pe.removeClass("sp-disabled")}function Ge(){qe(),X=!0,W.attr("disabled",!0),pe.addClass("sp-disabled")}function Qe(t){p.offset=t,$e()}Se();var Je={show:Ne,hide:qe,toggle:Oe,reflow:$e,option:Xe,enable:Ye,disable:Ge,offset:Qe,set:function(t){Ee(t),Ve()},get:Ie,destroy:We,container:Y};return Je.id=a.push(Je)-1,Je}function d(e,r){var a=0;var n=e.outerWidth();var i=e.outerHeight();var s=r.outerHeight();var o=e[0].ownerDocument;var l=o.documentElement;var c=l.clientWidth+t(o).scrollLeft();var f=l.clientHeight+t(o).scrollTop();var u=r.offset();return u.top+=s,u.left-=Math.min(u.left,u.left+n>c&&c>n?Math.abs(u.left+n-c):0),u.top-=Math.min(u.top,u.top+i>f&&f>i?Math.abs(i+s-a):a),u}function p(){}function g(t){t.stopPropagation()}function v(t,e){var r=Array.prototype.slice;var a=r.call(arguments,2);return function(){return t.apply(e,a.concat(r.call(arguments)))}}function b(e,r,a,i){r=r||function(){},a=a||function(){},i=i||function(){};var s=document;var o=!1;var l={};var c=0;var f=0;var u="ontouchstart"in window;var h={};h.selectstart=d,h.dragstart=d,h["touchmove mousemove"]=p,h["touchend mouseup"]=v;function d(t){t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.returnValue=!1}function p(t){if(o){if(n&&s.documentMode<9&&!t.button)return v();var a=t.originalEvent&&t.originalEvent.touches;var i=a?a[0].pageX:t.pageX;var h=a?a[0].pageY:t.pageY;var p=Math.max(0,Math.min(i-l.left,f));var g=Math.max(0,Math.min(h-l.top,c));u&&d(t),r.apply(e,[p,g,t])}}function g(r){var n=r.which?3==r.which:2==r.button;n||o||a.apply(e,arguments)!==!1&&(o=!0,c=t(e).height(),f=t(e).width(),l=t(e).offset(),t(s).bind(h),t(s.body).addClass("sp-dragging"),u||p(r),d(r))}function v(){o&&(t(s).unbind(h),t(s.body).removeClass("sp-dragging"),i.apply(e,arguments)),o=!1}t(e).bind("touchstart mousedown",g)}function m(t,e,r){var a;return function(){var n=this,i=arguments;var s=function(){a=null,t.apply(n,i)};r&&clearTimeout(a),(r||!a)&&(a=setTimeout(s,e))}}var y="spectrum.id";t.fn.spectrum=function(e,r){if("string"==typeof e){var n=this;var i=Array.prototype.slice.call(arguments,1);return this.each(function(){var r=a[t(this).data(y)];if(r){var s=r[e];if(!s)throw new Error("Spectrum: no such method: '"+e+"'");"get"==e?n=r.get():"container"==e?n=r.container:"option"==e?n=r.option.apply(r,i):"destroy"==e?(r.destroy(),t(this).removeData(y)):s.apply(r,i)}}),n}return this.spectrum("destroy").each(function(){var r=t.extend({},e,t(this).data());var a=h(this,r);t(this).data(y,a.id)})},t.fn.spectrum.load=!0,t.fn.spectrum.loadOpts={},t.fn.spectrum.draggable=b,t.fn.spectrum.defaults=r,t.spectrum={},t.spectrum.localization={},t.spectrum.palettes={},t.fn.spectrum.processNativeColorInputs=function(){s||t("input[type=color]").spectrum({preferredFormat:"hex6"})},function(){var t=/^[\s,#]+/,e=/\s+$/,r=0,a=Math,n=a.round,i=a.min,s=a.max,o=a.random;var l=function $(t,e){if(t=t?t:"",e=e||{},t instanceof $)return t;if(!(this instanceof $))return new $(t,e);var a=c(t);this._originalInput=t,this._r=a.r,this._g=a.g,this._b=a.b,this._a=a.a,this._roundA=n(100*this._a)/100,this._format=e.format||a.format,this._gradientType=e.gradientType,this._r<1&&(this._r=n(this._r)),this._g<1&&(this._g=n(this._g)),this._b<1&&(this._b=n(this._b)),this._ok=a.ok,this._tc_id=r++};l.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},setAlpha:function(t){return this._a=O(t),this._roundA=n(100*this._a)/100,this},toHsv:function(){var t=d(this._r,this._g,this._b);return{h:360*t.h,s:t.s,v:t.v,a:this._a}},toHsvString:function(){var t=d(this._r,this._g,this._b);var e=n(360*t.h),r=n(100*t.s),a=n(100*t.v);return 1==this._a?"hsv("+e+", "+r+"%, "+a+"%)":"hsva("+e+", "+r+"%, "+a+"%, "+this._roundA+")"},toHsl:function(){var t=u(this._r,this._g,this._b);return{h:360*t.h,s:t.s,l:t.l,a:this._a}},toHslString:function(){var t=u(this._r,this._g,this._b);var e=n(360*t.h),r=n(100*t.s),a=n(100*t.l);return 1==this._a?"hsl("+e+", "+r+"%, "+a+"%)":"hsla("+e+", "+r+"%, "+a+"%, "+this._roundA+")"},toHex:function(t){return g(this._r,this._g,this._b,t)},toHexString:function(t){return"#"+this.toHex(t)},toHex8:function(){return v(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:n(this._r),g:n(this._g),b:n(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+n(this._r)+", "+n(this._g)+", "+n(this._b)+")":"rgba("+n(this._r)+", "+n(this._g)+", "+n(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:n(100*N(this._r,255))+"%",g:n(100*N(this._g,255))+"%",b:n(100*N(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+n(100*N(this._r,255))+"%, "+n(100*N(this._g,255))+"%, "+n(100*N(this._b,255))+"%)":"rgba("+n(100*N(this._r,255))+"%, "+n(100*N(this._g,255))+"%, "+n(100*N(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":this._a<1?!1:F[g(this._r,this._g,this._b,!0)]||!1},toFilter:function(t){var e="#"+v(this._r,this._g,this._b,this._a);var r=e;var a=this._gradientType?"GradientType = 1, ":"";if(t){var n=l(t);r=n.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+a+"startColorstr="+e+",endColorstr="+r+")"},toString:function(t){var e=!!t;t=t||this._format;var r=!1;var a=this._a<1&&this._a>=0;var n=!e&&a&&("hex"===t||"hex6"===t||"hex3"===t||"name"===t);return n?"name"===t&&0===this._a?this.toName():this.toRgbString():("rgb"===t&&(r=this.toRgbString()),"prgb"===t&&(r=this.toPercentageRgbString()),("hex"===t||"hex6"===t)&&(r=this.toHexString()),"hex3"===t&&(r=this.toHexString(!0)),"hex8"===t&&(r=this.toHex8String()),"name"===t&&(r=this.toName()),"hsl"===t&&(r=this.toHslString()),"hsv"===t&&(r=this.toHsvString()),r||this.toHexString())},_applyModification:function(t,e){var r=t.apply(null,[this].concat([].slice.call(e)));return this._r=r._r,this._g=r._g,this._b=r._b,this.setAlpha(r._a),this},lighten:function(){return this._applyModification(w,arguments)},brighten:function(){return this._applyModification(_,arguments)},darken:function(){return this._applyModification(x,arguments)},desaturate:function(){return this._applyModification(b,arguments)},saturate:function(){return this._applyModification(m,arguments)},greyscale:function(){return this._applyModification(y,arguments)},spin:function(){return this._applyModification(k,arguments)},_applyCombination:function(t,e){return t.apply(null,[this].concat([].slice.call(e)))},analogous:function(){return this._applyCombination(M,arguments)},complement:function(){return this._applyCombination(S,arguments)},monochromatic:function(){return this._applyCombination(H,arguments)},splitcomplement:function(){return this._applyCombination(A,arguments)},triad:function(){return this._applyCombination(C,arguments)},tetrad:function(){return this._applyCombination(P,arguments)}},l.fromRatio=function(t,e){if("object"==typeof t){var r={};for(var a in t)t.hasOwnProperty(a)&&(r[a]="a"===a?t[a]:z(t[a]));t=r}return l(t,e)};function c(t){var e={r:0,g:0,b:0};var r=1;var a=!1;var n=!1;return"string"==typeof t&&(t=V(t)),"object"==typeof t&&(t.hasOwnProperty("r")&&t.hasOwnProperty("g")&&t.hasOwnProperty("b")?(e=f(t.r,t.g,t.b),a=!0,n="%"===String(t.r).substr(-1)?"prgb":"rgb"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("v")?(t.s=z(t.s),t.v=z(t.v),e=p(t.h,t.s,t.v),a=!0,n="hsv"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("l")&&(t.s=z(t.s),t.l=z(t.l),e=h(t.h,t.s,t.l),a=!0,n="hsl"),t.hasOwnProperty("a")&&(r=t.a)),r=O(r),{ok:a,format:t.format||n,r:i(255,s(e.r,0)),g:i(255,s(e.g,0)),b:i(255,s(e.b,0)),a:r}}function f(t,e,r){return{r:255*N(t,255),g:255*N(e,255),b:255*N(r,255)}}function u(t,e,r){t=N(t,255),e=N(e,255),r=N(r,255);var a=s(t,e,r),n=i(t,e,r);var o,l,c=(a+n)/2;if(a==n)o=l=0;else{var f=a-n;switch(l=c>.5?f/(2-a-n):f/(a+n),a){case t:o=(e-r)/f+(e<r?6:0);break;case e:o=(r-t)/f+2;break;case r:o=(t-e)/f+4}o/=6}return{h:o,s:l,l:c}}function h(t,e,r){var a,n,i;t=N(t,360),e=N(e,100),r=N(r,100);function s(t,e,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?t+6*(e-t)*r:r<.5?e:r<2/3?t+(e-t)*(2/3-r)*6:t}if(0===e)a=n=i=r;else{var o=r<.5?r*(1+e):r+e-r*e;var l=2*r-o;a=s(l,o,t+1/3),n=s(l,o,t),i=s(l,o,t-1/3)}return{r:255*a,g:255*n,b:255*i}}function d(t,e,r){t=N(t,255),e=N(e,255),r=N(r,255);var a=s(t,e,r),n=i(t,e,r);var o,l,c=a;var f=a-n;if(l=0===a?0:f/a,a==n)o=0;else{switch(a){case t:o=(e-r)/f+(e<r?6:0);break;case e:o=(r-t)/f+2;break;case r:o=(t-e)/f+4}o/=6}return{h:o,s:l,v:c}}function p(t,e,r){t=6*N(t,360),e=N(e,100),r=N(r,100);var n=a.floor(t),i=t-n,s=r*(1-e),o=r*(1-i*e),l=r*(1-(1-i)*e),c=n%6,f=[r,o,s,s,l,r][c],u=[l,r,r,o,s,s][c],h=[s,s,l,r,r,o][c];return{r:255*f,g:255*u,b:255*h}}function g(t,e,r,a){var i=[I(n(t).toString(16)),I(n(e).toString(16)),I(n(r).toString(16))];return a&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join("")}function v(t,e,r,a){var i=[I(B(a)),I(n(t).toString(16)),I(n(e).toString(16)),I(n(r).toString(16))];return i.join("")}l.equals=function(t,e){return t&&e?l(t).toRgbString()==l(e).toRgbString():!1},l.random=function(){return l.fromRatio({r:o(),g:o(),b:o()})};function b(t,e){e=0===e?0:e||10;var r=l(t).toHsl();return r.s-=e/100,r.s=j(r.s),l(r)}function m(t,e){e=0===e?0:e||10;var r=l(t).toHsl();return r.s+=e/100,r.s=j(r.s),l(r)}function y(t){return l(t).desaturate(100)}function w(t,e){e=0===e?0:e||10;var r=l(t).toHsl();return r.l+=e/100,r.l=j(r.l),l(r)}function _(t,e){e=0===e?0:e||10;var r=l(t).toRgb();return r.r=s(0,i(255,r.r-n(255*-(e/100)))),r.g=s(0,i(255,r.g-n(255*-(e/100)))),r.b=s(0,i(255,r.b-n(255*-(e/100)))),l(r)}function x(t,e){e=0===e?0:e||10;var r=l(t).toHsl();return r.l-=e/100,r.l=j(r.l),l(r)}function k(t,e){var r=l(t).toHsl();var a=(n(r.h)+e)%360;return r.h=a<0?360+a:a,l(r)}function S(t){var e=l(t).toHsl();return e.h=(e.h+180)%360,l(e)}function C(t){var e=l(t).toHsl();var r=e.h;return[l(t),l({h:(r+120)%360,s:e.s,l:e.l}),l({h:(r+240)%360,s:e.s,l:e.l})]}function P(t){var e=l(t).toHsl();var r=e.h;return[l(t),l({h:(r+90)%360,s:e.s,l:e.l}),l({h:(r+180)%360,s:e.s,l:e.l}),l({h:(r+270)%360,s:e.s,l:e.l})]}function A(t){var e=l(t).toHsl();var r=e.h;return[l(t),l({h:(r+72)%360,s:e.s,l:e.l}),l({h:(r+216)%360,s:e.s,l:e.l})]}function M(t,e,r){e=e||6,r=r||30;var a=l(t).toHsl();var n=360/r;var i=[l(t)];for(a.h=(a.h-(n*e>>1)+720)%360;--e;)a.h=(a.h+n)%360,i.push(l(a));return i}function H(t,e){e=e||6;var r=l(t).toHsv();var a=r.h,n=r.s,i=r.v;var s=[];var o=1/e;for(;e--;)s.push(l({h:a,s:n,v:i})),i=(i+o)%1;return s}l.mix=function(t,e,r){r=0===r?0:r||50;var a=l(t).toRgb();var n=l(e).toRgb();var i=r/100;var s=2*i-1;var o=n.a-a.a;var c;c=s*o==-1?s:(s+o)/(1+s*o),c=(c+1)/2;var f=1-c;var u={r:n.r*c+a.r*f,g:n.g*c+a.g*f,b:n.b*c+a.b*f,a:n.a*i+a.a*(1-i)};return l(u)},l.readability=function(t,e){var r=l(t);var a=l(e);var n=r.toRgb();var i=a.toRgb();var s=r.getBrightness();var o=a.getBrightness();var c=Math.max(n.r,i.r)-Math.min(n.r,i.r)+Math.max(n.g,i.g)-Math.min(n.g,i.g)+Math.max(n.b,i.b)-Math.min(n.b,i.b);return{brightness:Math.abs(s-o),color:c}},l.isReadable=function(t,e){var r=l.readability(t,e);return r.brightness>125&&r.color>500},l.mostReadable=function(t,e){var r=null;var a=0;var n=!1;for(var i=0;i<e.length;i++){var s=l.readability(t,e[i]);var o=s.brightness>125&&s.color>500;var c=3*(s.brightness/125)+s.color/500;(o&&!n||o&&n&&c>a||!o&&!n&&c>a)&&(n=o,a=c,r=l(e[i]))}return r};var R=l.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};var F=l.hexNames=T(R);function T(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}function O(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function N(t,e){D(t)&&(t="100%");var r=E(t);return t=i(e,s(0,parseFloat(t))),r&&(t=parseInt(t*e,10)/100),a.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function j(t){return i(1,s(0,t))}function q(t){return parseInt(t,16)}function D(t){return"string"==typeof t&&-1!=t.indexOf(".")&&1===parseFloat(t)}function E(t){return"string"===typeof t&&-1!=t.indexOf("%")}function I(t){return 1==t.length?"0"+t:""+t}function z(t){return t<=1&&(t=100*t+"%"),t}function B(t){return Math.round(255*parseFloat(t)).toString(16)}function L(t){return q(t)/255}var K=function(){var t="[-\\+]?\\d+%?";var e="[-\\+]?\\d*\\.\\d+%?";var r="(?:"+e+")|(?:"+t+")";var a="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";var n="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";return{rgb:new RegExp("rgb"+a),rgba:new RegExp("rgba"+n),hsl:new RegExp("hsl"+a),hsla:new RegExp("hsla"+n),hsv:new RegExp("hsv"+a),hsva:new RegExp("hsva"+n),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();function V(r){r=r.replace(t,"").replace(e,"").toLowerCase();var a=!1;if(R[r])r=R[r],a=!0;else if("transparent"==r)return{r:0,g:0,b:0,a:0,format:"name"};var n;return(n=K.rgb.exec(r))?{r:n[1],g:n[2],b:n[3]}:(n=K.rgba.exec(r))?{r:n[1],g:n[2],b:n[3],a:n[4]}:(n=K.hsl.exec(r))?{h:n[1],s:n[2],l:n[3]}:(n=K.hsla.exec(r))?{h:n[1],s:n[2],l:n[3],a:n[4]}:(n=K.hsv.exec(r))?{h:n[1],s:n[2],v:n[3]}:(n=K.hsva.exec(r))?{h:n[1],s:n[2],v:n[3],a:n[4]}:(n=K.hex8.exec(r))?{a:L(n[1]),r:q(n[2]),g:q(n[3]),b:q(n[4]),format:a?"name":"hex8"}:(n=K.hex6.exec(r))?{r:q(n[1]),g:q(n[2]),b:q(n[3]),format:a?"name":"hex"}:(n=K.hex3.exec(r))?{r:q(n[1]+""+n[1]),g:q(n[2]+""+n[2]),b:q(n[3]+""+n[3]),format:a?"name":"hex"}:!1}window.tinycolor=l}(),t(function(){t.fn.spectrum.load&&t.fn.spectrum.processNativeColorInputs()})});
