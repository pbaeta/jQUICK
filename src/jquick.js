/**
 * jQUIck User Interface plugin
 * Author: Pedro Baeta, pedrobaeta@subverso.com
 * Copyright (c) 2013 Sub Verso Lda. 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)


*/

/********Global options and vars ********/





/***** Google font setup *****/


  WebFontConfig = {
    google: { families: [ 'Open+Sans:600,400,700:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })(); 






/***** text input interaction *****/
$(document).ready(function(){
						   
	$('input[type="text"], input[type="password"]').addClass("idleField");  

	$('input[type="text"], input[type="password"]').focus(function() {  
		$(this).removeClass("idleField").addClass("focusField");  
		if (this.value == this.defaultValue){  
			this.value = '';  
		}  
		if(this.value != this.defaultValue){  
			this.select();  
		}
		
	});

	$('input[type="text"], input[type="password"]').blur(function() {  
		$(this).removeClass("focusField").addClass("idleField");  
		if ((this.value == "")){  
			this.value = (this.defaultValue ? this.defaultValue : '');  
		}  
	});

/******* class control and object init *********/


$('[class*="col-"]').addClass('column');


/****** Preloader ******/

$('#loadingDiv')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    });



/*******Radio butons *******/

$(".cb-enable").click(function(){
		var parent = $(this).parents('.switch');
		$('.cb-disable',parent).removeClass('selected');
		$(this).addClass('selected');
		$('.checkbox',parent).attr('checked', true);
	});
	$(".cb-disable").click(function(){
		var parent = $(this).parents('.switch');
		$('.cb-enable',parent).removeClass('selected');
		$(this).addClass('selected');
		$('.checkbox',parent).attr('checked', false);
	});

});


/*************** Dropdown **************/


(function( $ ){
	$.fn.quickDropDown=function(){
		return $(this).each(function(){
			var $source = $(this);
			var selected = $source.find("option[selected]");
			var options = $("option", $source);
			
			$source.hide();
			
			$source.after('<dl id="target" class="quickDropdown"></dl>')
			$("#target").append('<dt><a>' + selected.text() + 
				'<span class="value">' + selected.val() + 
				'</span><span class="down right-float clearfix"></span></a></dt>')
			$("#target").append('<dd><ul></ul></dd>')
		
			options.each(function(){
				$("#target dd ul").append('<li><a>' + 
					$(this).text() + '<span class="value">' + 
					$(this).val() + '</span></a></li>');
			});
			
			$(document).on('click', function(e) {
				var $clicked = $(e.target);
				if (! $clicked.parents().hasClass('quickDropdown')){
					$(".quickDropdown dd ul").hide();
						
				}
			});
				
			$(".quickDropdown dd ul li a").click(function() {
				var text = $(this).html();
				$(".quickDropdown dt a").html(text +'<span class="down right-float clearfix"></span>');
				$(".quickDropdown dd ul").hide();
		
				$("#source").val($(this).find("span.value").html())
			});
			
			
			$(".quickDropdown dt a").click(function() {
				$(".quickDropdown dd ul").toggle();
			});
			
			//match disabled state
			if($source.is('[disabled]')){
				$source.trigger('disable');
			}
			
		});
		
	};
}( jQuery ));



/* File input */
 
(function( $ ){
	$.fn.quickFileInput = function(){
		return $(this).each(function(){
		
		//create custom control container
		var $upload = $('<div class="quickFile"></div>');
		//create custom control button
		var $uploadButton = $('<a class="button small right-float clearfix aria-hidden="true"><span class="upload"></span> Upload</a>').appendTo($upload);
		//create custom control feedback
		var $uploadFeedback = $('<span class="file-feedback" aria-hidden="true">Seleciona uma imagem...</span>').appendTo($upload);
									 
		//apply events and styles for file input element
		var $source = $(this)
			.addClass('file-input') //add class for CSS
			.mouseover(function(){ $uploadButton.addClass('buttonHover'); })
			.mouseout(function(){ $uploadButton.removeClass('buttonHover'); })
			.focus(function(){
				$upload.addClass('file-focus'); 
				$source.data('val', $source.val());
			})
			.blur(function(){ 
				$upload.removeClass('focusField');
				$(this).trigger('checkChange');
			 })
			 .on('disable',function(){
				$source.attr('disabled',true);
				$upload.addClass('disabled');
			})
			.on('enable',function(){
				$source.removeAttr('disabled');
				$upload.removeClass('disabled');
			})
			.on('checkChange', function(){
				if($source.val() && $source.val() != $source.data('val')){
					$source.trigger('change');
				}
			})
			.on('change',function(){
				//get file name
				var fileName = $(this).val().split(/\\/).pop();
				//get file extension
				var fileExt = 'file-ext-' + fileName.split('.').pop().toLowerCase();
				//update the feedback
				$uploadFeedback
					.text(fileName) //set feedback text to filename
					.removeClass($uploadFeedback.data('fileExt') || '') //remove any existing file extension class
					.addClass(fileExt) //add file extension class
					.data('fileExt', fileExt) //store file extension for class removal on next change
					.addClass('file-feedback-populated'); //add class to show populated state
				//change text of button	
				$uploadButton.text('Alterar');	
			})
			.on('click', function(){ //for IE and Opera, make sure change fires after choosing a file, using an async callback
				$source.data('val', $source.val());
				setTimeout(function(){
					$source.trigger('checkChange');
				},100);
			});
			
		
		
		//match disabled state
		if($source.is('[disabled]')){
			$source.trigger('disable');
		}
			
		
		//on mousemove, keep file input under the cursor to steal click
		$upload.mousemove(function(e){
				$source.css({
					'left': e.pageX - $upload.offset().left - $source.outerWidth() + 20, //position right side 20px right of cursor X) 
					'top': e.pageY - $upload.offset().top - 3 //- $(window).scrollTop()
				});	
			})
			.insertAfter($source); //insert after the input
		
		$source.appendTo($upload);
			
		});
	};
}( jQuery ));// JavaScript Document


/****** Checkboxes ******/

(function($){

    $.fn.tzCheckbox = function(options){

        // Default On / Off labels:
        options = $.extend({
            labels : ['ON','OFF']
        },options);

        return this.each(function(){
            var originalCheckBox = $(this),
                labels = [];

            // Checking for the data-on / data-off HTML5 data attributes:

            if(originalCheckBox.data('on')){
                labels[0] = originalCheckBox.data('on');
                labels[1] = originalCheckBox.data('off');
            }

            else labels = options.labels;

            // Creating the new checkbox markup:

            var checkBox = $('<span>',{
                class   : 'tzCheckBox '+(this.checked?'checked':''),
                html:   '<span class="tzCBContent">'+labels[this.checked?0:1]+
                        '</span><span class="tzCBPart"></span>'
            });

            // Inserting the new checkbox, and hiding the original:

            checkBox.insertAfter(originalCheckBox.hide());

            checkBox.click(function(){
                checkBox.toggleClass('checked');
                var isChecked = checkBox.hasClass('checked');

                // Synchronizing the original checkbox:

                originalCheckBox.attr('checked',isChecked);
                checkBox.find('.tzCBContent').html(labels[isChecked?0:1]);
            });

            // Listening for changes on the original and affecting the new one:

            originalCheckBox.bind('change',function(){
                checkBox.click();
            });
        });
    };
})(jQuery);




/***** tabs *****/

(function( $ ){
	$.fn.jQUICKtabs = function(ajaxContainers, params){
		
		var settings = $.extend({},
			{
			ajax : true,
			history : false
			},
		params);
		
		return $(this).each(function(){
			var $this=$(this);
			var i = 0;
			var tabs = [];
			var tabContainers = [];
			//apply events and styles for tabs and tabs children
			$this.addClass('tabs').children().addClass('tab').attr('id', function() {
   				i++;
   				return 'tab'+i;
			});
			
			$this.find('a').each(function () { //make it generic
				tabs.push(this);
				if (this.pathname == window.location.pathname) {
					if($(this.hash).get(0)){	
						tabContainers.push($(this.hash).get(0));
					}
				} 
			});
			
			
			$(tabs).click(function (event) {
				//event.preventDefault();
				
				//console.log(this.hash)
				
				if(((this.hash)!='') && (tabContainers!='')){
					$(tabContainers).addClass('tabContainer').hide().filter(this.hash).show();
					$(ajaxContainers).hide();
				}else if(settings.ajax==true){
					$(ajaxContainers).show().addClass('tabContainer').load($(this).attr('href')); 
					$(tabContainers).hide();
					
				}
				// set up the selected class
				$(tabs).removeClass('selected');
				$(this).addClass('selected');
				
				

				return false;
			}).filter(':first').click();
		
		});
	};
})(jQuery);





/****** Scroll ******/

(function( $ ){
	$.fn.quickScroll = function(params){
		
		var settings = $.extend({},
			{
			direction : 'vertical',
			background: true,
			height : 0,
			width: 0
			
			},
		params);
		
		return $(this).each(function(){
			
			var $source = $(this);
			
			var $target = $('<div class="quickScroll" />').insertAfter($source);
			
			var $wrapperBack= $('<div />').appendTo($target);
			var $wrapper = $('<div class="quickScroll-wrap" />').prependTo($wrapperBack);
			
			$source.appendTo($wrapper);
			//console.log(settings.direction);
			if(settings.height===0){
				$wrapper.height($source.children('li:first').outerHeight(true));
			}else{
				$wrapper.height(settings.height);
			}
			
			if(settings.width===0){
				$wrapper.width($source.children('li:first').outerWidth(true));
			}else{
				$wrapper.width(settings.width);
			}
			
			if(settings.background==true){
				$wrapperBack.addClass('quickScroll-back');
			}else{
				$wrapperBack.css({'display' : 'inline-block','vertical-align':'middle'});
			}
			
			
			if(settings.direction==='vertical'){
				
				var $prevButton = $('<div class="centered hit"><span class="up"></span></div>').prependTo($target);
				var $nextButton=$('<div class="centered hit"><span class="down"></span></div>').appendTo($target);
				
				if($source.length){
			  
					// Declare variables
					var totalOpts = $source.children('li').length, 
						optHeight = $source.children('li:first').outerHeight(true),
						totalHeight = optHeight * totalOpts,
						visibleOpts = Math.round($wrapper.height() / optHeight),
						visibleHeight = visibleOpts * optHeight,
						stopPosition = (visibleHeight - totalHeight);
						
						$source.height(totalHeight);
					
						$prevButton.on('click',function(){
														
						
														
							if($source.position().top < 0 && !$source.is(":animated") && visibleHeight < totalHeight){
								$source.animate({top : "+=" + optHeight + "px"});
							}
						return false;
					});
				
					$nextButton.on('click',function(){
						
						//console.log($source.position().top);
						
						if($source.position().top >= stopPosition && !$source.is(":animated") && visibleHeight < totalHeight){
							$source.animate({top : "-=" + optHeight + "px"});
						}
						return false;
					});
				}
			}else{
				
				var $prevButton = $('<a class="hit"><span class="back"></span></a>').prependTo($target);
				var $nextButton=$('<a class="hit"><span class="forward"></span></a>').appendTo($target);
				
				$nextButton.height($source.children('li:first').outerHeight(true));
				//$prevButton.height($source.children('li:first').outerHeight(true));
				$prevButton.css('display','inline-block');
				
				$source.children('li').css('float','left');
				//$target.css('display','inline');
				//$target.heigth($source.outerHeight(true)+10);
				
				if($source.length){
			  
					// Declare variables
					var totalOpts = $source.children('li').length, 
						optWidth = $source.children('li:first').outerWidth(true),
						totalWidth = optWidth * totalOpts,
						visibleOpts = Math.round($wrapper.width() / optWidth),
						visibleWidth = visibleOpts * optWidth,
						stopPosition = (visibleWidth - totalWidth);
						
						//console.log(stopPosition);
						
						$source.width(totalWidth);
					
						$prevButton.on('click',function(){
							if($source.position().left < 0 && !$source.is(":animated")){
								$source.animate({left : "+=" + optWidth + "px"});
							}
						return false;
					});
				
					$nextButton.on('click',function(){
						if($source.position().left > stopPosition && !$source.is(":animated") && visibleWidth < totalWidth){
							$source.animate({left : "-=" + optWidth + "px"});
						}
						return false;
					});
				
				}
			}
			
			
		});
	};
})(jQuery);						



/******Messages*******/


(function( $, window, document, undefined ){
	//$.fn.quickModal = function(method){
		
		var settings = {};
		var defaults = 
			{
			role 		: 'default', 			// dialog, overlay, content, invisible - defines the role of container  
			modal		: true, 				// bolean - defines if the backgroung is visible 
			closeOutside: false, 				// bolean - Defines if clicking background closes quickModal
			animation	: 'fly-top', 			// fly-top, fly-left, fly right, fly-bottom, fade, none - animation modes
			animationspeed: 300,
			appendTo	: 'body', 				// string - Any element, ID or class 
			position	: 'center center',		// [center center] OR [x y] - position - values without units */
			class 		: 'cloud',				/* string - overide class */
			closeClass	: 'quickModal-close'	/* string - close button class */		
			};

			// custructor variables
			var $source = $();
			var $target = $();
			//var $content = $('.quickModal-content');
			var $widget = $();

			// plugin methods
			
			var methods = {
				init : function( options ) {
					
					if(options) {
                		settings = $.extend({},defaults,options);
           			 }else{
           			 	settings=defaults;
           			 }
		

					//check if Modal exists and constructs or cleans up

					if(! $source.parents().hasClass('quickModal')) {
						
						$target = $('<div class="quickModal" />').appendTo('body').data('quickModal', settings);	


						//cunstructs modal based os type
						switch(settings.role) {

							case 'default':
								
								$widget = $source.appendTo($target);
								if(settings.modal==true)
									$target.addClass('overlay quickModal-click');
								break;							
							
							case 'content':
								
								$target.appendTo($source.parent());
								$widget = $source.appendTo($target).addClass(settings.class);

								break;
							
							case 'dialog':

								$widget = $('<div class="quickModal-widget" />').appendTo($target);
								var $title = $('<div class="quickModal-title"/>').prependTo($widget).text($source.attr('title'));
								
								var $closeButton = $('<a class="quickModal-close modal-close clearfix">&#215;</div>').appendTo($title);
								
								$source.appendTo($widget);
								$('<div class="modal-footer"><a class=" button light quickModal-close">OK</a></div>').appendTo($widget);

								$widget.addClass(settings.class);
								if(settings.modal==true)
									$target.addClass('overlay');
								break;

							case 'overlay':
								
								$widget = $('<div class="quickModal-widget cloud" />').appendTo($target);
								var $closeButton = $('<a class="quickModal-close modal-overlay-close clearfix">&#215;</div>').appendTo($widget);
								$source.appendTo($widget);

								if(settings.modal==true)
									$target.addClass('overlay quickModal-click');
								break;
						}

						if($closeButton)
							$closeButton.addClass(settings.closeClass);

						$source.addClass('quickModal-content');
												
						methods.open(settings);		

						//$target.data('quickModal')= settings;


						$(document).on('click.quickModal', function(e) {
							var $clicked = $(e.target);

							if ($clicked.hasClass("quickModal-click") || $clicked.hasClass(settings.closeClass) || $clicked.parent().hasClass(settings.closeClass))
								methods.close(defaults);
							
						});
						
						$(document).on('keyup.quickModal', function(e) {
        					if(e.which===27){ methods.close(); } // 27 is the keycode for the Escape key
						});
			
						/*$target.width($(document).width()).height($(document).height());			
						
						$(window).on('resize.quickModal', function () {
								$target.width($(document).width());
								$target.height($(document).height());
						});	*/

					}else{
						
						$target = $source.parents('.quickModal');
						if($source.parents('.quickModal-widget').length != 0){
							$widget = $source.parents('.quickModal-widget')
						}else{
							$widget = $source;
						}
						methods.open($target.data('quickModal'));

					}	
			
				},
				destroy : function( ) {
	
				   //return this.each(function(){
					 	$(window).off('.quickModal');
					 	$target.removeData('quickModal');
					 	$source.appendTo('body').removeClass('quickModal-content', 'cloud');
					 	$target.remove();
				   //})
				},
				
				open : function(options) { 

						var animated = options.animation.split('-');
						var prop = animated[1]
						
						topMeasure  = parseInt($widget.css(prop));
						topOffset = $widget.height() + topMeasure;
						
						var cssMap ={}; 
						cssMap[animated[1]] = $(document).scrollTop()+topMeasure + 'px';
						cssMap['opacity']=1;

					  	//Entrance Animations
						//$widget.bind('reveal:open', function () {
						  //$target.unbind('click.modalEvent');
							//$('.' + options.closeClass).unbind('click.modalEvent');
							//if(!locked) {
								//lockModal();
								if(animated[0] == "fly") {
									$widget.css(prop, $(document).scrollTop()-topOffset+'px').css({'opacity' : 0, 'visibility' : 'visible'});
									$target.fadeIn(options.animationspeed/2);
									$widget.delay(options.animationspeed/2).animate(cssMap, options.animationspeed);//,unlockModal()					
								}
								if(options.animation == "fade") {
									$widget.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+topMeasure});
									$target.fadeIn(options.animationspeed/2);
									$widget.delay(options.animationspeed/2).animate({
										"opacity" : 1
									}, options.animationspeed);	//,unlockModal()				
								} 
								if(options.animation == "none") {
									$widget.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
									$target.css({'display':'block'});	
									//unlockModal()				
								}
							//}
							//modal.unbind('reveal:open');
						//}); 	



					  	//$target.show();
				},
				close : function(options) {

					if(options) {
                			settings = $.extend({},defaults,options);
           			 	}else{
           			 		options=$target.data('quickModal');
           				 }

					   	if(options.animation == "fly-top") {
						$target.delay(options.animationspeed).fadeOut(options.animationspeed);
						$widget.animate({
							"top":  $(document).scrollTop()-topOffset + 'px',
							"opacity" : 0
						}, options.animationspeed/2, function() {
							$widget.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
							//unlockModal();
						});					
					}  	
					if(options.animation == "fade") {
						$target.delay(options.animationspeed).fadeOut(options.animationspeed);
						$widget.animate({
							"opacity" : 0
						}, options.animationspeed, function() {
							$widget.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
							//unlockModal();
						});					
					}  	
					if(options.animation == "none") {
						$widget.css({'visibility' : 'hidden', 'top' : topMeasure});
						$target.css({'display' : 'none'});	
					}
				},
				load : function( content ) { 
						
						//methods.open()
						return $source.load(content);
				}
			};
				
	$.fn.quickModal = function(method){
		
		var outerArguments = arguments;
		$source = $(this);

		return $(this).each(function(){

			for (var i=0;i<arguments.length;i++) {
				if ( methods[method] ) {
					return methods[method].apply( this, Array.prototype.slice.call( outerArguments, i+1 ));
				} else if ( typeof method === 'object' || ! method ) {
					return methods.init.apply( this, Array.prototype.slice.call( outerArguments,  0) );
				} else {
					$.error( 'Method ' +  method + ' does not exist on quickModal' );
				}     
			}
		});
	
	};
	//};
})(jQuery, window, document);	




