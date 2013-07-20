/**
 * @author npcompleto
 * @version 0.0.3
 */
(function( $, undefined ) {

$.widget( "mobile.hwaccordion", $.mobile.widget, {

	options: {
		theme: null,
		iconpos: "right",
		iconOpened: "arrow-u", 
		iconClosed: "arrow-d",
		timing: "800ms",
		autoScroll: false,
		disableInput: false,
		useAnimation: true,
		radioMode: false,
		initSelector: ":jqmData(role='hwaccordion')"
	},

	_create: function(refresh) {
		
		//console.log("accordion creation.");
		var $accordionRoot = this;
		var $elem = this.element;
		var opts = this.options;
		var that = this;
		var translateOpen = 'translate' + (has3d ? '3d(' : '(');
		var translateClose = has3d ? ',0)' : ')';
		
		//Browser engine recognition
		//TODO evaluate useAnimation in markup
		var useAnimation = true;
		
		var isAndroid2 = /android 2/i.test(navigator.userAgent);
		
		var has3d = !isAndroid2 && $.support.cssTransform3d;
		
		this.options.useAnimation = has3d;
		
		
		//Fix. Content has -webkit-overflow-scrolling 
		if($.mobile.activePage){
			this.touchOverflowScrolling = ($.mobile.activePage.find(":jqmData(role='content')").css("-webkit-overflow-scrolling") == "touch");
		}
		else{
			this.touchOverflowScrolling = ($(":jqmData(role='content')").css("-webkit-overflow-scrolling") == "touch");
		}
		
		this.preserve3d = !this.touchOverflowScrolling;
		var prefix = "-webkit-";
		if(has3d) this.endTransitionEvent = "webkitTransitionEnd";
		if(has3d && ('mozAnimationStartTime' in window)){
			prefix = "-moz-";
			this.endTransitionEvent = "transitionend";
		}
		
		//console.log("endTransitionEvent:"+this.endTransitionEvent);

		var $accordionElems = $elem.find(":jqmData(role='accordion-element')");
		this.accordionElements = $accordionElems;
		
		var autoScroll = ($elem.jqmData("auto-scroll")+"") == "true";
		if(autoScroll){
			//console.log("AutoScroll enabled.");
			$.extend(this.options, [{autoScroll:$elem.jqmData( "auto-scroll")}]);
		}
		
		var disableInput = ($elem.jqmData("disable-input-on-close")+"") == "true";
		if(disableInput){
			//console.log("disableInput on close.");
			this.options['disableInput'] = $elem.jqmData("disable-input-on-close");
		}
		
		//console.log("has3d:"+has3d);
		
		//Basic styling
		if(has3d){
			$elem.css(prefix + "transform", "translateZ(0)");
			//if(this.preserve3d) $elem.css(prefix + "transform-style", "preserve-3d");
		}
		
		$elem.addClass("ui-accordion ui-accordion-"+opts.theme);
		
		//var collapsedIcon = $elem.jqmData( "collapsed-icon" );
		
		var maxZ = $accordionElems.length*4;
		var startingZ = maxZ;
		var countAccordion = 0;
		
		
		for(var i=0; i<$accordionElems.length; i++){
			//Single element initialization
			var $this = $($accordionElems[i]);
			$this.addClass("ui-accordion-element");
			//if(has3d && this.preserve3d) $this.css(prefix + "transform-style", "preserve-3d");
			$this.attr("accordion-index", countAccordion++);
			if(has3d) $this.css(prefix + "transition", prefix + "transform " + opts.timing );
			$this.jqmData("accordion-z-position", startingZ);
			$this.css('z-index', startingZ);
			$this.css('position', "relative");
			$this.find(":jqmData(role='accordion-header')").each(function(){
				//Header initialization
				$header = $(this);
				$accordionElems[i].header = $header;
				
				if(has3d)$header.css(prefix + "transform", "translateZ("+ startingZ-- +"px)");
				if(has3d && $accordionRoot.preserve3d)$header.css(prefix + "transform-style", "preserve-3d");
				$header.css("z-index", startingZ);
				$header.jqmData("accordion-z-position", startingZ);
				
				if(!$header.hasClass("ui-accordion-header")){
					$header.addClass("ui-accordion-header");
					$header.buttonMarkup({
						shadow: false,
						corners: false,
						iconpos: opts.iconpos || "left",
						icon: opts.iconClosed,
						mini: opts.mini,
						theme: opts.theme
					});
					$header.click(function(e){
						that._toggleAccordion($accordionRoot, $(this).parent(), prefix);
					});
				}
				
				
			});
			
			$this.find(":jqmData(role='accordion-content'):not(.ui-accordion-content)").each(function(){
				//Content initialization
				$content = $(this);
				$accordionElems[i].content = $content;
				
				if(has3d) $content.css(prefix + "transform", "translateZ("+(startingZ--)+"px)");
				$content.jqmData("accordion-z-position", startingZ);
				$content.css("position", "relative");
				$content.css("z-index", startingZ);
				if(has3d)$content.css(prefix + "transition", prefix + "transform " + opts.timing );
				if(has3d && $accordionRoot.preserve3d)$content.css(prefix + "transform-style", "preserve-3d");
				$content.addClass("ui-accordion-content");
			});
		}
		

		if(!refresh)
			this._closeAllAccordion($accordionRoot, $elem, prefix);
	},
	
	_translateContent: function($accordionRoot, prefix, $content, yTranslation, immediate, forceClose){
		//console.log("_translateContent");
		var that = this;
		
		if(immediate){
//			if(yTranslation <= 25){
//				//No height found, using default
//				yTranslation = -100;
//			}
			$content.css(prefix + "transition", prefix+"transform 0ms"); /*TODO timing from options*/
			$content.css(prefix + "transform", "translateY("+yTranslation+"px) translateZ("+$content.jqmData("accordion-z-position")+"px)");
			if(!forceClose){
				var $accordion = $content.parent();
				var $header = $accordion[0].header;
				if(!$content.parent().hasClass("ui-accordion-closed")){
					$content.parent().addClass("ui-accordion-closed");
					$header.find(".ui-icon-"+that.options.iconOpened).removeClass("ui-icon-"+that.options.iconOpened).addClass("ui-icon-"+that.options.iconClosed);
				}
				else{
					$content.parent().removeClass("ui-accordion-closed");
					$header.find(".ui-icon-"+that.options.iconClosed).removeClass("ui-icon-"+that.options.iconClosed).addClass("ui-icon-"+that.options.iconOpened);
				}
			}
						
			
		}else{
			$content.css(prefix + "transition", prefix+"transform 800ms");
			$content.css(prefix + "transform", "translateY("+yTranslation+"px) translateZ("+$content.jqmData("accordion-z-position")+"px)");
			
			$content.one(this.endTransitionEvent, function(){
				var $accordion = $(this).parent();
				var $header = $accordion[0].header;
				//console.log("_translateContent webkitTransitionEnd");
				if($accordion.hasClass("ui-accordion-closing")){
	            	$accordion.removeClass("ui-accordion-closing");			    
	   				$accordion.addClass("ui-accordion-closed");
	   				$header.find(".ui-icon-"+that.options.iconOpened).removeClass("ui-icon-"+that.options.iconOpened).addClass("ui-icon-"+that.options.iconClosed);
	   				
				}else{
					if($accordionRoot.options.autoScroll === true){
						if ($accordionRoot.touchOverflowScrolling)
							content.scrollTop($accordion[0].offsetTop  - $header.css("margin-top").replace("px","")); 
						else
							$(document).scrollTop($accordion.position().top - 43/*Main Header height*/); 
					}
					
					$header.find(".ui-icon-"+that.options.iconClosed).removeClass("ui-icon-"+that.options.iconClosed).addClass("ui-icon-"+that.options.iconOpened);
				}
			});
			
			$content.css(prefix + "transform", "translateY("+yTranslation+"px) translateZ("+$content.jqmData("accordion-z-position")+"px)");
			
			//Translating other accordion
			var currentIndex = $content.parent().attr("accordion-index");
			that.accordionElements.each(function(){
				var index = $(this).attr("accordion-index");
				if(index > currentIndex){
					that._translateAccordion($accordionRoot, prefix, $(this), yTranslation);
				}
			});
		}
		
	},
	
	_translateAccordion: function($accordionRoot, prefix, $accordion, yTranslation, immediate){
		//console.log("_translateAccordion");
		if(immediate){
			$accordion.css(prefix + "transition", prefix+"transform 0ms"); /*TODO timing from options*/
			$(this).css(prefix + "transform", "translateY(0)");
		}else{
			$accordion.css(prefix + "transition", prefix+"transform 800ms"); /*TODO timing from options*/
			$accordion.css(prefix + "transform", "translateY("+yTranslation+"px) translateZ("+$accordion.jqmData("accordion-z-position")+"px)");
			$accordion.one(this.endTransitionEvent, function(){
				//console.log("_translateAccordion webkitTransitionEnd");
				$(this).css(prefix + "transition", prefix + "transform 0ms");
				$(this).css(prefix + "transform", "translateY(0)");
			});
		}
		
	},
	
	_closeAccordion: function($accordionRoot, $accordion, prefix, immediate, forceClose){
		//console.log("_closeAccordion");
		var that = this;
		if(!immediate){
			$accordion.addClass("ui-accordion-closing");
		}
		
		if(that.options['disableInput']){
			$accordion.find("input, textarea").attr('disabled','disabled');
		}
		
		if(this.options.useAnimation){
			var $content = $accordion[0].content;
			if($content){
				var yClosingTranslation = -(	Number($content.height())+
											Number($content.css("padding-top").replace("px",""))+
											Number($content.css("padding-bottom").replace("px",""))
											);
				that._translateContent($accordionRoot, prefix, $content, yClosingTranslation , immediate, forceClose);
			}
		}
		else{
			$accordion.removeClass("ui-accordion-closing").addClass("ui-accordion-closed");
			var $content = $accordion[0].content;
//			if($content)
//				$content.css("display", "none");
		}
		
		
		
			
		
	},
	_closeAllAccordion: function($accordionRoot, $elem, prefix, forceClose){
		//console.log("_closeAllAccordion");
		var that = this;
		that.accordionElements.each(function(){
			$accordion = $(this);
			that._closeAccordion($accordionRoot, $accordion, prefix, true, forceClose);
		});
	},
	
	_openAccordion: function($accordionRoot, $accordion, prefix){
		//console.log("_openAccordion");
		var that = this;
		var $elem = $accordion.parent();
		
		that._closeAccordion($accordionRoot, $accordion, prefix, true, true);
		
		if(that.options['disableInput']){
			$accordion.find("input, textarea").removeAttr('disabled');
		}
		
		if(this.options.radioMode){
			//Close opened accordion
			$elem.find(".ui-accordion-element:not(.ui-accordion-closed)").each(function(){
				that._closeAccordion($accordionRoot, $(this), prefix, true);
			});
		}
		
		$accordion.removeClass("ui-accordion-closed").removeClass("ui-accordion-closing");
		if(this.options.useAnimation){
			var $content = $accordion[0].content;
			if($content){
				//$content.css("display", "block");
				setTimeout(function(){that._translateContent($accordionRoot, prefix, $content, "0");},0);
			}
		}
		else{
			if($accordionRoot.options.autoScroll === true){
				$(document).scrollTop($accordion[0].header.position().top - 43 /*Main Header height*/); 
			}
			var $content = $accordion[0].content;
//			if($content)
//				$content.css("display", "block");
		}
		
		
	},
	
	_toggleAccordion: function($accordionRoot, $accordion, prefix){
		//console.log("_toggleAccordion");
		var that = this;
		if($accordion.hasClass("ui-accordion-closed")){
			that._openAccordion($accordionRoot, $accordion, prefix);
		}
		else{
			that._closeAccordion($accordionRoot, $accordion, prefix);
		}
	},
	
	refresh: function( create ) {
		this._create(true);
	},
	disableAll: function( close ) {
		$(this.element[0]).find("input, textarea").attr('disabled','disabled');
	},	
	open: function(accordionIndex){
		if(this.accordionElements[accordionIndex]){
			this._openAccordion(this, $(this.accordionElements[accordionIndex]), "-webkit-", undefined);
		}
		
	},
	close: function(accordionIndex){
		if(this.accordionElements[accordionIndex]){
			this._closeAccordion(this, $(this.accordionElements[accordionIndex]), "-webkit-", undefined);
		}
		
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.hwaccordion.prototype.enhanceWithin( e.target );
});

})( jQuery );