/****** toolTip ********/

$(function () {
  $('.bubbleInfo').each(function () {
    // options
    var distance = 10;
    var time = 250;
    var hideDelay = 500;

    var hideDelayTimer = null;

    // tracker
    var beingShown = false;
    var shown = false;
    
    var trigger = $('.trigger', this);
    var popup = $('.popup', this).css('opacity', 0);

    // set the mouseover and mouseout on both element
    $([trigger.get(0), popup.get(0)]).mouseover(function () {
      // stops the hide event if we move from the trigger to the popup element
      if (hideDelayTimer) clearTimeout(hideDelayTimer);

      // don't trigger the animation again if we're being shown, or already visible
      if (beingShown || shown) {
        return;
      } else {
        beingShown = true;

        // reset position of popup box
        popup.css({
          top: -100,
          left: -33,
          display: 'block' // brings the popup back in to view
        })

        // (we're using chaining on the popup) now animate it's opacity and position
        .animate({
          top: '-=' + distance + 'px',
          opacity: 1
        }, time, 'swing', function() {
          // once the animation is complete, set the tracker variables
          beingShown = false;
          shown = true;
        });
      }
    }).mouseout(function () {
      // reset the timer if we get fired again - avoids double animations
      if (hideDelayTimer) clearTimeout(hideDelayTimer);
      
      // store the timer so that it can be cleared in the mouseover if required
      hideDelayTimer = setTimeout(function () {
        hideDelayTimer = null;
        popup.animate({
          top: '-=' + distance + 'px',
          opacity: 0
        }, time, 'swing', function () {
          // once the animate is complete, set the tracker variables
          shown = false;
          // hide the popup entirely after the effect (opacity alone doesn't do the job)
          popup.css('display', 'none');
        });
      }, hideDelay);
    });
  });
});


/******* Slider ********/



