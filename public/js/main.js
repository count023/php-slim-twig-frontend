/*!
 *
 * @preserve Funke Digital GmbH - JavaScript library
 *
 * Copyright 2016, Funke Digital GmbH
 * http://www.funkedigital.de/
 *
 */

 jQuery = $.noConflict();

(function( $, window, document, undefined ) {
	"use strict";

	var funky = {};

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.onload = function () {

	jQuery(".madvertise").each(function (index) {
		var adIframe = jQuery(this).find("iframe").length,
		    adImage = jQuery(this).find("img").length;

		if (adIframe || adImage) {
			jQuery(this).addClass("ad--marker");
		} else {
			window.console.log("Madvertise Ad not runnning");
		}
	});
};
/* global jQuery, window, createCookie */

/**
 * Created by aladendorf on 25.07.2016.
 * wird durch Funktionsaufruf erst nach dem erzeugten DataLayer Object initialisiert
 */

function setAdBlockActive(enabled) {
	// window.console.log("adblock-detection: About to set adblockerCookie to", enabled);

	// variable is used for additional JS-Script in google-tagmanager see:
	// publications/multi/src/main/webapp/template/widgets/tracking/view/helpers/google-tagmanager.jsp
	window.adBlockActive = enabled;
}

/**
 * detects if ads have been blocked by the client
 */
jQuery(document).ready(function () {

	var adTestElem = document.createElement("div");
	adTestElem.innerHTML = "&nbsp;";
	adTestElem.className = "adsbox";
	document.body.appendChild(adTestElem);
	window.setTimeout(function () {
		if (adTestElem.offsetHeight === 0) {
			setAdBlockActive(true);
			// window.console.log("adblock-detection: AdBlocker enabled");
		} else {
			setAdBlockActive(false);
			// window.console.log("adblock-detection: NO AdBlocker");
		}
		adTestElem.remove();
	}, 100);
});

/**
 * manipulates the dimensions of empty ad elements.
 * this is necessary because there are certain default css rules in the code that attach margins/heights/overflows for
 * every ad element, regardless of their state. these default rules make no sense if the ad elements are empty.
 */
jQuery(window).on("load", function () {

	var $adItems = jQuery(".ad").not(".traffective-ad");

	// var adItemsImgAmount = $adItems.find("img").length,
	// 	adItemsIframeAmount = $adItems.find("iframe").length,
	// 	adItemsAmount = adItemsImgAmount + adItemsIframeAmount;
	// window.console.log("adblock-detection: Anzahl der ausgespielten Werbemittel (ohne Traffective): " + adItemsAmount);

	$adItems.each(function (idx, adItem) {
		var $adItem = jQuery(adItem),
		    adItemImgAmount = $adItem.find("img").length,
		    adItemIframeAmount = $adItem.find("iframe").length;

		// window.console.log("adblock-detection: Ad: ", index, adItemImgAmount, adItemIframeAmount);

		if (adItemImgAmount > 0 || adItemIframeAmount > 0) {
			// window.console.log("adblock-detection: Adblocker not runnning");
			$adItem.find(".ad--marker-inner").removeAttr("style");
		} else {
			// window.console.log("adblock-detection: Adblocker runnning");
			$adItem.css({
				margin: 0,
				height: 0
			});

			$adItem.find(".ad--marker-inner").css({
				height: 0,
				overflow: "hidden"
			});
		}
	});

	// window.console.log("adblock-detection: adItemsImgAmount: ", adItemsImgAmount, "adItemsIframeAmount: ", adItemsIframeAmount);
	// window.console.log("adblock-detection: adblockdetection loaded");
});

/* globals grecaptcha */

jQuery.fn.ajaxComments = function (options, recaptcha) {

	return this.each(function () {

		var that = this,
		    $that = jQuery(this),
		    $form = jQuery("form", this),
		    $commentsList = jQuery("#community-comments-list"),
		    $submitLink = jQuery("a.submit", this),
		    opts = jQuery.extend({
			before: null,
			context: document.body,
			fail: null,
			done: null,
			type: "POST",
			url: "",
			reCaptcha: $that.find(".g-recaptcha").length
		}, options);

		if ($that.find(".g-recaptcha").length > 0) {
			var data = jQuery(this).serializeArray();

			if (typeof opts.before === "function") {
				data = opts.before.call(this, data);
			}

			jQuery.ajax({
				"cache": false,
				"context": opts.context,
				"data": data,
				"dataType": "HTML",
				"type": opts.type,
				"url": opts.url
			}).done(function (data, textStatus, jqXHR) {
				var tempDom = jQuery("<div>").append(jQuery.parseHTML(data));
				if (!tempDom.find(".comment_success").length) {
					$that.find(".error.comment_error").remove();
					$that.prepend(data);
				} else if ($that.hasClass("comment__response-form")) {
					$that.nextAll(".comment__answers.answers").find("ul").prepend(data).show();
					$that.hide();
					$that.trigger("reset");
					$that.find(".error.comment_error").remove();
				} else {
					$commentsList.prepend(data);
					$that.html("");
					jQuery(window).scrollTop(parseInt($that.offset().top) - 200);
				}

				if (typeof opts.done === "function") {
					opts.done.call();
				}
			}).fail(function (jqXHR, textStatus, failThrown) {
				if (typeof opts.fail === "function") {
					opts.fail.call();
				}
			});

			return false;
		} else {

			$that.on("submit", "form", function () {
				var data = jQuery(this).serializeArray();

				if (typeof opts.before === "function") {
					data = opts.before.call(this, data);
				}

				jQuery.ajax({
					"cache": false,
					"context": opts.context,
					"data": data,
					"type": opts.type,
					"url": opts.url
				}).done(function (data, textStatus, jqXHR) {
					$that.html(data);
					if (typeof opts.done === "function") {
						opts.done.call();
					}
				}).fail(function (jqXHR, textStatus, failThrown) {
					if (typeof opts.fail === "function") {
						opts.fail.call();
					}
				});

				return false;
			});
		}

		if (!opts.reCaptcha) {

			$submitLink.on("click", function () {
				jQuery(this).closest("form").trigger("submit");
				return false;
			});

			jQuery("input[type=submit]", this).on("click", function () {
				jQuery("input[name=action]", that).val(jQuery(this).attr("name"));
			});
		} else {
			$form.trigger("submit");
		}
	});
};

/* globals grecaptcha */

$.fn.ajaxForm = function (options) {

	return this.each(function () {

		var that = this,
		    $that = $(this),
		    $form = $("form", this),
		    $submitLink = $("a.submit", this),
		    opts = $.extend({
			before: null,
			context: document.body,
			fail: null,
			done: null,
			type: "POST",
			url: "",
			reCaptcha: $form.find(".g-recaptcha").length
		}, options);

		if ($form.find(".g-recaptcha").length > 0) {
			$form.unbind("submit").bind("submit", function () {
				var data = $(this).serializeArray();

				if (typeof opts.before === "function") {
					data = opts.before.call(this, data);
				}

				$.ajax({
					"cache": false,
					"context": opts.context,
					"data": data,
					"dataType": "HTML",
					"type": opts.type,
					"url": opts.url
				}).done(function (data, textStatus, jqXHR) {
					console.log("ajax done");
					var tempDom = $("<div>").append($.parseHTML(data));
					if (!tempDom.find("input[name='success']").length) {
						$that.find(".form-result").html(data);
					} else {
						$that.html(data);
						$(window).scrollTop(parseInt($that.offset().top) - 200);
					}

					if (typeof opts.done === "function") {
						opts.done.call();
					}
				}).fail(function (jqXHR, textStatus, failThrown) {
					// log(jqXHR, textStatus, failThrown);
					if (typeof opts.fail === "function") {
						opts.fail.call();
					}
				});

				return false;
			});
		} else {

			$that.on("submit", "form", function () {
				var data = $(this).serializeArray();

				if (typeof opts.before === "function") {
					data = opts.before.call(this, data);
				}

				$.ajax({
					"cache": false,
					"context": opts.context,
					"data": data,
					"type": opts.type,
					"url": opts.url
				}).done(function (data, textStatus, jqXHR) {
					$that.html(data);
					if (typeof opts.done === "function") {
						opts.done.call();
					}
				}).fail(function (jqXHR, textStatus, failThrown) {
					// log(jqXHR, textStatus, failThrown);
					if (typeof opts.fail === "function") {
						opts.fail.call();
					}
				});

				return false;
			});
		}

		if (!opts.reCaptcha) {
			$submitLink.on("click", function () {
				$(this).closest("form").trigger("submit");
				return false;
			});

			$("input[type=submit]", this).on("click", function () {
				$("input[name=action]", that).val($(this).attr("name"));
			});
		} else {
			$form.trigger("submit");
		}
	});
};

$.fn.ajaxLink = function (options) {

	return this.each(function () {

		var that = this,
		    opts = $.extend({
			before: null,
			context: document.body,
			data: null,
			fail: null,
			done: null,
			target: null,
			type: "POST",
			url: $(this).data("ajax-url") || $(this).attr("href")
		}, options);

		$(this).click(function () {
			var data = opts.data;
			if (!data && opts.type === "POST") {
				data = "nocache=" + Math.random() * 100000;
			}

			if (typeof opts.before === "function") {
				data = opts.before.call(this, data);
			}

			$.ajax({
				"cache": false,
				"context": opts.context,
				"data": data,
				"type": opts.type,
				"url": opts.url
			}).done(function (data, textStatus, jqXHR) {
				$(opts.target).html(data);
				if (typeof opts.done === "function") {
					opts.done.call();
				}
				// Wait for ad to load and center it afterwards
				window.setTimeout(function () {
					$(opts.target).trigger("center-ads");
				}, 500);
			}).fail(function (jqXHR, textStatus, failThrown) {
				// log(jqXHR, textStatus, failThrown);
				if (typeof opts.fail === "function") {
					opts.fail.call();
				}
			});

			return false;
		});
	});
};

/**
 * Lädt den Inhalt des angebundenen Elements von der im Parameter <code>url</code> übergebenen
 * AJAX-URL in periodischem Abstand immer wieder.
 *
 */
$.fn.ajaxRefresh = function (options) {
	return this.each(function () {

		var that = this,
		    opts = $.extend({
			before: null,
			context: document.body,
			data: null,
			fail: null,
			initial: true,
			interval: null,
			refresh: true,
			done: null,
			type: "GET",
			url: null
		}, options);

		if (opts.initial) {
			$(that).ajaxUpdate(opts);
			opts.initial = false;
		}

		if (opts.refresh) {
			window.setTimeout(function () {
				$(that).ajaxUpdate(opts).ajaxRefresh(opts);
			}, opts.interval);
		}
	});
};

/**
 * Lädt den Inhalt des angebundenen Elements von der im Parameter <code>url</code> übergebenen
 * AJAX-URL.
 *
 * Beispiel: $("#elementId").ajaxUpdate({"url": "..."});
 */
$.fn.ajaxUpdate = function (options) {
	return this.each(function () {

		var that = this,
		    opts = $.extend({
			before: null,
			context: document.body,
			data: null,
			fail: null,
			done: null,
			type: "GET",
			url: null
		}, options),
		    data = opts.data;

		if (!data && opts.type === "POST") {
			data = "nocache=" + Math.random() * 100000;
		}

		if (typeof opts.before === "function") {
			data = opts.before.call(this, data);
		}

		$.ajax({
			"cache": false,
			"context": opts.context,
			"data": data,
			"type": opts.type,
			"url": opts.url
		}).done(function (data) {
			$(that).html(data);
			if (typeof opts.done === "function") {
				opts.done.call();
			}
		}).fail(function () {
			if (typeof opts.fail === "function") {
				opts.fail.call();
			}
		});
	});
};

// Init --------------------------------------------------------------------------------------------

$.ajaxSetup({
	// Wichtig f. iOS 6:
	"cache": "false",
	"headers": { "cache-control": "no-cache" }
});
/* Back to Home Button */
/* Author: Peter Marhewka */
/* CodeReview: akr: TODO: to be optimised in matter of code cleaning */

function BackToHome(rootNode, opts) {
	this.rootNode = rootNode;
	this.opts = opts;
	this.init(opts);
}

BackToHome.prototype.init = function (opts) {
	// var that is required if you want call this from first Level
	var that = this,
	    lastScrollTop = 0,
	    fadeOutTimeout = null,
	    options = jQuery.extend({
		timetoredirect: "2000",
		previewOpacity: "0.5",
		previewCustomClass: "custom-article_preview",
		disableRedirect: false,
		showButtonUpscroll: false,
		fadeOutDelay: "2500"
	}, opts);

	jQuery("." + options.previewCustomClass).css({
		opacity: options.previewOpacity
	}).addClass("back-to-home_overlay");

	window.addEventListener("scroll", function (event) {

		var top = this.scrollY,
		    documentHeight = jQuery(document).outerHeight(),
		    windowHeight = jQuery(window).innerHeight(),
		    rectElement = jQuery("." + options.previewCustomClass).position(),
		    maxSpace = documentHeight - rectElement.top,
		    maxDeg = 360,
		    mobileBreakpoint = 768,
		    scrollValue = Math.abs(documentHeight - maxSpace - (top + windowHeight)),
		    calcFactor = maxSpace / maxDeg,
		    calcDeg = scrollValue / calcFactor,
		    radialProgressElement = jQuery(that.rootNode).find(".radial-progress"),
		    linktoPage = jQuery(that.rootNode).find(".back-to-home_link").attr("href");

		// window.console.log("Scroll-Top", top, "documentHeight", documentHeight, "windowHeight", windowHeight, "calcDeg", calcDeg, "scrollValue", scrollValue);
		// window.console.log(top + scrollValue, ">", rectElement.top + (jQuery("." + options.previewCustomClass).height() / 2));
		// window.console.log(rectElement.top + (jQuery("." + options.previewCustomClass).height() / 2), "<", top + windowHeight);

		if (rectElement.top + jQuery("." + options.previewCustomClass).height() + radialProgressElement.height() / 2 < top + windowHeight && jQuery(window).width() > mobileBreakpoint) {
			if (!radialProgressElement.hasClass("no-fix")) {
				radialProgressElement.addClass("no-fix").css({
					top: rectElement.top + jQuery("." + options.previewCustomClass).height() / 2 - radialProgressElement.height() / 2 + "px"
				});
			}
		}

		if (options.disableRedirect === false) {
			if (documentHeight - maxSpace < top + windowHeight) {
				jQuery(that.rootNode).removeClass("back-to-home_hidden");
				radialProgressElement.find(".fix").css({ transform: "rotate(" + calcDeg + "deg)" });

				if (calcDeg < 180) {
					radialProgressElement.find(".full").css({ transform: "rotate(0deg)" });
					radialProgressElement.find(".full").find(".fill").css({ transform: "rotate(" + calcDeg + "deg)" });
					radialProgressElement.find(".half").removeAttr("style");
					radialProgressElement.find(".half").find(".fill").removeAttr("style");
				} else {
					radialProgressElement.find(".full").find(".fill").css({ transform: "rotate(180deg)" });
					radialProgressElement.find(".half").css({ transform: "rotate(180deg)" });
					radialProgressElement.find(".half").find(".fill").css({ transform: "rotate(" + (calcDeg - 180) + "deg)" });
				}
			} else {
				radialProgressElement.find(".full").removeAttr("style");
				radialProgressElement.find(".half").removeAttr("style");
				radialProgressElement.find(".fill").removeAttr("style");
				jQuery(that.rootNode).addClass("back-to-home_hidden");

				if (options.showButtonUpscroll === true) {

					if (top < lastScrollTop) {
						jQuery(that.rootNode).addClass("back-to-home_disableRedirect").removeClass("back-to-home_hidden");

						clearTimeout(fadeOutTimeout);

						fadeOutTimeout = setTimeout(function () {
							jQuery(that.rootNode).removeClass("back-to-home_disableRedirect").addClass("back-to-home_hidden");
						}, options.fadeOutDelay);
					} else {
						jQuery(that.rootNode).removeClass("back-to-home_disableRedirect");
					}

					lastScrollTop = top;
				}
			}

			if (documentHeight - 5 < top + windowHeight) {
				jQuery(that.rootNode).addClass("back-to-home_redirect");

				radialProgressElement.find(".full").removeAttr("style");
				radialProgressElement.find(".half").removeAttr("style");
				radialProgressElement.find(".full").find(".fill").removeAttr("style");
				radialProgressElement.find(".half").find(".fill").removeAttr("style");

				setTimeout(function () {
					if (jQuery(that.rootNode).hasClass("back-to-home_redirect")) {
						window.dataLayer.push({
							"event": "backToHome"
						});
						window.location.href = linktoPage;
					}
				}, options.timetoredirect);
			} else {
				jQuery(that.rootNode).removeClass("back-to-home_redirect");
			}
		} else {
			if (documentHeight - maxSpace < top + windowHeight) {
				jQuery(that.rootNode).removeClass("back-to-home_hidden").addClass("back-to-home_disableRedirect");
			} else {
				radialProgressElement.find(".full").removeAttr("style");
				radialProgressElement.find(".half").removeAttr("style");
				radialProgressElement.find(".fill").removeAttr("style");
				jQuery(that.rootNode).addClass("back-to-home_hidden");
			}

			if (options.showButtonUpscroll === true) {
				if (top < lastScrollTop) {
					jQuery(that.rootNode).addClass("back-to-home_disableRedirect").removeClass("back-to-home_hidden");

					clearTimeout(fadeOutTimeout);

					fadeOutTimeout = setTimeout(function () {
						jQuery(that.rootNode).removeClass("back-to-home_disableRedirect").addClass("back-to-home_hidden");
					}, options.fadeOutDelay);
				} else {
					jQuery(that.rootNode).removeClass("back-to-home_disableRedirect");

					if (options.disableRedirect === true) {
						jQuery(that.rootNode).addClass("back-to-home_disableRedirect");
					}
				}

				lastScrollTop = top;
			}
		}
	}, false);
};

jQuery.fn.backToHome = function (opts) {
	return this.each(function () {
		new BackToHome(this, opts);
	});
};
/* globals funky */

funky.BreakingNews = {};

funky.BreakingNews.Model = function (opts) {

	var options = {
		cookieName: "bnc",
		cookieTtl: 2
	};

	// - private functions
	function createCookie() {
		var currentCookieValue = window.readCookie(options.cookieName);
		if (currentCookieValue === null) {
			// just set cookie, if it does not exist
			window.createCookie(options.cookieName, "", options.cookieTtl);
		}
	}

	function init(opts) {
		options = $.extend(options, opts);

		createCookie();
	}

	// - privileged functions
	// cookie handling
	this.newsIsDisabled = function (articleId, lastModified) {
		var currentCookieValue = window.readCookie(options.cookieName);
		console.log("Model.newsIsDisabled:", "articleId:", articleId, "lastModified:", lastModified);
		return currentCookieValue != null && currentCookieValue.indexOf("|" + this.getArticleMarker(articleId, lastModified)) > -1;
	};

	this.storeNewsAsDisabled = function (articleId, lastModified) {
		console.dir(arguments);
		var currentCookieValue = window.readCookie(options.cookieName);
		window.createCookie(options.cookieName, currentCookieValue + "|" + this.getArticleMarker(articleId, lastModified), options.cookieTtl);
	};

	// handling of the URI
	this.getWidgetUpdateUri = function () {
		return options.widgetUrl;
	};

	this.getArticleMarker = function (articleId, lastModified) {
		console.log("Model.getArticleMarker:", "articleId:", articleId, "lastModified:", lastModified);
		if (articleId !== undefined || lastModified !== undefined) {
			return articleId + "-" + new Date(lastModified).getTime();
		} else {
			return "-";
		}
	};

	// hook to make _private_ function init so to say ~public~ on construction time
	init(opts);
};

funky.BreakingNews.View = function ($elm, opts) {
	var options = {
		closeButtonCssClass: ".icon-close",
		articleLinkCssClass: ".breaking-news__article-link",
		menuContainerCssClass: ".header",
		mainContainerCssClass: ".main",
		pageContainerCssClass: ".page",
		breakingNewsInnContainerCssClass: ".breaking-news__inner-container",
		breakingNewsAnimateInCssClass: "breaking-news-animate-in",
		breakingNewsAnimateOutCssClass: "breaking-news-animate-out",
		breakingNewsAnimateInDuration: 500,
		breakingNewsAnimateOutDuration: 500,
		view: ""
	},
	    $container = null,
	    $innerContainer = null,
	    $menu = null,
	    $main = null,
	    $page = null,
	    $closeButton = null,
	    $articleLink = null,
	    windowWidth = null,
	    isVisible = false;

	// - private functions
	// use $.utils.isMobile or $.utils.isDesktop
	function getMenuHeight() {
		return $menu.height();
	}

	function getPageYOffset() {
		return $page.offset().top;
	}

	function getMainRightPos() {
		return $main.position().left + $main.width();
	}

	function init($elm, opts) {
		options = $.extend(options, opts);
		$container = $elm;
		$innerContainer = $elm.find(options.breakingNewsInnContainerCssClass);
		$closeButton = $elm.find(options.closeButtonCssClass);
		$menu = $(options.menuContainerCssClass);
		$main = $(options.mainContainerCssClass);
		$page = $(options.pageContainerCssClass);
		windowWidth = $(window).width();
	}

	// - privileged functions
	// update the container with the newest breaking news content
	this.update = function (newContent) {
		$innerContainer.html(newContent);
	};

	this.getCurrentContent = function () {
		return $innerContainer.html();
	};

	this.hideContainer = function () {
		$container.removeClass(options.breakingNewsAnimateInCssClass);
		$container.hide();
		isVisible = false;
	};

	this.showContainer = function () {
		if (options.view === "mobile" || windowWidth <= 1024) {
			$container.fadeIn(200);
		} else {
			$container.show();
			$container.addClass(options.breakingNewsAnimateInCssClass);
		}
		isVisible = true;
	};

	this.animateContainerOut = function () {
		$container.removeClass(options.breakingNewsAnimateInCssClass);
		$container.addClass(options.breakingNewsAnimateOutCssClass);
		isVisible = false;
		setTimeout(function () {
			$container.hide();
			$container.removeClass(options.breakingNewsAnimateOutCssClass);
		}, options.breakingNewsAnimateOutDuration);
	};

	this.getCurrentArticle = function () {
		var $currentArticle = $container.find("[data-art-id][data-art-lmd]").first();
		return $currentArticle;
	};

	this.getCloseButton = function () {
		return $closeButton;
	};

	/**
  * need to look any call time, 'cause the content of inner-container changes
  * @returns jQuery-Object
  */
	this.getArticleLink = function () {
		console.dir("getArticleLink", "$articleLink", $container.find(options.articleLinkCssClass));
		return $container.find(options.articleLinkCssClass);
	};

	this.isVisible = function () {
		return isVisible === true;
	};

	this.getContainer = function () {
		return $container;
	};

	this.getInnerContainer = function () {
		return $innerContainer;
	};

	this.getOptions = function () {
		return options;
	};

	// hook to make _private_ function init so to say ~public~ on construction time
	init($elm, opts);
};

funky.BreakingNews.Controller = function ($elm, opts) {

	var options = {
		updateInterval: 2 * 60 * 1000 // 2 minutes
	},
	    model = null,
	    view = null;

	// - private functions
	// event handler
	function initEventHandler() {
		view.getCloseButton().on("click", onCloseButtonClickHandler);
		view.getInnerContainer().on("click", onInnerContainerClickHandler);
		view.getContainer().one("click", view.getOptions().articleLinkCssClass, trackClick);
	}

	function onCloseButtonClickHandler(e) {
		e.preventDefault();
		view.animateContainerOut();
		// save the articleMarker in model
		var $currentArticle = view.getCurrentArticle();
		model.storeNewsAsDisabled($currentArticle.data("art-id"), $currentArticle.data("art-lmd"));
	}

	function onInnerContainerClickHandler(e) {
		e.preventDefault();
		e.stopPropagation();
		// save the articleMarker in model
		var $currentArticle = view.getCurrentArticle();
		model.storeNewsAsDisabled($currentArticle.data("art-id"), $currentArticle.data("art-lmd"));
		console.dir(view.getArticleLink());
		window.location.href = view.getArticleLink().attr("href");
	}

	function getMarkerFromCurrentArticle() {
		var $currentArticle = view.getCurrentArticle();
		console.log("getting marker from current article:", model.getArticleMarker($currentArticle.data("art-id"), $currentArticle.data("art-lmd")));
		return model.getArticleMarker($currentArticle.data("art-id"), $currentArticle.data("art-lmd"));
	}

	function getMarkerFromAjaxString(data) {
		var dataHtml = $(data);
		console.log("getting marker from ajax string:", model.getArticleMarker(dataHtml.data("art-id"), dataHtml.data("art-lmd")));
		return model.getArticleMarker(dataHtml.data("art-id"), dataHtml.data("art-lmd"));
	}

	function compareCurrentLocationWithArticleId() {
		var currentLocation = window.location.href;
		if (currentLocation.indexOf("-id") > -1) {
			var $currentArticle = view.getCurrentArticle(),
			    currentLocationArticleId = parseInt(currentLocation.match(new RegExp(/\d+(?!.*-)/)), 10);
			if (currentLocationArticleId === $currentArticle.data("art-id")) {
				model.storeNewsAsDisabled($currentArticle.data("art-id"), $currentArticle.data("art-lmd"));
			}
		}
	}

	function update(updateType) {
		$.get(model.getWidgetUpdateUri()).done(function (data, textStatus, $xhr) {
			console.dir("updating");
			var currentArticle = view.getCurrentArticle();
			console.log("current article: ", currentArticle);
			console.log("not disabled: ", !model.newsIsDisabled(currentArticle.data("art-id"), currentArticle.data("art-lmd")));
			console.log("is visible: ", view.isVisible());
			data = data.replace(/\s?\/\>/g, ">");
			if (data !== "") {
				if (getMarkerFromCurrentArticle() !== getMarkerFromAjaxString(data)) {
					if (view.isVisible()) {
						view.hideContainer();
					}
					view.update(data);
					var $currentArticle = view.getCurrentArticle();
					compareCurrentLocationWithArticleId();
					if (!model.newsIsDisabled($currentArticle.data("art-id"), $currentArticle.data("art-lmd"))) {
						view.showContainer();
					}
				}
			} else {
				if (view.isVisible()) {
					view.hideContainer();
				}
			}
			if (updateType === "init" && view.isVisible()) {
				trackVisible();
			}
		}).fail(function () {
			window.console.error(arguments);
		}).done(function () {
			triggerNextUpdate();
		});
	}

	function triggerNextUpdate() {
		window.setTimeout(update, options.updateInterval);
	}

	function trackVisible() {
		if (window.dataLayer) {
			window.dataLayer.push({
				"event": "news_toast",
				"toast_action": "news_toast_view"
			});
		}
	}

	function trackClick() {
		if (window.dataLayer) {
			window.dataLayer.push({
				"event": "news_toast",
				"toast_action": "news_toast_klick"
			});
		}
	}

	function init($elm, opts) {
		options = $.extend(options, opts);

		if (typeof options.widgetUrl === "undefined") {
			options.widgetUrl = $elm.data("breaking-news-url");
		}
		if (typeof options.widgetUrl === "undefined") {
			throw "options.widgetUrl is missing. Aborting!";
		}
		model = new funky.BreakingNews.Model(options);
		view = new funky.BreakingNews.View($elm, options);

		initEventHandler();
		update("init");
	}

	// hook to make _private_ function init so to say ~public~ on construction time
	init($elm, opts);
};

$.fn.breakingNews = function (opts) {
	return this.each(function () {
		new funky.BreakingNews.Controller($(this), opts);
	});
};

/* globals self, invokePi, invokeAi */
/*
 Implementation of the Load More Content by with ajax
 This Snippet load more content at the bottom of the page.

 Author: Peter Marhewka
 */

function ChipLoadMore(rootNode, opts) {
	this.rootNode = rootNode;
	var that = this;
	/*console.log("ChipLoadMore Funktion ist in noch auskommentiert. Die Funktion ist hart gecoded. ToDo: umstellen. OPTS: " + opts.loadMore);*/

	function getCountingHash() {
		var counter = 0;
		if (self.location.hash !== "") {
			counter = parseInt(self.location.hash.substring(self.location.hash.lastIndexOf("-") + 1), 10);
		}
		return "read-more-" + (counter + 1);
	}

	jQuery(this.rootNode).on("click", function (e) {
		e.preventDefault();

		function checkWindow() {
			var currentWindowHeight = jQuery("body").height();
			// console.log(windowHeight, "<", currentWindowHeight)
			if (parseInt(windowHeight, 10) < parseInt(currentWindowHeight, 10)) {
				stopWindow();
			}

			windowHeight = jQuery("body").height();
		}

		function stopWindow() {
			jQuery(that.rootNode).text("Mehr laden").removeClass("loading");
			clearInterval(checkWindowHeight);
		}

		this.rootNode = rootNode;
		if (opts.loadMore === "stream") {
			jQuery(that.rootNode).text("wird geladen");
			var ajaxUrl = jQuery(".recharge-ajax-url").last().data("url");
			if (ajaxUrl) {
				jQuery.get(ajaxUrl, function (data) {
					jQuery(this).remove();
					jQuery(".container-main").last().find(".container-stream").append(data);
				}).done(function () {
					self.location.hash = getCountingHash();
					jQuery(document).trigger("ready");
					jQuery(document).trigger("page.ready");
					jQuery(window).trigger("load");
					invokePi();
					invokeAi();
				});
			}

			/* Loader Animation Function */

			jQuery(that.rootNode).text("wird geladen").addClass("loading");

			var windowHeight = jQuery("body").height(),
			    checkWindowHeight = setInterval(function () {
				checkWindow();
			}, 500);

			setTimeout(function () {
				stopWindow();
			}, 10000);
		}
	});
}

jQuery.fn.chipLoadMore = function (opts) {
	return this.each(function () {
		new ChipLoadMore(this, opts);
	});
};

function Calendar(rootNode) {
	var that = this;

	this.rootNode = rootNode;

	$(rootNode).on("click", ".calendar__control", function (e) {
		e.preventDefault();
		var url = $(this).data("ajax-url");

		that.replaceCalendar(that.rootNode, url);
	});
}

Calendar.prototype.replaceCalendar = function (calendar, url) {

	var request = $.ajax({
		url: url
	});

	request.done(function (data, textStatus, jqXHR) {
		var $html = $(data).html();
		$(calendar).html($html);
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
		console.error("$.fn.calendar ajax request failed", calendar, jqXHR, textStatus, errorThrown);
	});
};

$.fn.calendar = function () {
	return this.each(function () {
		new Calendar(this);
	});
};
/*jslint evil: true */
/* globals Swiper, ga */

function CarouselAjax(rootNode, opts) {
	this.rootNode = rootNode;
	this.$rootNode = jQuery(this.rootNode);

	// EXPAND OPTS
	this.ajax = opts.ajax;
	this.autoplay = opts.autoplay;
	this.autoplayDuration = opts.autoplayDuration;
	/* Autoplay time integer / if not defined no Autoplay */
	this.centeredSlides = opts.centeredSlides;
	this.cube = opts.cube;
	this.countPrefix = opts.countPrefix || "";
	this.countSplitter = opts.countSplitter || "/";
	this.direction = opts.direction;
	this.loop = opts.loop;
	this.mousewheelControl = opts.mousewheelControl;
	this.paginationType = opts.paginationType;
	this.pageCount = opts.pageCount;
	/* true / false / undefined */
	this.slidesPerView = opts.slidesPerView;
	this.spaceBetween = opts.spaceBetween;
	this.start = opts.start;
	this.initialSlide = opts.initialSlide;
	/* Start slide integer */
	this.slidesPerColumn = opts.slidesPerColumn;
	this.view = opts.view;
	this.watchSlidesVisibility = true;
	this.paginationOnImageBottom = opts.paginationOnImageBottom;
	this.dfpGalleryAds = opts.dfpGalleryAds;
	this.dfpGlobalAdRefresh = opts.dfpGlobalAdRefresh;
	this.outbrainRecommendationsOnendEnabled = opts.outbrainRecommendationsOnendEnabled;
	this.preloadImages = opts.preloadImages || false;
	this.updateOnImagesReady = opts.updateOnImagesReady || false;

	if (this.slidesPerView !== 1) {
		this.autoHeight = false;
	} else {
		this.autoHeight = true;
	}

	if (this.autoplay !== true) {
		this.autoplayDuration = 0;
	}

	// Develop
	// this.slidesPerGroup = 2;

	this.setupSwiper();
	this.count = 2;
}

// SETUP SWIPER

CarouselAjax.prototype.setupSwiper = function () {
	var that = this,
	    swiperInstanceId = that.$rootNode.attr("id"),
	    paginationClass = ".swiper-pagination-" + swiperInstanceId,
	    nextClass = ".swiper-button-next-" + swiperInstanceId,
	    prevClass = ".swiper-button-prev-" + swiperInstanceId;

	if (that.slidesPerView > 1) {
		that.$rootNode.addClass("multi-columns");
	}

	if (that.slidesPerView === 3 && that.view === "mobile") {
		that.slidesPerView = 1;
		that.start = 1;
	}

	if (that.slidesPerView === 2 && that.view === "mobile" && that.cube === false && that.ajax === false) {
		that.slidesPerView = 2;
		that.start = 1;
	}

	if (that.view === "desktop" || that.view === "mobile" && that.cube === false) {
		that.swiperInstance = new Swiper(that.rootNode, {
			nextButton: nextClass,
			pagination: paginationClass,
			paginationType: that.paginationType,
			prevButton: prevClass,
			preloadImages: that.preloadImages,
			updateOnImagesReady: that.updateOnImagesReady,
			lazyLoading: true,
			lazyLoadingInPrevNext: true,
			lazyLoadingInPrevNextAmount: 2,
			lazyLoadingOnTransitionStart: true,
			paginationClickable: true,
			spaceBetween: that.spaceBetween,
			slidesPerView: that.slidesPerView,
			slidesPerColumn: that.slidesPerColumn,
			slidesPerGroup: that.slidesPerGroup,
			watchSlidesVisibility: that.watchSlidesVisibility,
			autoplay: that.autoplayDuration,
			direction: that.direction,
			initialSlide: that.initialSlide,
			grabCursor: true,
			loop: that.loop,
			mousewheelControl: that.mousewheelControl,
			roundLengths: true,
			autoHeight: that.autoHeight,
			paginationOnImageBottom: false,
			zoom: false,
			runCallbacksOnInit: true
		});
		// console.log("that.preloadImages",that.preloadImages);
	}

	if (that.view === "mobile" && that.cube === true) {
		that.swiperInstance = new Swiper(that.rootNode, {
			effect: "cube",
			cube: {
				shadow: false,
				slideShadows: false,
				shadowOffset: 0,
				shadowScale: 0
			},
			lazyLoading: false,
			lazyLoadingInPrevNext: false,
			lazyLoadingInPrevNextAmount: 2,
			lazyLoadingOnTransitionStart: false,
			pagination: paginationClass,
			preloadImages: true,
			paginationType: that.paginationType,
			paginationClickable: true,
			setWrapperSize: false,
			watchSlidesVisibility: that.watchSlidesVisibility,
			autoplay: that.autoplayDuration,
			grabCursor: true,
			loop: that.loop,
			autoHeight: false,
			paginationOnImageBottom: false,
			runCallbacksOnInit: true
		});
	}

	// pagecount manipulation:
	// GPT Ads and Outbrain Recommendations don't appear as separate slides for the user, only for the swiper's logic
	if (that.view === "mobile" || that.view === "desktop") {
		that.gptAdCount = that.$rootNode.find(".swiper-slide-ad").not(".swiper-slide-duplicate").length;
		that.outbrainAdCount = that.$rootNode.find(".swiper-slide-outbrain").not(".swiper-slide-duplicate").length;
		that.imageCount = that.$rootNode.find(".swiper-pagination").find(".swiper-pagination-bullet").length;
		that.imageCountSubAdCount = that.imageCount - that.gptAdCount - that.outbrainAdCount;

		// set up the data-swiper-slide-index attribute, starting by 1
		// the ad slides and outbrain slides will get the slideIndexes from the previous slides
		var adOrOutbrainSlideCount = 0;
		that.$rootNode.find(".swiper-slide").not(".swiper-slide-duplicate").each(function (idx) {
			var $this = jQuery(this);

			if ($this.hasClass("swiper-slide-ad") || $this.hasClass("swiper-slide-outbrain")) {
				adOrOutbrainSlideCount++;
			}
			$this.attr("data-swiper-slide-index", idx + 1 - adOrOutbrainSlideCount);
		});

		// what this basically does:
		// if loop is enabled, index of the first regular slide will be copied to the duplicate right slide,
		// and the index of the last regular slide will be copied to the duplicate left slide
		if (that.loop) {
			that.$rootNode.find(".swiper-slide:first-child").attr("data-swiper-slide-index", that.imageCountSubAdCount);
			that.$rootNode.find(".swiper-slide:last-child").attr("data-swiper-slide-index", 1);
		}

		if (!that.$rootNode.hasClass("container-leader")) {
			if (!that.$rootNode.find(".swiper-pagecount").length && that.pageCount !== false) {
				that.$rootNode.append("<div class=\"swiper-pagecount\">" + that.countPrefix + " 1 " + that.countSplitter + " " + that.imageCountSubAdCount + "</div>");
			}
		}
	}

	that.setDataImageHeight();

	if (that.$rootNode.parent().hasClass("inline-block--right-25") || that.$rootNode.parent().hasClass("inline-block--right") || that.$rootNode.parent().hasClass("inline-block--left-25") || that.$rootNode.parent().hasClass("inline-block--left")) {
		that.$rootNode.find(".swiper-slide-ad").remove();
		that.swiperInstance.update();
	}

	that.$rootNode.addClass("swiper-loaded");

	that.swiperTransitions(that.swiperInstance);
};

// SWIPER TRANSITIONS

CarouselAjax.prototype.swiperTransitions = function () {
	var that = this,
	    swiperWidth = that.$rootNode.width();

	that.currentSlideId = that.$rootNode.find(".swiper-slide-visible").attr("data-hash");

	// Autoplay Swiper
	try {
		if (that.autoplay === true) {
			that.swiperInstance.startAutoplay();
		} else {
			that.swiperInstance.stopAutoplay();
		}
	} catch (err) {
		window.console.log(err.message);
	}

	// ######## CALLBACKS ########

	// Get swipe direction
	that.swiperInstance.on("onSlideNextStart", function () {
		that.swipeTo = "next";
		// window.console.log("SWIPE NEXT");
	});

	that.swiperInstance.on("onSlidePrevStart", function () {
		that.swipeTo = "prev";
		// window.console.log("SWIPE Prev Start");
	});

	// Transition Start
	that.swiperInstance.on("onTransitionStart", function () {
		var slideCount = that.$rootNode.find(".swiper-slide-visible").attr("data-swiper-slide-index");
		that.$rootNode.find(".swiper-pagecount").text(that.countPrefix + " " + slideCount + " " + that.countSplitter + " " + that.imageCountSubAdCount);

		that.arrowPosition();
	});

	// TRACKING
	// Transition End
	that.swiperInstance.on("onTransitionEnd", function () {
		that.currentSlideId = that.$rootNode.find(".swiper-slide-visible").attr("data-hash");

		try {
			var link = that.$rootNode.find(".swiper-slide-visible").find("img").attr("srcset"),
			    slideindex = that.$rootNode.find(".swiper-slide-visible").data("swiper-slide-index");

			// srcset fix for IE (FDC-1532)
			if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || navigator.userAgent.indexOf("Safari") > -1) {
				var imageElement = that.$rootNode.find(".swiper-slide-visible").find("img");

				if (imageElement.attr("src").indexOf("/placeholder.png") >= 0) {
					var srcElement = link.substr(0, link.lastIndexOf(" "));
					srcElement = srcElement.substr(srcElement.lastIndexOf(" ") + 1, srcElement.length);
					imageElement.attr("src", srcElement);
				}
			}

			ga("send", "event", "Bildergalerie - Bild - " + that.view + ", swipe", link);
			that.ivwTracking();
			that.reloadAds();

			window.dataLayer.push({
				"event": "galleryclick",
				"bildCount": slideindex
			});
			// window.console.log("transistion ended index" + slideindex);
		} catch (err) {}
		// window.console.log("Google Analytics integrieren: " + err.message);


		// Set Current Slide Id to Slider and Trigger data-current-slide function in pin-it.js (BDF only) Function for Pinterest

		try {
			that.$rootNode.attr("data-current-slide", that.currentSlideId);
			jQuery(document).trigger("data-current-slide");
		} catch (err) {
			window.console.log("There is no data-current-slide function: " + err.message);
		}

		// #### Refresh Ads use Widget settings ####
		if (that.dfpGalleryAds !== 0) {
			that.adsGalleryReload();
			// window.console.log("dfpGalleryAds Running");
		}

		if (that.dfpGlobalAdRefresh !== false) {
			that.adsGlobalReload();
			// window.console.log("adsGlobalReload Running");
		}
	});

	that.swiperInstance.on("onLazyImageReady", function () {
		that.swiperInstance.update();
		that.arrowPosition();
		// window.console.log("Image was loaded");
	});

	// Reinit Swiper Setup if Swiper width change before window load.
	var refreshIntervalSwiperWidth = setInterval(function () {
		// window.console.log("Swiper run Interval SwiperWidth", swiperWidth, "!==", that.$rootNode.width());
		if (swiperWidth !== that.$rootNode.width()) {
			// window.console.log("#### Swiper Resize SwiperWidth ####");
			that.setupSwiper();
			that.swiperInstance.update();
			swiperWidth = that.$rootNode.width();
		}
	}, 1000);

	jQuery(window).on("load", function () {
		clearInterval(refreshIntervalSwiperWidth);
	});
};

/**
 * Set min-height for each image in relation to rootNode width
 */
CarouselAjax.prototype.setDataImageHeight = function () {
	var that = this,
	    slideElements = that.$rootNode.find(".swiper-slide"),
	    slideElementLength = slideElements.length;

	slideElements.each(function (idx, slideElem) {
		var $slideElem = jQuery(slideElem),
		    style = window.getComputedStyle(slideElem),
		    padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

		slideElem.slideWidth = parseFloat(style.width) - padding;
		slideElem.imageWidth = parseInt($slideElem.find("img").attr("width"), 10);
		slideElem.imageHeight = parseInt($slideElem.find("img").attr("height"), 10);

		// window.console.log(slideElem.slideWidth, slideElem.imageWidth, slideElem.imageHeight);

		// Landscape & Portrait image Ratio
		if (slideElem.imageWidth > slideElem.imageHeight) {
			slideElem.ratio = slideElem.imageWidth / slideElem.imageHeight;
			slideElem.maxWidth = "100%";
		} else {
			slideElem.ratio = slideElem.imageHeight / slideElem.imageWidth;
			slideElem.maxWidth = Math.round(slideElem.slideWidth / slideElem.ratio, 10) + "px";
		}

		slideElem.imageNewHeight = Math.round(slideElem.slideWidth / slideElem.ratio, 10);
		// window.console.log("RATIO", that.$rootNode.attr("id"), slideElem.slideWidth, slideElem.ratio, slideElem.imageNewHeight);

		$slideElem.find("img").css({
			minHeight: slideElem.imageNewHeight + "px",
			maxWidth: slideElem.maxWidth
		});

		if (!isNaN(slideElem.imageNewHeight)) {
			$slideElem.attr("data-image-height", slideElem.imageNewHeight);
		}

		if (idx === slideElementLength - 1) {
			that.arrowPosition();
		}
	});
};

CarouselAjax.prototype.adsGalleryReload = function () {
	var that = this;

	if (that.$rootNode.find(".swiper-slide-visible").hasClass("swiper-slide-ad")) {
		var $swiperButtons = that.$rootNode.find(".swiper-buttons");

		// Disable Swiping for 1500ms wenn Werbung angezeigt wird
		that.swiperInstance.lockSwipes();
		$swiperButtons.css({ opacity: 0.25 });

		setTimeout(function () {
			that.swiperInstance.unlockSwipes();
			$swiperButtons.css({ opacity: "" });
		}, 1500);

		// Slide automatisch zum nächsten Slide wenn keine Werbung ausgespielt wird.
		// unlock swiper lock that.swiperInstance.unlockSwipes();

		if (that.$rootNode.find(".swiper-slide-visible .ad--marker-inner > div").attr("data-google-query-id") === undefined) {
			if (that.swipeTo === "next") {
				that.swiperInstance.unlockSwipes();
				$swiperButtons.css({ opacity: "" });
				that.swiperInstance.slideNext(false, 200);
			}

			if (that.swipeTo === "prev") {
				that.swiperInstance.unlockSwipes();
				$swiperButtons.css({ opacity: "" });
				that.swiperInstance.slidePrev(false, 200);
			}
		} else {
			that.$rootNode.find(".swiper-slide-visible").find(".ad--stroer").removeAttr("style");
			that.$rootNode.find(".swiper-slide-visible").find(".ad--marker-inner").removeAttr("style");
		}
	}

	// Find next of next or prev of prev Ad Container
	if (that.swipeTo === "next") {
		that.adRefresh = that.$rootNode.find(".swiper-slide-" + that.swipeTo).next();
	} else {
		that.adRefresh = that.$rootNode.find(".swiper-slide-" + that.swipeTo).prev();
	}

	if (that.adRefresh.hasClass("swiper-slide-ad")) {
		// Trigger adRefresh in jsp
		// In der jsp wird eine Javascript Variable mit Funktion genneriert. Der folgende Code ruft diese Variable auf und triggert damit den Refresh bzw. initialisiert das Ad.

		var adRefreshString = that.adRefresh.attr("data-adrefresh"),
		    adRefresh = eval(adRefreshString);

		// Ad Container initialize

		try {
			if (!that.adRefresh.hasClass("swiper-slide-ad-loaded")) {
				adRefresh();
				that.adRefresh.addClass("swiper-slide-ad-loaded");
			}

			if (that.adRefresh.find(".ad--marker").length && that.adRefresh.find(".ad--marker").attr("style") && that.adRefresh.find(".ad--marker").attr("style").indexOf("display") !== -1) {
				if (!that.adRefresh.hasClass) {
					adRefresh();
					that.adRefresh.find(".ad--marker").removeAttr("style");
					that.adRefresh.addClass("swiper-slide-ad-loaded");
				}
			}
		} catch (err) {
			window.console.log("There is a bug with ads: " + err.message);
		}
	}
};

CarouselAjax.prototype.adsGlobalReload = function () {
	var that = this;

	that.gptAdCount = that.$rootNode.find(".swiper-slide-ad").length;

	if (that.globalRandomCounter === undefined) {
		that.globalRandomCounter = 1;
	} else {
		that.globalRandomCounter = that.globalRandomCounter + 1;
	}

	try {
		// Global Ad randomRefresh "var gptAdSlots = [] definiert in stroer_define.jsp.
		// Der Random Refresh wird nur alle adRandomRefreshAfter ausgeführ und nur auf ein random Banner
		// Refresh random globalAd Slot each from Widget Slides
		// Refresh Superbanner and Skyscraper if one of them start refresh

		var globalAdRandomRefresh = Math.floor(Math.random() * that.gptAdSlots);

		if (that.globalRandomCounter >= that.dfpGlobalAdRefresh) {
			that.gptAdSlots = window.gptAdSlots.length;

			if (that.dfpGlobalAdRefresh !== false && that.autoplay === false && !isNaN(globalAdRandomRefresh)) {
				if (globalAdRandomRefresh === 0) {
					if (!jQuery("#omsv_sky_DhtmlLayer").length) {
						window.adRefresh(globalAdRandomRefresh);
						window.adRefresh(1);
						window.console.log("Fire refresh global Ad Slot", globalAdRandomRefresh, 1);
					} else {
						jQuery("#oms_gpt_skyscraper").css({ display: "none" });
					}
				} else if (globalAdRandomRefresh === 1) {
					if (!jQuery("#omsv_sky_DhtmlLayer").length) {
						window.adRefresh(globalAdRandomRefresh);
						window.adRefresh(0);
						window.console.log("Fire refresh global Ad Slot", globalAdRandomRefresh, 0);
					} else {
						jQuery("#oms_gpt_skyscraper").css({ display: "none" });
					}
				} else {
					window.adRefresh(globalAdRandomRefresh);
					window.console.log("Fire refresh global Ad Slot", globalAdRandomRefresh);
				}
				that.globalRandomCounter = undefined;
			}
		}
	} catch (err) {
		window.console.log("There is a bug with ads: " + err.message);
	}
};

/**
 * calculates and defines the arrow position. the arrows are intended to be positioned in the vertical middle of the *image*,
 * as opposed to the vertical middle of the whole slide. the whole slide could contain a caption in addition to the image.
 *
 * - if the currently active slide contains a dfp ad or outbrain recommendations, all css styles are removed
 * - else the currently active's slide's image height will be considered
 */
CarouselAjax.prototype.arrowPosition = function () {
	var that = this,
	    $swiperButtons = that.$rootNode.find(".swiper-buttons");

	if (that.slidesPerView === 1) {
		var $activeSlide = that.$rootNode.find(".swiper-slide-visible"),
		    $buttonNext = that.$rootNode.find(".swiper-button-next");

		if ($activeSlide.hasClass("swiper-slide-ad") || $activeSlide.hasClass("swiper-slide-outbrain")) {
			$swiperButtons.removeAttr("style");
		} else {
			var top = parseInt($activeSlide.attr("data-image-height"), 10) / 2 - $buttonNext.height() / 2;
			$swiperButtons.css({
				top: Math.round(top, 10)
			});
		}
	} else {
		$swiperButtons.removeAttr("style");
	}
};

CarouselAjax.prototype.paginationPosition = function () {
	var that = this;

	if (that.paginationOnImageBottom) {
		var activeImageHeight = parseInt(that.$rootNode.find(".swiper-slide-visible").find("img").height(), 10),
		    activeImageWidth = parseInt(that.$rootNode.find(".swiper-slide-visible").find("img").width(), 10),
		    pagination = that.$rootNode.find(".swiper-pagination"),
		    paginationHeight = parseInt(pagination.height(), 10);

		pagination.css({
			top: activeImageHeight - paginationHeight,
			bottom: "inherit",
			maxWidth: activeImageWidth
		});

		if (activeImageHeight === 0 || activeImageHeight < 0) {
			pagination.removeAttr("style");
		}
	}
};

CarouselAjax.prototype.reloadAds = function () {
	var that = this,
	    changeAfter = 5;

	if (that.count === changeAfter) {
		that.count = 0;
		// Asmi
		window.sas_callAds();
		// window.console.log("AdCounter, " + that.count);
	}

	that.count = that.count + 1;
};

CarouselAjax.prototype.ivwTracking = function () {
	// console.log("invokePi()", typeof(window.countIVW));
	if (typeof window.countIVW === "function") {
		try {
			// window.console.log("will call");
			window.countIVW();
		} catch (exp) {
			// window.console.log("Error invoking page impression: ", exp);
		}
	}
};

jQuery.fn.carouselAjax = function (opts) {
	return this.each(function () {
		new CarouselAjax(this, opts);
	});
};

function initCarousels() {
	jQuery(".carousel-ajax").each(function () {
		var $this = jQuery(this);
		if (!$this.hasClass("swiper-loaded")) {
			$this.carouselAjax($this.data("options"));
		}
	});
}

jQuery(document).ready(initCarousels).ajaxStop(initCarousels);

/* global Hammer, window */

function Carousel(rootNode, opts) {
	this.rootNode = rootNode;
	this.index = 0;
	this.length = jQuery(".carousel__item", this.rootNode).length;
	this.$list = jQuery(".carousel__list", this.rootNode);
	this.$items = jQuery(".carousel__item", this.rootNode);
	this.$index = jQuery(".carousel__index", this.rootNode);
	this.isTripple = jQuery(this.rootNode).data("carousel-type") === "tripple";
	this.enableTracking = opts.enableTracking;
	this.afterRotateCallback = opts.afterRotateCallback;

	this.resize();
	this.orderElements();
	this.resizePortraitImages();
	this.bindEvents();
}

Carousel.prototype.rotateDone = function () {
	if (typeof this.afterRotateCallback === "function") {
		this.afterRotateCallback();
	}
};

Carousel.prototype.refreshList = function () {
	this.$items = jQuery(".carousel__item", this.rootNode);
};

Carousel.prototype.getIndex = function () {
	return this.index;
};

Carousel.prototype.bindEvents = function () {
	var that = this,
	    hammertime = new Hammer(this.rootNode);

	function isIndexInRange(index) {
		return index >= 0 && index <= that.length - 1;
	}

	jQuery(window).on("resize load", function () {
		that.resize();
	});

	jQuery(window).on("refreshList", function () {
		window.console.log("refreshList");
		that.refreshList();
	});

	// touch events
	hammertime.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 5, velocity: 0.3 });

	hammertime.on("swiperight", function (e) {
		e.preventDefault();
		if (isIndexInRange(that.index - 1)) {
			that.rotate(that.index -= 1);
		}
		that.track();
		window.dataLayer.push({
			"event": "galleryswipe",
			"bildCount": that.index
		});
	});

	hammertime.on("swipeleft", function (e) {
		e.preventDefault();
		if (isIndexInRange(that.index + 1)) {
			that.rotate(that.index += 1);
		}
		that.track();
		window.dataLayer.push({
			"event": "galleryswipe",
			"bildCount": that.index
		});
	});

	// click events
	jQuery(this.rootNode).on("click", ".carousel__control--prev", function (e) {
		e.preventDefault();
		if (isIndexInRange(that.index - 1)) {
			that.rotate(that.index -= 1);
		}
		that.track();
		window.dataLayer.push({
			"event": "galleryclick",
			"bildCount": that.index
		});
	}).on("click", ".carousel__control--next", function (e) {
		e.preventDefault();
		if (isIndexInRange(that.index + 1)) {
			that.rotate(that.index += 1);
		}
		that.track();
		window.dataLayer.push({
			"event": "galleryclick",
			"bildCount": that.index
		});
	});
};

Carousel.prototype.track = function () {
	if (this.enableTracking) {
		if (typeof window.countIVW === "function") {
			window.countIVW();
		}
		if (typeof window.countAT === "function") {
			window.countAT();
		}
	}
};

Carousel.prototype.resize = function () {
	var $currentSlide = jQuery(this.$items[this.index]).children(":first-child");

	this.$list.stop(true, true).animate({
		height: $currentSlide.height() || "100px"
	});
};

var mobileWidth = 767;

Carousel.prototype.orderElements = function (newIndex) {

	if (this.isTripple && jQuery.utils.isDesktop()) {
		this.$items.removeClass("carousel__item--prev carousel__item--center carousel__item--next carousel__item--next-after carousel__item--prev-after");
		this.$items.eq(0).addClass("carousel__item--prev");
		this.$items.eq(1).addClass("carousel__item--center");
		this.$items.eq(2).addClass("carousel__item--next");
		this.$items.eq(3).addClass("carousel__item--next-after");
		jQuery(this.rootNode).find(".carousel__positions .carousel__index:nth-last-child(2)").css("display", "none");
		jQuery(this.rootNode).find(".carousel__positions .carousel__index:nth-last-child(1)").css("display", "none");
		jQuery(this.rootNode).find(".carousel__controls .carousel__control--prev").css("display", "none");
	}
};

Carousel.prototype.rotate = function (newIndex) {

	function getIndex(index, length) {
		if (index === -2) {
			return length - 2;
		} else if (index < 0) {
			return length - 1;
		} else if (index === length) {
			return 0;
		} else if (index > length) {
			return 1;
		} else {
			return index;
		}
	}

	this.resize();

	if (this.isTripple && jQuery.utils.isDesktop()) {
		jQuery(this.rootNode).find(".carousel__controls .carousel__control--prev").removeAttr("style");
		if (newIndex + 3 <= this.length) {
			this.$items.removeClass("carousel__item--prev carousel__item--center carousel__item--next carousel__item--next-after carousel__item--prev-after").eq(getIndex(newIndex - 1, this.length)).addClass("carousel__item--prev-after").end().eq(getIndex(newIndex + 1, this.length)).addClass("carousel__item--center").end().eq(newIndex).addClass("carousel__item--prev").end().eq(getIndex(newIndex + 2, this.length)).addClass("carousel__item--next").removeClass("carousel__item--center").end().eq(getIndex(newIndex + 3, this.length)).addClass("carousel__item--next-after").removeClass("carousel__item--next").end();
		}

		if (newIndex + 3 === this.length) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--next").css("display", "none");
		}

		if (newIndex + 3 < this.length) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--next").removeAttr("style");
		}

		if (newIndex === 0) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--prev").css("display", "none");
		}
	} else {
		this.$items.removeClass("carousel__item--prev carousel__item--center carousel__item--next carousel__item--next-after carousel__item--prev-after").eq(getIndex(newIndex - 1, this.length)).addClass("carousel__item--prev").end().eq(getIndex(newIndex + 1, this.length)).addClass("carousel__item--next").end().eq(newIndex).addClass("carousel__item--center").end().eq(getIndex(newIndex + 2, this.length)).addClass("carousel__item--next-after").removeClass("carousel__item--next").end().eq(getIndex(newIndex - 2, this.length)).addClass("carousel__item--prev-after").removeClass("carousel__item--prev");

		if (newIndex + 1 === this.length) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--next").css("display", "none");
		}

		if (newIndex + 1 < this.length) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--next").removeAttr("style");
		}

		if (newIndex === 0) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--prev").css("display", "none");
		}
		if (newIndex !== 0) {
			jQuery(this.rootNode).find(".carousel__controls .carousel__control--prev").removeAttr("style");
		}
	}

	this.$index.removeClass("carousel__index--active").eq(newIndex).addClass("carousel__index--active");

	this.rotateDone();
};

Carousel.prototype.resizePortraitImages = function () {
	var that = this;
	jQuery(window).on("load", function () {
		var landscapeHeight;
		jQuery(".carousel__item", that.rootNode).css("display", "block");
		landscapeHeight = jQuery(that.rootNode).find(".medialandscape").find("img").height();
		jQuery(".carousel__item", that.rootNode).removeAttr("style");
		jQuery(that.rootNode).find(".mediaportrait").find("img").height(landscapeHeight);
	});
};

jQuery.fn.carousel = function (options) {
	return this.each(function () {
		var opts = jQuery.extend({
			"enableTracking": false
		}, options);

		if (!$.data(this, "carousel")) {
			$.data(this, "carousel", new Carousel(this, opts));
		}
	});
};

function CommentsDisqus(rootNode, opts) {
	console.log(rootNode);
	this.rootNode = rootNode;
	this.setupButton(opts);
}

CommentsDisqus.prototype.setupButton = function (opts) {
	var that = this,
	    gProtocol = jQuery(location).attr("protocol"),
	    gHostname = jQuery(location).attr("hostname"),
	    gPathname = jQuery(location).attr("pathname"),
	    gSearch = jQuery(location).attr("search"),
	    // unused!
	pageUrl = gProtocol + "//" + gHostname + gPathname;
	console.log(pageUrl + "#disqus_thread");
	jQuery(this.rootNode).find(".showDisqus").html("<span class='disqus-comment-count' data-disqus-url='" + pageUrl + "'>0</span><span class='disqus-comment-button'>" + opts.buttonTextOpen + "</span>");
	that.bindEvents(opts);
};

CommentsDisqus.prototype.bindEvents = function (opts) {

	jQuery(this.rootNode).find(".showDisqus").on("click", function (e) {
		e.preventDefault();
		var loadBtn = jQuery(this);

		if (!loadBtn.hasClass("disabled")) {
			loadBtn.addClass("disabled");

			var disqusShortname = opts.publication,
			    articleIdentifier = opts.streamIdent;
			if (articleIdentifier !== "") {
				jQuery.globalEval("disqus_identifier = " + articleIdentifier + ";");
			}

			// ajax request to load the disqus javascript
			jQuery.ajax({
				type: "GET",
				url: "//" + disqusShortname + ".disqus.com/embed.js",
				dataType: "script",
				cache: true,
				async: true
			}).done(function () {
				jQuery("#disqus_thread").fadeIn();
				loadBtn.find(".disqus-comment-button").text(opts.buttonTextClose);
			}).fail(function () {
				loadBtn.after("<p class='error comments_error'>Sorry an error seems to have occurred attempting to load the comments, please try again later.</p>");
				loadBtn.removeClass("disabled");
			});
		}
		if (loadBtn.hasClass("disabled-close")) {
			jQuery("#disqus_thread").fadeIn();
			loadBtn.removeClass("disabled-close");
			loadBtn.find(".disqus-comment-button").text(opts.buttonTextClose);
		} else {
			jQuery("#disqus_thread").fadeOut();
			loadBtn.addClass("disabled-close");
			loadBtn.find(".disqus-comment-button").text(opts.buttonTextOpen);
		}
	});

	jQuery("body").append("<script id='dsq-count-scr' src='//" + opts.publication + ".disqus.com/count.js' async></script>");

	if (opts.open === true) {
		jQuery(this.rootNode).find(".showDisqus").trigger("click");
	}
};

jQuery.fn.commentsDisqus = function (opts) {

	return this.each(function () {
		new CommentsDisqus(this, opts);
	});
};

/* global Cookies, window, EventManager */
/* Common functionalities, like the usage of plugins
Author: Matthias Klebe
 */

// custom event manager instance to be used via jQuery $.getEventManager()
(function ($) {
	var eventManager = new EventManager();

	$.extend({
		getEventManager: function getEventManager() {
			return eventManager;
		}
	});
})(jQuery);

$(document).on("opened", ".remodal", function () {
	$(".remodal .carousel").resize();
});

window.sas_loadHandler = function (f) {
	console.log("sas_loadHandler: " + f.id + " = " + f.hasAd);

	if (f.hasAd) {
		$("#sas_" + f.id).closest(".ad--asmi").show();

		if ((window.parseInt(f.id) === 4458 || window.parseInt(f.id) === 4459) && $("#sas_" + f.id).height() > 350) {
			$(".hide-on-halfpage-ad").hide();
			$(".show-on-halfpage-ad").show();
		} else if ((window.parseInt(f.id) === 4458 || window.parseInt(f.id) === 4459) && $("#sas_" + f.id).height() <= 350) {
			$(".hide-on-halfpage-ad").show();
			$(".show-on-halfpage-ad").hide();
		}
	} else if (!f.hasAd) {
		$("#sas_" + f.id).closest(".ad--asmi").css({
			"height": 0,
			"overflow": "hidden"
		}).show();

		if (window.parseInt(f.id) === 4458 || window.parseInt(f.id) === 4459) {
			$(".hide-on-halfpage-ad").show();
		}
	}

	if (window.asmi_ads === undefined) {
		window.asmi_ads = {};
	}
	window.asmi_ads[f.id] = f.hasAd;

	$(window).trigger("asmi-returned-" + f.id);
};

// Reevaluate all picture-elements on the page with picturefill. Picturefill skips already processed
// elements.
$(document).ajaxComplete(function () {
	if (typeof window.picturefill === "function") {
		window.picturefill();
	}
});

window.openLayer = function (options, successCallback) {
	var $remodalInstance = null,
	    opts = $.extend({
		// "closeOnClick": true,	// TODO
		"data": null,
		"method": "GET",
		"hideCloseButton": false,
		"showMobileInline": false,
		"url": ""
	}, options);

	if (window.layerInterval) {
		clearInterval(window.layerInterval);
	}

	window.layerInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(window.layerInterval);
			performAjax();
		}
	}, 200);

	function performAjax() {
		$.ajax({
			"data": opts.data,
			"type": opts.method,
			"url": opts.url
		}).done(function (resp) {
			var anchorPos, $container, showInline, $closeButton, $content;

			showInline = opts.showMobileInline && !jQuery.utils.isDesktop();
			if (showInline) {
				$container = $("#inline-overlay");
			} else {
				$container = $("[data-remodal-id=modal]");
				$remodalInstance = $remodalInstance ? $remodalInstance : $container.remodal();
			}
			$closeButton = $container.find(".remodal-close");
			$content = $container.find(".remodal-content");

			if ($content.length < 1) {
				$content = $("<div>").addClass("remodal-content");
				$container.append($content);
				$container.append("<div data-remodal-action=\"close\" class=\"remodal-close\"></div>");
			}

			$content.html(resp);

			if (showInline) {
				// if open, close mobile menu
				var $menuButton = $(".nav-main-toggle");
				if ($menuButton.hasClass("nav-main-toggle--closed")) {
					$menuButton.click();
				}
			} else {
				$remodalInstance.open();
			}

			if (opts.hideCloseButton || showInline) {
				$closeButton.addClass("hidden");
			} else {
				$closeButton.removeClass("hidden");
			}

			if (typeof successCallback === "function") {
				successCallback($container);
			}
		}).fail(function () {
			console.log("Error while opening layer!");
		});
	}
};

// Close handler for LOGIN light box
window.closeLayer = function () {
	// lightbox / inline
	$("[data-remodal-id=modal]").find(".remodal-content").html("");

	var anchorPos = location.href.indexOf("#modal");
	if (anchorPos > 0) {
		location.href = location.href.substr(0, anchorPos);
	}

	// Inline:
	$("#inline-overlay").find(".remodal-content").html("");
};

// Close handler for NORMAL light box FUNE-2191
// Documentation: https://github.com/VodkaBears/remodal#events
$(document).on("closed", "[data-remodal-id=modal]", function () {
	$("[data-remodal-id=modal]").find(".remodal-content").html("");
});

$(document).on("click", ".collapsable .block-header", function (e) {
	if ($.utils.isMobile() || $(this).closest(".collapsable").hasClass("collapsable--desktop")) {
		e.preventDefault();
		$(this).closest(".collapsable").toggleClass("open");
	}
});

$(document).on("click", ".mediagalery__filters .active a", function (e) {
	e.preventDefault();
	$(this).closest(".mediagalery__filters__list").toggleClass("open");
});

$(document).on("click", ".tab-navigation .active a", function (e) {
	if ($.utils.isMobile()) {
		e.preventDefault();
		$(this).closest(".tab-navigation__list").toggleClass("open");
	}
});

$.getEventManager().on("picturefill", function () {
	window.picturefill();
});

// Load the content for the lightbox asynchronous.
$(document).on("click", "[data-remodal-target=modal]", function (e) {
	e.preventDefault();

	var $target = $(e.target),
	    url = $target.data("ajax-url"),
	    method = $target.data("ajax-method") || "GET";

	window.openLayer({ "method": method, "url": url });
});

// Open video in lightbox when clicking on special links.
$(document).on("click", "[data-open-target='lightbox']", function (e) {
	if (typeof window.videoLightbox === "function") {
		e.preventDefault();

		var $t = $(this),
		    mediaId = $t.data("video-article-id") || $t.data("gallery-article-id"),
		    shareUrl = $t.data("share-url") || $t.attr("href") || "";

		if ($t.data("video-article-id")) {
			window.videoLightbox(mediaId, shareUrl);
		} else if ($t.data("gallery-article-id")) {
			window.galleryLightbox(mediaId);
		}
	}
});

var animateHorizontal = function animateHorizontal(index, value) {
	var $t = $(value);
	$t.animate({ left: parseInt($t.css("left"), 10) === 0 ? "100%" : 0 });
};

/** @function
 *	slide Toggle for specified elements
 *	@param {string} data.slider.target.id
 *	@param {string} data.direction
 *
 */
$(document).on("click", "[data-slider]", function (e) {
	e.preventDefault();
	var $t = $(this),
	    $target,
	    targets = $t.data("slider-target-id").split(","),
	    toggleCallback = function toggleCallback() {
		$t.toggleClass("open");
	};
	for (var i = 0; i < targets.length; i++) {
		$target = $("[data-slider-id=" + targets[i] + "]");
		if ($t.data("slide-direction") === "horizontal") {
			$.each($target, animateHorizontal);
		} else {
			$target.slideToggle(toggleCallback);
		}
	}
});

/* Toggle single accordeon. */
$(document).on("click", "[data-toggle-self]", function (e) {
	var $pane = $(this).closest("[data-toggle-self-pane]");
	e.preventDefault();

	if (typeof $pane.attr("data-toggle-is-overlay") === "string" && !$pane.hasClass("open")) {
		$.getEventManager().fire("close-overlays", null, this);
	}

	$pane.toggleClass("open");
});

$(function () {
	$("[data-toggle-is-overlay]").each(function () {
		var $pane = $(this);
		$.getEventManager().on("close-overlays", function () {
			$pane.removeClass("open");
		}, this);
	});
});

// Facade for the Create-Cookie function
window.createCookie = function (name, value, days) {
	Cookies.set(name, value, { "expires": days, "path": "/" });
};

window.readCookieJson = function (name) {
	return Cookies.getJSON(name);
};

window.readCookie = function (name) {
	return Cookies.get(name);
};

window.eraseCookie = function (name) {
	Cookies.remove(name);
};

// Reload page without reopening the lightbox:
window.reloadPage = function () {
	var anchorPos = location.href.indexOf("#");

	if (anchorPos > 0) {
		location.href = location.href.substr(0, anchorPos);
	} else {
		location.reload();
	}
};

// Community plugin
$(function () {

	var urls = {
		commentPostUrl: "/template/framework/tools/post_comment.jsp",
		extLoginUrl: "/community-webservice/service/extloginuser/",
		passwordResetUrl: "/template/framework/tools/password_reset.jsp",
		registerUrl: "/template/framework/tools/register.jsp",
		urlLogin: "/community-webservice/service/login/",
		urlLogout: "/community-webservice/service/logout/"
	};

	// Constructor
	function Community(rootElement) {
		this.settings = $.extend({}, urls);
		this.$community = $(rootElement);
		this.$credentialForm = $(".community__credential-form", this.$community);
		this.$activationForm = $(".community__activation-form", this.$community);
		this.$loginForm = $(".community-login__form", this.$community);
		this.$loginMessage = $(".community__login-message", this.$community);
		this.$loginButton = $(".community-login__form__submit", this.$community);
		this.$loginError = $(".community__login-error", this.$community);
		this.$loginWrapper = $(".community__login-wrapper", this.$community);
		this.$activationContent = $(".community__activation-content", this.$community);
		this.$resetPasswordMessageTarget = $(".community__reset-password-message", this.$community);
		this.$registrationForm = $(".community__registration-form", this.$community);
		this.$registrationMessageTarget = $(".community__registration-message", this.$community);
		this.$forgotPasswordForm = $(".community__forgot-password-form", this.$community);
		this.$profileForm = $(".community__profile-form", this.$community);
		this.$profileMessageTarget = $(".community__profile-message", this.$community);
		this.$addResponseMessageTarget = $(".comment__ad-response-message", this.$community);
		this.$commentRoot = $(".community__comment-list--root", this.$community);
		this.unknownErrorMessage = "Es ist ein Fehler aufgetreten!";
		this.init();
	}

	$.extend(Community.prototype, {

		/**
   * Initialize community components
   */
		init: function init() {
			this.initCommentRespond();
			this.initReportComment();
			this.initShowProfile();
			this.initLogin();
			this.initLogout();
			this.initCharCounters();
			this.initResetPassword();
			this.initRegistration();
			this.initProfileUpdate();
			this.initPostComment();
			this.initToggleAnswers();
			this.initReadMore();
			this.getLoginForm();
			this.loadPage(1);
			if (this.$activationForm.length > 0) {
				this.getActivationContent();
			}
		},

		/**
   * Request the login form via Ajax and show it
   */
		getLoginForm: function getLoginForm() {
			var $target = this.$loginWrapper;
			jQuery.ajax({
				type: "POST",
				url: $target.data("login-status-url"),
				success: function success(html) {
					$target.html(html);
				}
			});
		},

		/**
   * Get and show the content of the community user activation
   */
		getActivationContent: function getActivationContent() {
			var that = this;
			jQuery.ajax({
				type: "POST",
				url: this.$activationForm.data("activation-url"),
				data: {
					activationCode: this.$activationForm.data("activation-code"),
					user_id: this.$activationForm.data("user-id")
				},
				success: function success(html) {
					that.$activationContent.html(html);
				}
			});
		},

		/**
   * Hide all currently shown error/success messages in the community
   */
		hideMessages: function hideMessages() {
			$(".error, .message", this.$community).hide();
		},

		/**
   * Create a html error message
   */
		getErrorMessage: function getErrorMessage(msg) {
			return $("<p>").addClass("error").text(msg);
		},

		/**
   * Request and show profile data
   */
		initShowProfile: function initShowProfile() {
			var that = this;
			this.$community.on("click", ".community-profile__link", function () {
				$.ajax({
					type: "POST",
					url: $(this).data("profile-url"),
					success: function success(html) {
						that.$credentialForm.html(html);
					},
					error: function error() {
						var $message = that.getErrorMessage(that.unknownErrorMessage);
						that.$credentialForm.html($message);
					}
				});
			});
		},

		/**
   * Init login handling
   */
		initLogin: function initLogin() {
			var that = this;
			this.$loginForm.submit(function (e) {
				var $form = $(this),
				    formData = $form.serializeArray();

				e.preventDefault();
				that.$loginButton.prop("disabled", true);

				// Add cookie attribute to URL if user has checked the checkbox
				$.each(formData, function (i, attribute) {
					if (attribute.name === "saveLogin" && attribute.value === "true") {
						formData.push({
							"name": "cookieTimeout",
							"value": 28 * 86400 // 28 days
						});
					}
				});

				$.ajax({
					type: "POST",
					url: that.settings.urlLogin,
					data: formData,
					success: function success() {
						location.reload();
					},
					error: function error() {
						that.hideMessages();
						that.$loginButton.prop("disabled", false);
						that.$loginError.show();
					}
				});
			});
		},

		/**
   * Init logout functionality
   */
		initLogout: function initLogout() {
			var that = this;
			this.$community.on("click", ".community-logout__link", function (e) {
				e.preventDefault();
				$.ajax({
					type: "POST",
					url: that.settings.urlLogout,
					success: function success() {
						location.reload();
					}
				});
			});
		},

		/**
   * Init functionality to write comments
   */
		initPostComment: function initPostComment() {
			var that = this;
			this.$community.on("submit", ".comment__response-form, .comment__comment-form", function (e) {
				var $form = $(this);
				e.preventDefault();
				that.hideMessages();
				$.ajax({
					type: "POST",
					url: $form.data("comment-url") || that.settings.commentPostUrl,
					data: $form.serialize(),
					success: function success(html) {
						var $counter, $answers;
						$form.hide();
						$form.get(0).reset();
						// Prepend the comment as answer
						$answers = $form.closest(".comment").find(".community__comment-list--answer");
						if ($answers.length > 0) {
							// Show the answer list
							$answers.prepend(html).show();
							$answers.closest(".comment").find(".answers__toggle").addClass("open");
							// Raise the answer counter
							$counter = $answers.closest(".comment").find(".answers__counter");
							$counter.text(parseInt($counter.text(), 10) + 1);
						}
						// Prepend the comment as new comment
						else {
								that.$community.find(".community__comment-list").first().prepend(html);
							}
					},
					error: function error() {
						var $message = that.getErrorMessage("Beim Speichern des Kommentars ist ein Fehler aufgetreten!");
						that.$addResponseMessageTarget.html($message);
					}
				});
			});
		},

		/**
   * Init the profile update form functionality
   */
		initProfileUpdate: function initProfileUpdate() {
			var that = this;
			this.$profileForm.submit(function (e) {
				var $form = $(this);
				e.preventDefault();
				that.hideMessages();
				$.ajax({
					type: "POST",
					url: $form.data("profile-update-url"),
					data: $form.serialize(),
					success: function success(html) {
						that.$profileMessageTarget.html(html);
					},
					error: function error() {
						var $message = that.getErrorMessage(that.unknownErrorMessage);
						that.$profileMessageTarget.html($message);
					}
				});
			});
		},

		/**
   * Init the registration form functionality
   */
		initRegistration: function initRegistration() {
			var that = this;
			this.$registrationForm.submit(function (e) {
				var $form = $(this);
				e.preventDefault();
				that.hideMessages();
				$.ajax({
					type: "POST",
					url: $form.data("register-url") || that.settings.registerUrl,
					data: $form.serialize(),
					success: function success(html) {
						that.$registrationMessageTarget.html(html);
					},
					error: function error() {
						var $message = that.getErrorMessage(that.unknownErrorMessage);
						that.$registrationMessageTarget.html($message);
					}
				});
			});
		},

		/**
   * Init the password reset form functionality
   */
		initResetPassword: function initResetPassword() {
			var that = this;
			this.$forgotPasswordForm.submit(function (e) {
				var $form = $(this);
				e.preventDefault();
				that.hideMessages();
				$.ajax({
					type: "POST",
					url: $form.data("reset-password-url") || that.settings.passwordResetUrl,
					data: $form.serialize(),
					success: function success(html) {
						that.$resetPasswordMessageTarget.html(html);
					},
					error: function error() {
						var $errorMsg = that.getErrorMessage(that.unknownErrorMessage);
						that.$resetPasswordMessageTarget.html($errorMsg);
					}
				});
			});
		},

		/**
   * Init the counters to count the remaining chars in comment text areas
   */
		initCharCounters: function initCharCounters() {
			this.$community.on("keyup", ".community__text-area", function () {
				var $textArea = $(this),
				    $counter = $textArea.closest("form").find(".word_count_span"),
				    maxChars = 3000,
				    currentChars = $textArea.val().length;

				if (currentChars <= maxChars) {
					$counter.text(maxChars - currentChars);
				}
			});
		},

		/**
   * Show the login form, if the user is logged in. Otherwise show login message
   */
		initCommentRespond: function initCommentRespond() {
			var that = this;

			this.$community.on("click", ".comment__answer-button", function (e) {
				var $button = $(this),
				    $allResponseForms = $(".comment__response-form", that.$community),
				    $responseForm = $button.closest(".comment").find(".comment__response-form"),
				    isUserLoggedIn = $button.data("user");

				e.preventDefault();
				if (isUserLoggedIn) {
					$allResponseForms.hide();
					$responseForm.show();
				} else {
					that.$loginMessage.show().insertAfter($button);
				}
			});
		},

		/**
   * Toggle answers when clicking the toggle link
   */
		initToggleAnswers: function initToggleAnswers() {
			this.$community.on("click", ".answers__toggle", function (e) {
				var $toggle = $(this),
				    $toggleText = $(".comment__answer-toggle-text", $toggle),
				    $answers = $toggle.closest(".comment").find(".community__comment-list--answer");
				e.preventDefault();
				$answers.stop().slideToggle("fast", function () {
					$toggleText.toggleClass("open");
				});
			});
		},

		/**
   * Report/blame a comment
   */
		initReportComment: function initReportComment() {
			this.$community.on("click", ".comment__report-link", function (e) {
				var $link = $(this),
				    url = $link.data("report-url"),
				    commentId = $link.data("comment-id");
				e.preventDefault();
				$.ajax({
					type: "POST",
					url: url,
					data: {
						"commentId": commentId
					},
					success: function success(html) {
						$link.hide();
						$link.after(html);
					}
				});
			});
		},

		/**
   * Init read more / read less comment toggeling
   */
		initReadMore: function initReadMore() {
			this.$community.on("click", ".comment__show-more, .comment__show-less", function (e) {
				e.preventDefault();
				$(this).closest(".comment__text").find(".comment__full-text, .comment__short-tex").toggle();
			});
		},

		/**
   * Request and show all comments for a given page number
   *
   * @param {number} pageNumber
   */
		loadPage: function loadPage(pageNumber) {
			var that = this,
			    ajaxUrl = this.$commentRoot.data("comment-ajax-url");

			$.ajax({
				type: "POST",
				url: ajaxUrl,
				data: {
					"page": pageNumber
				},
				success: function success(html) {
					that.$commentRoot.html(html);
				}
			});
		}

	});

	// Auto initialize the community, if it is un-initialized
	$("[data-plugin-community]").each(function () {
		if (!$.data(this, "community")) {
			$.data(this, "community", new Community(this));
		}
	});
});

function CompareSlider(rootNode, opts) {

	this.rootNode = rootNode;
	this.init();
	this.caption("right");
	this.resize();
	// window.dataLayer.push({
	// 	"event": "slider_klick"
	// });
}

CompareSlider.prototype.init = function (opts) {
	var that = this,
	    parentOffset = jQuery(this.rootNode).find(".compare-slider--wrapper").offset(),
	    wrapperWidth = jQuery(this.rootNode).find(".compare-slider--wrapper").width();

	// Responsive min-width for Image. important!

	jQuery(this.rootNode).find(".compare-slider--img-left img").css({
		minWidth: wrapperWidth + "px",
		maxWidth: wrapperWidth + "px"
	});

	// Ad move Class if Slide Line clicked or touched

	jQuery(this.rootNode).find(".compare-slider--button").on("mousedown touchstart", function (e) {
		// window.console.log("TEST", jQuery(that.rootNode).attr("id"), e.type);
		jQuery(this).addClass("move");
		jQuery(this).removeClass("animate");
		jQuery(that.rootNode).find(".compare-slider--img-left").removeClass("animate");
	}).on("mouseup touchend", function () {
		jQuery(this).removeClass("move").removeClass("animate");
	});

	// Slide Line move. Set Position of Slide Line and width of img-left container

	jQuery(this.rootNode).find(".compare-slider--wrapper").on("mousemove touchmove", function (e) {
		e.preventDefault();
		if (e.type === "mousemove") {
			this.relX = e.pageX - parentOffset.left;
		} else if (e.type === "touchmove") {
			this.relX = e.originalEvent.touches[0].pageX - parentOffset.left;
		}

		if (jQuery(that.rootNode).find(".compare-slider--button").hasClass("move") && this.relX >= 0 && this.relX <= jQuery(this).width()) {
			jQuery(that.rootNode).find(".compare-slider--button").css({
				left: this.relX - jQuery(that.rootNode).find(".compare-slider--button").outerWidth() / 2 + "px"
			});

			jQuery(that.rootNode).find(".compare-slider--img-left").css({
				width: this.relX + "px"
			});

			// Call Caption Animation

			if (this.relX >= jQuery(this).width() / 2) {
				that.caption("right");
			} else {
				that.caption("left");
			}
		}
	});

	// Snap Line per Touch or click;

	jQuery(this.rootNode).find(".compare-slider--wrapper").on("mousedown touchstart", function (e) {
		if (!jQuery(that.rootNode).find(".compare-slider--button").hasClass("move")) {
			// window.console.log(e.type);
			if (event.type === "mousedown") {
				this.relX = e.pageX - parentOffset.left;
				that.snap(this.relX);
			} else if (event.type === "touchstart") {
				this.relX = e.originalEvent.touches[0].pageX - parentOffset.left;
				that.snap(this.relX);
			}
		}
	});

	jQuery(this.rootNode).on("mouseleave", function () {
		jQuery(that.rootNode).find(".compare-slider--button").removeClass("move").removeClass("animate");
		jQuery(that.rootNode).find(".compare-slider--img-left").removeClass("animate");
	});
};

// Animate Snap Line

CompareSlider.prototype.snap = function (relX) {
	var rootNodeWidth = jQuery(this.rootNode).width();

	try {

		// window.console.log(jQuery(this.rootNode).find(".compare-slider--button").width() / 2, relX, rootNodeWidth);

		jQuery(this.rootNode).find(".compare-slider--button").addClass("animate").css({
			left: relX - jQuery(this.rootNode).find(".compare-slider--button").width() / 2
		});

		jQuery(this.rootNode).find(".compare-slider--img-left").addClass("animate").css({
			width: relX
		});

		if (jQuery(this.rootNode).find(".compare-slider--button").width() / 2 + relX > rootNodeWidth) {
			jQuery(this.rootNode).find(".compare-slider--button").addClass("animate").css({
				left: rootNodeWidth - jQuery(this.rootNode).find(".compare-slider--button").width() / 2
			});

			jQuery(this.rootNode).find(".compare-slider--img-left").addClass("animate").css({
				width: rootNodeWidth
			});
		}

		if (relX < jQuery(this.rootNode).find(".compare-slider--button").width() / 2) {
			jQuery(this.rootNode).find(".compare-slider--button").addClass("animate").css({
				left: -jQuery(this.rootNode).find(".compare-slider--button").width() / 2
			});

			jQuery(this.rootNode).find(".compare-slider--img-left").addClass("animate").css({
				width: 0
			});
		}

		// Call Caption Animation

		if (relX - jQuery(this.rootNode).find(".compare-slider--button").width() / 2 >= rootNodeWidth / 2) {
			this.caption("right");
		} else {
			this.caption("left");
		}
	} catch (err) {
		window.console.log(err.message);
	}
};

CompareSlider.prototype.caption = function (direction) {

	if (jQuery(this.rootNode).find(".compare-slider--caption-left").length > 0 && jQuery(this.rootNode).find(".compare-slider--caption-right").length > 0) {
		if (direction === "left") {
			jQuery(this.rootNode).find(".compare-slider--caption-right").removeClass("hidden");
			jQuery(this.rootNode).find(".compare-slider--caption-left").addClass("hidden");
		}

		if (direction === "right") {
			jQuery(this.rootNode).find(".compare-slider--caption-left").removeClass("hidden");
			jQuery(this.rootNode).find(".compare-slider--caption-right").addClass("hidden");
		}
	} else {
		jQuery(this.rootNode).find(".compare-slider--caption-right").removeClass("hidden");
	}
};
// Resize Container

CompareSlider.prototype.resize = function () {
	var that = this,
	    windowWidthLog = 0;

	jQuery(window).resize(function () {
		if (jQuery(window).width() !== windowWidthLog) {
			jQuery(that.rootNode).find(".compare-slider--img-left").removeAttr("style");
			jQuery(that.rootNode).find(".compare-slider--img-left img").removeAttr("style");
			jQuery(that.rootNode).find(".compare-slider--button").removeAttr("style");

			var wrapperWidth = jQuery(that.rootNode).find(".compare-slider--wrapper").width();

			jQuery(that.rootNode).find(".compare-slider--img-left img").css({
				minWidth: wrapperWidth + "px",
				maxWidth: wrapperWidth + "px"
			});

			windowWidthLog = jQuery(window).width();

			that.init();
		}
	});
};

jQuery.fn.compareSlider = function (opts) {
	return this.each(function () {
		new CompareSlider(this, opts);
	});
};

window.addEventListener("resize", function () {
	var positionHeader = jQuery(".header").offset(),
	    widthContainerStream = jQuery(".container-stream").width(),
	    newLeft = positionHeader.left + widthContainerStream + 8,
	    newLeftSidebar = positionHeader.left;
	jQuery(".container-sidebar-widget-wrapper").each(function (index) {
		if (jQuery(this).css("position") === "fixed") {
			jQuery(this).css("left", newLeft);
		}
	});
	jQuery(".pinned__article").css("left", newLeftSidebar);
}, true);

window.addEventListener("resize", function () {
	var positionArtikelHeader = jQuery(".header").offset(),
	    widthContainerArtikel = jQuery(".article__body").width(),
	    newArtikelLeft = positionArtikelHeader.left + widthContainerArtikel + 8,
	    newArtikelLeftSidebar = positionArtikelHeader.left;
	jQuery(".pin-wrapper").each(function (index) {
		if (jQuery(this).css("position") === "fixed") {
			jQuery(this).css("left", newArtikelLeft);
		}
	});
	jQuery(".pin-wrapper .pinned__article").css("left", newArtikelLeftSidebar);
}, true);

/* Cookie Notification Banner */
/* Author: Peter Marhewka */

function CookieNotification(rootNode, opts) {
	this.rootNode = rootNode;
	this.init();
}

CookieNotification.prototype.init = function (opts) {
	var that = this;
	// Try to read acceptcookie if success with value "yes" remove Element else show Banner
	if (window.readCookie("acceptcookies") !== "yes") {
		if (jQuery(this.rootNode).hasClass("cookie-note--middle")) {
			this.bannerPosition();
		}

		jQuery(this.rootNode).removeClass("hidden");

		// Create Cookie "acceptcookie with value "yes" and hide Element cookie expires after 14 days
		jQuery(this.rootNode).find(".cookie-note__button").on("click", function () {
			window.createCookie("acceptcookies", "yes", 14);
			jQuery(that.rootNode).addClass("hidden");
		});
	}

	jQuery(window).on("resize", function () {
		if (jQuery(that.rootNode).hasClass("cookie-note--middle")) {
			that.bannerPosition();
		}
	});
};

CookieNotification.prototype.bannerPosition = function (opts) {
	var windowWidth = jQuery(window).width(),
	    windowHeight = jQuery(window).height(),
	    rootNodeWidth = jQuery(this.rootNode).width(),
	    rootNodeHeight = jQuery(this.rootNode).height(),
	    bannerLeftPosition = windowWidth / 2 - rootNodeWidth / 2,
	    bannerTopPosition = windowHeight / 2 - rootNodeHeight / 2 - 30;

	jQuery(this.rootNode).css({
		left: bannerLeftPosition,
		top: bannerTopPosition
	});
};

jQuery.fn.cookieNotification = function (opts) {
	return this.each(function () {
		new CookieNotification(this, opts);
	});
};

/* globals ga */
/* Implementation of Google Event Tracking
	Author: Peter Marhewka
*/

function GoogleEventTracking(node) {
	var that = this;
	that.GoogleEventTrackingBind();
	console.log("Google Tracking");
}

GoogleEventTracking.prototype.GoogleEventTrackingBind = function (rootNode) {
	console.log("Google Tracking2");
	var gProtocol = jQuery(location).attr("protocol"),
	    gHostname = jQuery(location).attr("hostname"),
	    gPathname = jQuery(location).attr("pathname"),
	    gSearch = jQuery(location).attr("search"),
	    pageUrl = gProtocol + "//" + gHostname + gPathname + gSearch;

	jQuery("a").on("click", function () {
		var thisUrl = jQuery(this).attr("href");
		ga("send", "event", pageUrl, "click", thisUrl);
		console.log("Ereigniskategorie: " + pageUrl + " Ereignislabel: " + thisUrl);
	});

	jQuery(".sharrre").on("click", function () {
		var thisShare = jQuery(this).attr("title");
		ga("send", "event", pageUrl, "share", thisShare);
		console.log("Ereigniskategorie: " + pageUrl + " Ereignislabel: " + thisShare);
	});
};

jQuery.fn.googleEventTracking = function () {
	return this.each(function () {
		new GoogleEventTracking(this);
	});
};

/**
 * Created by aladendorf on 08.08.2016.
 */

/* var UrlHashMonitor = {};

( function(w, $) {
	UrlHashMonitor.oldHash = "";
	UrlHashMonitor.newHash = "";
	UrlHashMonitor.oldHref = "";
	UrlHashMonitor.newHref = "";
	UrlHashMonitor.onHashChange = function(f) {
		$(window).on("hashchange", function(e) {
			UrlHashMonitor.oldHash = UrlHashMonitor.newHash;
			UrlHashMonitor.newHash = w.location.hash;
			UrlHashMonitor.oldHref = UrlHashMonitor.newHref;
			UrlHashMonitor.newHref = w.location.href;
			f(e);
		});
	};
	UrlHashMonitor.init = function() {
		UrlHashMonitor.oldHash = UrlHashMonitor.newHash = w.location.hash;
		UrlHashMonitor.oldHref = UrlHashMonitor.newHref = w.location.href;
	};
	w.UrlHashMonitor = UrlHashMonitor;
	return UrlHashMonitor;

})(window, window.jQuery);

UrlHashMonitor.onHashChange(function() {
	if (causedByRemodalClose(UrlHashMonitor)) {
		if (document.readyState === "complete") {
			history.go(-2);
		}
		history.replaceState("", document.title, window.location.href.split("#")[0]);
	}
	else if (!(causedByRemodalOpen(UrlHashMonitor) || causedByRemodalBack(UrlHashMonitor))) {

		history.replaceState("", document.title, UrlHashMonitor.oldHref);
		return false;
	}

	function causedByRemodalOpen(e) {
		return e.newHash === "#modal" && (
			e.oldHref === e.newHref.split("#modal")[0] ||
			e.oldHref === e.newHref.split("#modal")[0] + "#" ||
			e.oldHref === ""
		);
	}

	function causedByRemodalClose(e) {
		return e.oldHash === "#modal" && (
			e.newHref === e.oldHref.split("#modal")[0] + "#"
		);
	}

	function causedByRemodalBack(e) {
		return e.oldHash === "#modal" && (
			e.newHref === e.oldHref.split("#modal")[0]
		);
	}
});

*/

function FacebookInlineResizer(rootNode, opts) {
	this.rootNode = rootNode;
	this.facebookInlineBlockCheck(opts);
	this.rootNodeWidth = jQuery(this.rootNode).width();
}

FacebookInlineResizer.prototype.facebookInlineBlockCheck = function (opts) {
	var that = this,
	    options = jQuery.extend({
		type: ""
	}, opts);

	if (options.type === "socialEmbed") {
		this.facebookResizerSocialWidget();
	} else {
		that.facebookResizer();

		jQuery(window).on("resize", function () {
			var newRootNodeWidth = jQuery(that.rootNode).width();
			// window.console.log(jQuery(that.rootNode).attr("id"), that.rootNodeWidth, newRootNodeWidth);
			if (that.rootNodeWidth !== newRootNodeWidth) {
				jQuery(that.rootNode).removeClass(that.currentClass);
				jQuery(that.rootNode).find("style").remove();
				jQuery(that.rootNode).find(".fb-post").find("span").width(351);
				that.facebookResizer();
				that.rootNodeWidth = newRootNodeWidth;
			}

			var observerInterval = setInterval(function () {
				if (newRootNodeWidth === that.rootNodeWidth) {
					clearInterval(observerInterval);
				}
			}, 2000);
		});
	}
};

FacebookInlineResizer.prototype.facebookResizer = function () {
	var that = this;

	// window.console.log(jQuery(that.rootNode).attr("id"), "Jetzt wird Facebook geresized");
	var inlineBlockWidthM = jQuery(that.rootNode).width(),
	    randClass = "fb-width-" + Math.floor(Math.random() * 10000 + 1);

	this.currentClass = randClass;

	if (jQuery(this.rootNode).hasClass("social-facebook")) {
		// window.console.log(jQuery(that.rootNode).attr("id"), "Has social-facebook Class");
		jQuery(this.rootNode).addClass(randClass);
		jQuery(this.rootNode).prepend("<style>" + "." + randClass + " iframe {width:" + inlineBlockWidthM + "px !important}" + " " + "." + randClass + " .fb_iframe_widget {width:" + inlineBlockWidthM + "px !important; max-width: 1000px !important" + "}" + " " + "." + randClass + " .fb_iframe_widget span {width:" + inlineBlockWidthM + "px !important; max-width: 1000px !important" + "}</style>");
		setTimeout(function () {
			// window.console.log(jQuery(that.rootNode).attr("id"), "Init XFBML");
			window.FB.XFBML.parse(document.getElementById(jQuery(that.rootNode).attr("id")));
		}, 200);
	}
};

FacebookInlineResizer.prototype.facebookResizerSocialWidget = function () {
	var that = this,
	    myCheckIntervallisRendered = false;
	this.facebookWidgetId = jQuery(this.rootNode).attr("id");
	this.rootNodeWidth = jQuery(this.rootNode).width();
	this.Random = Math.floor(Math.random() * 1000 + 300);

	this.myCheckIntervall = setInterval(function () {
		if (myCheckIntervallisRendered === false) {
			jQuery(document).trigger("myElementRendered");
		}
		if (myCheckIntervallisRendered === true) {
			clearInterval(that.myCheckIntervall);
		}
	}, 1000);

	// scale .fb-post when available width is smaller than 350px
	if (jQuery(that.rootNode).find(".fb-post").length) {

		if (this.rootNodeWidth > 350) {
			this.style = "#" + this.facebookWidgetId + " iframe {" + "width:" + this.rootNodeWidth + "px !important;" + "}" + "#" + this.facebookWidgetId + " span {" + "width:" + this.rootNodeWidth + "px !important;" + "}";
		} else {
			this.style = "#" + this.facebookWidgetId + " iframe {" + "width: 350px !important;" + "}" + "#" + this.facebookWidgetId + " span {" + "width:" + this.rootNodeWidth + "px !important;" + "}";
		}

		jQuery(this.rootNode).append("<style>" + this.style + "</style>").ready(function () {
			window.FB.XFBML.parse(document.getElementById(that.facebookWidgetId));

			if (that.rootNodeWidth < 350) {
				var facebookScale = 100 / 350 * that.rootNodeWidth / 100;
				jQuery(that.rootNode).find(".fb-post").css({
					"-webkit-transform-origin": "0 0",
					"-moz-transform-origin": "0 0",
					"-ms-transform-origin": "0 0",
					"-o-transform-origin": "0 0",
					"transform-origin": "0 0",
					"-webkit-transform": "scale(" + facebookScale,
					"-moz-transform": "scale(" + facebookScale,
					"-ms-transform": "scale(" + facebookScale,
					"-o-transform": "scale(" + facebookScale,
					"transform": "scale(" + facebookScale
				});

				jQuery(document).on("myElementRendered", function () {
					that.elementRenderData = "fb-xfbml-state";
					if (jQuery(that.rootNode).find(".fb-post").attr(that.elementRenderData) === "rendered") {
						if (myCheckIntervallisRendered === false) {
							myCheckIntervallisRendered = true;
							clearInterval(that.myCheckIntervall);

							var dimensions = jQuery(that.rootNode).find(".fb-post")[0].getBoundingClientRect();
							jQuery(that.rootNode).height(dimensions.height);
						}
					}
				});
			}
		});
	}

	// scale .fb-comment-embed because of a facebook bug where the element won't be rendered narrower than 560px
	else if (jQuery(that.rootNode).find(".fb-comment-embed").length) {

			if (that.rootNodeWidth < 560) {
				var scale = that.rootNodeWidth / 560,
				    iframeElem = jQuery(that.rootNode).find("iframe");

				iframeElem.css({
					"-webkit-transform-origin": "0 0",
					"-moz-transform-origin": "0 0",
					"-ms-transform-origin": "0 0",
					"-o-transform-origin": "0 0",
					"transform-origin": "0 0",
					"-webkit-transform": "scale(" + scale,
					"-moz-transform": "scale(" + scale,
					"-ms-transform": "scale(" + scale,
					"-o-transform": "scale(" + scale,
					"transform": "scale(" + scale
				});

				jQuery(document).on("myElementRendered", function () {
					that.elementRenderData = "fb-xfbml-state";
					if (jQuery(that.rootNode).find(".fb-comment-embed").attr(that.elementRenderData) === "rendered") {
						if (myCheckIntervallisRendered === false) {
							myCheckIntervallisRendered = true;
							clearInterval(that.myCheckIntervall);

							var dimensions = iframeElem[0].getBoundingClientRect();
							jQuery(that.rootNode).height(dimensions.height);
						}
					}
				});
			}
		}
};

// init
jQuery.fn.facebookInlineResizer = function (opts) {
	return this.each(function () {
		new FacebookInlineResizer(this, opts);
	});
};

jQuery(window).on("load", function () {
	if (!jQuery(".inline-block--left").hasClass("social-embed")) {
		jQuery(".inline-block--left").facebookInlineResizer();
	}

	if (!jQuery(".inline-block--right").hasClass("social-embed")) {
		jQuery(".inline-block--right").facebookInlineResizer();
	}

	if (!jQuery(".inline-block--left-25").hasClass("social-embed")) {
		jQuery(".inline-block--left-25").facebookInlineResizer();
	}

	if (!jQuery(".inline-block--right-25").hasClass("social-embed")) {
		jQuery(".inline-block--right-25").facebookInlineResizer();
	}

	if (!jQuery(".inline-block--wide").hasClass("social-embed")) {
		jQuery(".inline-block--wide").facebookInlineResizer();
	}
});

function PinterestInlineResizer(rootNode, opts) {
	this.rootNode = rootNode;
	this.pinterestInlineBlockCheck();
}

PinterestInlineResizer.prototype.pinterestInlineBlockCheck = function () {
	var that = this;
	jQuery(this.rootNode).each(function (index) {
		if (jQuery(this).find("span").first().length) {
			that.pinterestResizer();
		}
	});
};

PinterestInlineResizer.prototype.pinterestResizer = function () {
	var that = this,
	    myInterval = setInterval(function () {
		pinterestInlineResizer();
	}, 200);

	// window.console.log(jQuery(that.rootNode).attr("id"), "Jetzt wird Pinterest geresized");

	function pinterestInlineResizer() {
		var pinContainer = jQuery(that.rootNode).find("span").first();

		if (pinContainer.attr("data-pin-log") === "embed_pin_large" || pinContainer.attr("data-pin-log") === "embed_pin_medium" || pinContainer.attr("data-pin-log") === "embed_pin_small") {
			var inlineBlockWidth = jQuery(that.rootNode).outerWidth(),
			    pinterestWidth = pinContainer.outerWidth(),
			    pinterestScale = 100 / pinterestWidth * inlineBlockWidth / 100;

			// window.console.log(pinterestScale);

			if (inlineBlockWidth > pinterestWidth) {
				// window.console.log("if", inlineBlockWidth, ">", pinterestWidth);
				if (pinterestScale > 1) {
					pinterestScale = 1;
				} else {
					pinterestScale = 2 - pinterestScale;
				}
			} else {
				// window.console.log("Else", inlineBlockWidth, "<", pinterestWidth);
				pinterestScale = pinterestScale;

				jQuery(pinContainer).css({
					"padding": "12px 12px 0"
				});
			}

			pinContainer.css({
				"-webkit-transform-origin": "0 0",
				"-moz-transform-origin": "0 0",
				"-ms-transform-origin": "0 0",
				"-o-transform-origin": "0 0",
				"transform-origin": "0 0",
				"-webkit-transform": "scale(" + pinterestScale + ")",
				"-moz-transform": "scale(" + pinterestScale + ")",
				"-ms-transform": "scale(" + pinterestScale + ")",
				"-o-transform": "scale(" + pinterestScale + ")",
				"transform": "scale(" + pinterestScale + ")"
			});
			// window.console.log("inlineBlockWidth " + inlineBlockWidth, "pinterestWidth " + pinterestWidth, pinterestScale);

			var dimensions = pinContainer[0].getBoundingClientRect();

			jQuery(that.rootNode).height(dimensions.height);

			clearInterval(myInterval);
		}
	}
};

// init
jQuery.fn.pinterestInlineResizer = function (opts) {
	return this.each(function () {
		new PinterestInlineResizer(this, opts);
	});
};

jQuery(window).on("load", function () {
	if (!jQuery(".inline-block--left").hasClass("social-embed")) {
		jQuery(".inline-block--left").pinterestInlineResizer();
	}

	if (!jQuery(".inline-block--right").hasClass("social-embed")) {
		jQuery(".inline-block--right").pinterestInlineResizer();
	}

	if (!jQuery(".inline-block--left-25").hasClass("social-embed")) {
		jQuery(".inline-block--left-25").pinterestInlineResizer();
	}

	if (!jQuery(".inline-block--right-25").hasClass("social-embed")) {
		jQuery(".inline-block--right-25").pinterestInlineResizer();
	}

	if (!jQuery(".inline-block--wide").hasClass("social-embed")) {
		jQuery(".inline-block--wide").pinterestInlineResizer();
	}
});

/* Implementation of Inline Table Functions
	Author: Peter Marhewka
*/

function InlineTable(node) {
	var that = this;
	that.draw(node);
	$(node).on("redraw", function () {
		that.redraw(node);
	});
	$(node).off("click").on("click", ".inline-table-button-prev", function () {
		that.switchColum("prev", node);
	});
	$(node).on("click", ".inline-table-button-next", function () {
		that.switchColum("next", node);
	});
}

function InlineTableColSize(node) {
	var that = this;
	that.draw(node);
	$(node).on("redraw", function () {
		that.redraw(node);
	});
}

/*	Berechnung der Spaltenbreiten: In diesem Teil werden die Breiten der Spalten (Nur Desktop) berechnet. Dabei wird die erste Spalte
	über einen Faktor eine andere Breite zugewiesen. Diese Breite entspricht dann bei z.B.: Faktor 4 > 1/4 mehr als die anderen Spalten.
*/
InlineTableColSize.prototype.draw = function (rootNode) {
	var $columnCount = $(rootNode).find("tr").first().find("td").length,
	    faktor = 4,
	    $tableWidth = $(rootNode).width(),
	    newWidthFirstCol = $tableWidth / $columnCount + $tableWidth / $columnCount / faktor,
	    newWidthCol = $tableWidth / $columnCount - $tableWidth / $columnCount / faktor / ($columnCount - 1);

	$(rootNode).find("table tr").first().find("td").css("width", newWidthCol + "px");
	$(rootNode).find("table tr").first().find("td").first().css("width", newWidthFirstCol + "px");
};

InlineTable.prototype.draw = function (rootNode) {
	var $list = $(rootNode).find("td"),
	    $columnCount = $(rootNode).find("tr").first().find("td").length,
	    temp = [];

	console.log($columnCount);

	if ($columnCount <= 2) {
		$(rootNode).find(".inline-table-button-prev").css("display", "none");
		$(rootNode).find(".inline-table-button-next").css("display", "none");
	}

	$.each($list, function (idx, val) {
		var nodeElement = "1";
		temp.push(nodeElement);
	});

	for (var i = 0; i < temp.length; i++) {
		if ($($list[i]).is(":nth-child(2)")) {
			$($list[i]).addClass("inline-table-show");
		}
		if (!$($list[i]).is(":first-child") && !$($list[i]).is(":nth-child(2)")) {
			$($list[i]).addClass("inline-table-hidden");
		}
	}

	return true;
};

InlineTable.prototype.switchColum = function (direction, node) {
	if (direction === "prev") {
		$(node).find(".inline-table-show").each(function (i) {
			if (!$(this).prev().attr("class")) {
				$(this).removeClass("inline-table-show").addClass("inline-table-hidden");
				$(node).find("tr").children(":last-child").removeClass("inline-table-hidden").addClass("inline-table-show");
			} else {
				$(this).removeClass("inline-table-show").addClass("inline-table-hidden");
				$(this).prev().removeClass("inline-table-hidden").addClass("inline-table-show");
			}
		});
	}

	if (direction === "next") {
		$(node).find(".inline-table-show").each(function (i) {
			if ($(this).next().length !== 0) {
				$(this).removeClass("inline-table-show").addClass("inline-table-hidden");
				$(this).next().removeClass("inline-table-hidden").addClass("inline-table-show");
			} else {
				$(this).removeClass("inline-table-show").addClass("inline-table-hidden");
				$(node).find("tr").children(":nth-child(2)").removeClass("inline-table-hidden").addClass("inline-table-show");
			}
		});
	}
};

$.fn.inlineTable = function () {
	return this.each(function () {
		var mobileWidth = 767;
		if ($(window).width() <= mobileWidth) {
			new InlineTable(this);
		} else {
			new InlineTableColSize(this);
		}
	});
};

/* global gapi, _gaq, FB, STMBLPN, twttr */
/*
 *  Sharrre.com - Make your sharing widget!
 *  Version: beta 1.3.5
 *  Author: Julien Hany
 *  License: MIT http://en.wikipedia.org/wiki/MIT_License or GPLv2 http://en.wikipedia.org/wiki/GNU_General_Public_License
 *
 *  slightly changed by Ala and Akr sharrrre
 *
 */

(function ($, window, document, undefined) {

	/* Defaults ================================================== */
	var pluginName = "sharrre",
	    defaults = {
		className: "sharrre",
		share: {
			googlePlus: false,
			facebook: false,
			twitter: false,
			digg: false,
			delicious: false,
			stumbleupon: false,
			linkedin: false,
			pinterest: false
		},
		shareTotal: 0,
		template: "",
		title: "",
		url: document.location.href,
		text: document.title,
		urlCurl: "sharrre.php", // PHP script for google plus...
		count: {}, // counter by social network
		total: 0, // total of sharing
		shorterTotal: true, // show total by k or M when number is to big
		enableHover: true, // disable if you want to personalize hover event with callback
		enableCounter: true, // disable if you just want use buttons
		enableTracking: false, // tracking with google analitycs
		hover: function hover() {}, // personalize hover event with this callback function
		hide: function hide() {}, // personalize hide event with this callback function
		click: function click() {}, // personalize click event with this callback function
		render: function render() {}, // personalize render event with this callback function
		buttons: { // settings for buttons
			googlePlus: { // http://www.google.com/webmasters/+1/button/
				url: "", // if you need to personnalize button url
				urlCount: false, // if you want to use personnalize button url on global counter
				size: "medium",
				lang: "en-US",
				annotation: ""
			},
			facebook: { // http://developers.facebook.com/docs/reference/plugins/like/
				url: "", // if you need to personalize url button
				urlCount: false, // if you want to use personnalize button url on global counter
				action: "like",
				layout: "button_count",
				width: "",
				send: "false",
				faces: "false",
				colorscheme: "",
				font: "",
				lang: "en_US"
			},
			twitter: { // http://twitter.com/about/resources/tweetbutton
				url: "", // if you need to personalize url button
				urlCount: false, // if you want to use personnalize button url on global counter
				count: "horizontal",
				hashtags: "",
				via: "",
				related: "",
				lang: "en"
			},
			digg: { // http://about.digg.com/downloads/button/smart
				url: "", // if you need to personalize url button
				urlCount: false, // if you want to use personnalize button url on global counter
				type: "DiggCompact"
			},
			delicious: {
				url: "", // if you need to personalize url button
				urlCount: false, // if you want to use personnalize button url on global counter
				size: "medium" // medium or tall
			},
			stumbleupon: { // http://www.stumbleupon.com/badges/
				url: "", // if you need to personalize url button
				urlCount: false, // if you want to use personnalize button url on global counter
				layout: "1"
			},
			linkedin: { // http://developer.linkedin.com/plugins/share-button
				url: "", // if you need to personalize url button
				urlCount: false, // if you want to use personnalize button url on global counter
				counter: ""
			},
			pinterest: { // http://pinterest.com/about/goodies/
				url: "", // if you need to personalize url button
				media: "",
				description: "",
				layout: "horizontal"
			}
		}
	},

	/* Json URL to get count number ================================================== */
	urlJson = {
		googlePlus: "",

		// new FQL method by Sire
		// facebook: "https://graph.facebook.com/fql?q=SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url=%27{url}%27&callback=?",
		// old method
		facebook: "https://graph.facebook.com/?id={url}&callback=?",
		// facebook : "https://api.ak.facebook.com/restserver.php?v=1.0&method=links.getStats&urls={url}&format=json"

		// twitter: "https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
		digg: "https://services.digg.com/2.0/story.getInfo?links={url}&type=javascript&callback=?",
		delicious: "https://feeds.delicious.com/v2/json/urlinfo/data?url={url}&callback=?",
		// stumbleupon: "https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}&format=jsonp&callback=?",
		stumbleupon: "",
		linkedin: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
		pinterest: "https://api.pinterest.com/v1/urls/count.json?url={url}&callback=?"
	},

	/* Load share buttons asynchronously ================================================== */
	loadButton = {
		googlePlus: function googlePlus(self) {
			var sett = self.options.buttons.googlePlus;
			// $(self.element).find(".buttons").append("<div class="button googleplus"><g:plusone size=""+self.options.buttons.googlePlus.size+"" href=""+self.options.url+""></g:plusone></div>");
			$(self.element).find(".buttons").append("<div class=\"button googleplus\"><div class=\"g-plusone\" data-size=\"" + sett.size + "\" data-href=\"" + (sett.url !== "" ? sett.url : self.options.url) + "\" data-annotation=\"" + sett.annotation + "\"></div></div>");
			window.___gcfg = {
				lang: self.options.buttons.googlePlus.lang
			};
			var loading = 0;
			if (typeof gapi === "undefined" && loading === 0) {
				loading = 1;
				(function () {
					var po = document.createElement("script");
					po.type = "text/javascript";
					po.async = true;
					po.src = "//apis.google.com/js/plusone.js";
					var s = document.getElementsByTagName("script")[0];
					s.parentNode.insertBefore(po, s);
				})();
			} else {
				gapi.plusone.go();
			}
		},
		facebook: function facebook(self) {
			var sett = self.options.buttons.facebook;
			$(self.element).find(".buttons").append("<div class=\"button facebook\"><div id=\"fb-root\"></div><div class=\"fb-like\" data-href=\"" + (sett.url !== "" ? sett.url : self.options.url) + "\" data-send=\"" + sett.send + "\" data-layout=\"" + sett.layout + "\" data-width=\"" + sett.width + "\" data-show-faces=\"" + sett.faces + "\" data-action=\"" + sett.action + "\" data-colorscheme=\"" + sett.colorscheme + "\" data-font=\"" + sett.font + "\" data-via=\"" + sett.via + "\"></div></div>");
			var loading = 0;
			if (typeof FB === "undefined" && loading === 0) {
				loading = 1;
				(function (d, s, id) {
					var js,
					    fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {
						return;
					}
					js = d.createElement(s);
					js.id = id;
					js.src = "//connect.facebook.net/" + sett.lang + "/all.js#xfbml=1";
					fjs.parentNode.insertBefore(js, fjs);
				})(document, "script", "facebook-jssdk");
			} else {
				FB.XFBML.parse();
			}
		},
		twitter: function twitter(self) {
			var sett = self.options.buttons.twitter;
			$(self.element).find(".buttons").append("<div class=\"button twitter\"><a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\"" + (sett.url !== "" ? sett.url : self.options.url) + "\" data-count=\"" + sett.count + "\" data-text=\"" + self.options.text + "\" data-via=\"" + sett.via + "\" data-hashtags=\"" + sett.hashtags + "\" data-related=\"" + sett.related + "\" data-lang=\"" + sett.lang + "\">Tweet</a></div>");
			var loading = 0;
			if (typeof twttr === "undefined" && loading === 0) {
				loading = 1;
				(function () {
					var twitterScriptTag = document.createElement("script");
					twitterScriptTag.type = "text/javascript";
					twitterScriptTag.async = true;
					twitterScriptTag.src = "//platform.twitter.com/widgets.js";
					var s = document.getElementsByTagName("script")[0];
					s.parentNode.insertBefore(twitterScriptTag, s);
				})();
			} else {
				$.ajax({ url: "//platform.twitter.com/widgets.js", dataType: "script", cache: true }); // http://stackoverflow.com/q/6536108
			}
		},
		digg: function digg(self) {
			var sett = self.options.buttons.digg;
			$(self.element).find(".buttons").append("<div class=\"button digg\"><a class=\"DiggThisButton " + sett.type + "\" rel=\"nofollow external\" href=\"http://digg.com/submit?url=" + encodeURIComponent(sett.url !== "" ? sett.url : self.options.url) + "\"></a></div>");
			var loading = 0;
			if (typeof __DBW === "undefined" && loading === 0) {
				loading = 1;
				(function () {
					var s = document.createElement("SCRIPT"),
					    s1 = document.getElementsByTagName("SCRIPT")[0];
					s.type = "text/javascript";
					s.async = true;
					s.src = "//widgets.digg.com/buttons.js";
					s1.parentNode.insertBefore(s, s1);
				})();
			}
		},
		delicious: function delicious(self) {
			// medium
			var css = "width:93px;",
			    cssCount = "float:right;padding:0 3px;height:20px;width:26px;line-height:20px;",
			    cssShare = "float:left;height:20px;line-height:20px;";
			if (self.options.buttons.delicious.size === "tall") {
				// tall
				css = "width:50px;";
				cssCount = "height:35px;width:50px;font-size:15px;line-height:35px;";
				cssShare = "height:18px;line-height:18px;margin-top:3px;";
			}
			var count = self.shorterTotal(self.options.count.delicious);
			if (typeof count === "undefined") {
				count = 0;
			}
			$(self.element).find(".buttons").append("<div class=\"button delicious\"><div style=\"" + css + "font:12px Arial,Helvetica,sans-serif;cursor:pointer;color:#666666;display:inline-block;float:none;height:20px;line-height:normal;margin:0;padding:0;text-indent:0;vertical-align:baseline;\">" + "<div style=\"" + cssCount + "background-color:#fff;margin-bottom:5px;overflow:hidden;text-align:center;border:1px solid #ccc;border-radius:3px;\">" + count + "</div>" + "<div style=\"" + cssShare + "display:block;padding:0;text-align:center;text-decoration:none;width:50px;background-color:#7EACEE;border:1px solid #40679C;border-radius:3px;color:#fff;\">" + "<img src=\"http://www.delicious.com/static/img/delicious.small.gif\" height=\"10\" width=\"10\" alt=\"Delicious\" /> Add</div></div></div>");

			$(self.element).find(".delicious").on("click", function () {
				self.openPopup("delicious");
			});
		},
		stumbleupon: function stumbleupon(self) {
			var sett = self.options.buttons.stumbleupon;
			$(self.element).find(".buttons").append("<div class=\"button stumbleupon\"><su:badge layout=\"" + sett.layout + "\" location=\"" + (sett.url !== "" ? sett.url : self.options.url) + "\"></su:badge></div>");
			var loading = 0;
			if (typeof STMBLPN === "undefined" && loading === 0) {
				loading = 1;
				(function () {
					var li = document.createElement("script");
					li.type = "text/javascript";
					li.async = true;
					li.src = "//platform.stumbleupon.com/1/widgets.js";
					var s = document.getElementsByTagName("script")[0];
					s.parentNode.insertBefore(li, s);
				})();
				var s = window.setTimeout(function () {
					if (typeof STMBLPN !== "undefined") {
						STMBLPN.processWidgets();
						clearInterval(s);
					}
				}, 500);
			} else {
				STMBLPN.processWidgets();
			}
		},
		linkedin: function linkedin(self) {
			var sett = self.options.buttons.linkedin;
			$(self.element).find(".buttons").append("<div class=\"button linkedin\"><script type=\"in/share\" data-url=\"" + (sett.url !== "" ? sett.url : self.options.url) + "\" data-counter=\"" + sett.counter + "\"></script></div>");
			var loading = 0;
			if (typeof window.IN === "undefined" && loading === 0) {
				loading = 1;
				(function () {
					var li = document.createElement("script");
					li.type = "text/javascript";
					li.async = true;
					li.src = "//platform.linkedin.com/in.js";
					var s = document.getElementsByTagName("script")[0];
					s.parentNode.insertBefore(li, s);
				})();
			} else {
				window.IN.init();
			}
		},
		pinterest: function pinterest(self) {
			var sett = self.options.buttons.pinterest;
			$(self.element).find(".buttons").append("<div class=\"button pinterest\"><a href=\"http://pinterest.com/pin/create/button/?url=" + (sett.url !== "" ? sett.url : self.options.url) + "&media=" + sett.media + "&description=" + sett.description + "\" class=\"pin-it-button\" count-layout=\"" + sett.layout + "\">Pin It</a></div>");

			(function () {
				var li = document.createElement("script");
				li.type = "text/javascript";
				li.async = true;
				li.src = "//assets.pinterest.com/js/pinit.js";
				var s = document.getElementsByTagName("script")[0];
				s.parentNode.insertBefore(li, s);
			})();
		}
	},

	/* Tracking for Google Analytics ================================================== */
	tracking = {
		googlePlus: function googlePlus() {},
		facebook: function facebook() {
			// console.log("facebook");
			var fb = window.setInterval(function () {
				if (typeof FB !== "undefined") {
					FB.Event.subscribe("edge.create", function (targetUrl) {
						_gaq.push(["_trackSocial", "facebook", "like", targetUrl]);
					});
					FB.Event.subscribe("edge.remove", function (targetUrl) {
						_gaq.push(["_trackSocial", "facebook", "unlike", targetUrl]);
					});
					FB.Event.subscribe("message.send", function (targetUrl) {
						_gaq.push(["_trackSocial", "facebook", "send", targetUrl]);
					});
					// console.log("ok");
					clearInterval(fb);
				}
			}, 1000);
		},
		twitter: function twitter() {
			// console.log("twitter");
			var tw = window.setInterval(function () {
				if (typeof twttr !== "undefined") {
					twttr.events.bind("tweet", function (event) {
						if (event) {
							_gaq.push(["_trackSocial", "twitter", "tweet"]);
						}
					});
					// console.log("ok");
					clearInterval(tw);
				}
			}, 1000);
		},
		digg: function digg() {
			// if somenone find a solution, mail me !
			/*
   $(this.element).find(".digg").on("click", function() {
   	_gaq.push(["_trackSocial", "digg", "add"]);
   });
   */
		},
		delicious: function delicious() {},
		stumbleupon: function stumbleupon() {},
		linkedin: function linkedin() {
			function LinkedInShare() {
				_gaq.push(["_trackSocial", "linkedin", "share"]);
			}
		},
		pinterest: function pinterest() {
			// if somenone find a solution, mail me !
		}
	},

	/* Popup for each social network ================================================== */
	popup = {
		googlePlus: function googlePlus(opt) {
			window.open("https://plus.google.com/share?hl=" + opt.buttons.googlePlus.lang + "&url=" + encodeURIComponent(opt.buttons.googlePlus.url !== "" ? opt.buttons.googlePlus.url : opt.url), "", "toolbar=0, status=0, width=900, height=500");
		},
		facebook: function facebook(opt) {
			window.open("http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(opt.buttons.facebook.url !== "" ? opt.buttons.facebook.url : opt.url) + "&t=" + opt.text + "", "", "toolbar=0, status=0, width=900, height=500");
		},
		twitter: function twitter(opt) {
			window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(opt.text) + "&url=" + encodeURIComponent(opt.buttons.twitter.url !== "" ? opt.buttons.twitter.url : opt.url) + (opt.buttons.twitter.via !== "" ? "&via=" + opt.buttons.twitter.via : ""), "", "toolbar=0, status=0, width=650, height=360");
		},
		digg: function digg(opt) {
			window.open("http://digg.com/tools/diggthis/submit?url=" + encodeURIComponent(opt.buttons.digg.url !== "" ? opt.buttons.digg.url : opt.url) + "&title=" + opt.text + "&related=true&style=true", "", "toolbar=0, status=0, width=650, height=360");
		},
		delicious: function delicious(opt) {
			window.open("http://www.delicious.com/save?v=5&noui&jump=close&url=" + encodeURIComponent(opt.buttons.delicious.url !== "" ? opt.buttons.delicious.url : opt.url) + "&title=" + opt.text, "delicious", "toolbar=no,width=550,height=550");
		},
		stumbleupon: function stumbleupon(opt) {
			window.open("http://www.stumbleupon.com/badge/?url=" + encodeURIComponent(opt.buttons.delicious.url !== "" ? opt.buttons.delicious.url : opt.url), "stumbleupon", "toolbar=no,width=550,height=550");
		},
		linkedin: function linkedin(opt) {
			window.open("https://www.linkedin.com/cws/share?url=" + encodeURIComponent(opt.buttons.delicious.url !== "" ? opt.buttons.delicious.url : opt.url) + "&token=&isFramed=true", "linkedin", "toolbar=no,width=550,height=550");
		},
		pinterest: function pinterest(opt) {
			window.open("http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(opt.buttons.pinterest.url !== "" ? opt.buttons.pinterest.url : opt.url) + "&media=" + encodeURIComponent(opt.buttons.pinterest.media) + "&description=" + opt.buttons.pinterest.description, "pinterest", "toolbar=no,width=700,height=300");
		}
	};

	/* Plugin constructor ================================================== */
	function Plugin(element, options) {
		this.element = element;

		this.options = $.extend(true, {}, defaults, options);
		this.options.share = options.share; // simple solution to allow order of buttons

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	/* Initialization method ================================================== */
	Plugin.prototype.init = function () {
		var that = this;
		if (this.options.urlCurl !== "") {
			urlJson.googlePlus = this.options.urlCurl + "?url={url}&type=googlePlus"; //  PHP script for GooglePlus...
			urlJson.stumbleupon = this.options.urlCurl + "?url={url}&type=stumbleupon"; // PHP script for Stumbleupon...
		}
		$(this.element).addClass(this.options.className); // add class

		// HTML5 Custom data
		if (typeof $(this.element).data("title") !== "undefined") {
			this.options.title = $(this.element).attr("data-title");
		}
		if (typeof $(this.element).data("url") !== "undefined") {
			this.options.url = $(this.element).data("url");
		}
		if (typeof $(this.element).data("text") !== "undefined") {
			this.options.text = $(this.element).data("text");
		}

		// how many social website have been selected
		$.each(this.options.share, function (name, val) {
			if (val === true) {
				that.options.shareTotal++;
			}
		});

		if (that.options.enableCounter === true) {
			// if for some reason you don't need counter
			// get count of social share that have been selected
			$.each(this.options.share, function (name, val) {
				if (val === true) {
					// self.getSocialJson(name);
					try {
						that.getSocialJson(name);
					} catch (e) {}
				}
			});
		} else if (that.options.template !== "") {
			// for personalized button (with template)
			this.options.render(this, this.options);
		} else {
			// if you want to use official button like example 3 or 5
			this.loadButtons();
		}

		// add hover event
		$(this.element).hover(function () {
			// load social button if enable and 1 time
			if ($(this).find(".buttons").length === 0 && that.options.enableHover === true) {
				that.loadButtons();
			}
			that.options.hover(that, that.options);
		}, function () {
			that.options.hide(that, that.options);
		});

		// click event
		$(this.element).click(function () {
			that.options.click(that, that.options);
			return false;
		});
	};

	/* loadButtons methode ================================================== */
	Plugin.prototype.loadButtons = function () {
		var that = this;
		$(this.element).append("<div class=\"buttons\"></div>");
		$.each(that.options.share, function (name, val) {
			if (val === true) {
				loadButton[name](that);
				if (that.options.enableTracking === true) {
					// add tracking
					tracking[name]();
				}
			}
		});
	};

	/* getSocialJson methode ================================================== */
	Plugin.prototype.getSocialJson = function (name) {
		var that = this,
		    count = 0,
		    url = urlJson[name].replace("{url}", encodeURIComponent(this.options.url));
		if (this.options.buttons[name].urlCount === true && this.options.buttons[name].url !== "") {
			url = urlJson[name].replace("{url}", this.options.buttons[name].url);
		}
		// console.log("name : " + name + " - url : "+url); // debug
		if (url !== "" && that.options.urlCurl !== "") {
			// urlCurl = "" if you don't want to used PHP script but used social button
			$.getJSON(url, function (json) {
				if (typeof json.count !== "undefined") {
					// GooglePlus, Stumbleupon, Twitter, Pinterest and Digg
					var temp = json.count + "";
					temp = temp.replace("\xC2\xA0", ""); // remove google plus special chars
					count += parseInt(temp, 10);
				}
				// get the FB total count (shares, likes and more)
				else if (json.share && json.share && typeof json.share.share_count !== "undefined") {
						// Facebook total count
						count += parseInt(json.share.share_count, 10);
					} else if (typeof json[0] !== "undefined") {
						// Delicious
						count += parseInt(json[0].total_posts, 10);
					}
				/*
    else if (typeof json[0] !== "undefined") {  // Stumbleupon
    }
    */
				that.options.count[name] = count;
				that.options.total += count;
				that.renderer();
				that.rendererPerso();
				// console.log(json); // debug
			}).error(function () {
				that.options.count[name] = 0;
				that.rendererPerso();
			});
		} else {
			that.renderer();
			that.options.count[name] = 0;
			that.rendererPerso();
		}
	};

	/* launch render methode ================================================== */
	Plugin.prototype.rendererPerso = function () {
		// check if this is the last social website to launch render
		var shareCount = 0;
		for (var e in this.options.count) {
			shareCount++;
		}
		if (shareCount === this.options.shareTotal) {
			this.options.render(this, this.options);
		}
	};

	/* render methode ================================================== */
	Plugin.prototype.renderer = function () {
		var total = this.options.total,
		    template = this.options.template;
		if (this.options.shorterTotal === true) {
			// format number like 1.2k or 5M
			total = this.shorterTotal(total);
		}

		if (template !== "") {
			// if there is a template
			template = template.replace("{total}", total);
			$(this.element).html(template);
		} else {
			// template by defaults
			$(this.element).html("<div class=\"box\"><a class=\"count\" href=\"#\">" + total + "</a>" + (this.options.title !== "" ? "<a class=\"share\" href=\"#\">" + this.options.title + "</a>" : "") + "</div>");
		}
	};

	/* format total numbers like 1.2k or 5M ================================================== */
	Plugin.prototype.shorterTotal = function (num) {
		if (num >= 1e6) {
			num = (num / 1e6).toFixed(2) + "M";
		} else if (num >= 1e3) {
			num = (num / 1e3).toFixed(1) + "k";
		}
		return num;
	};

	/* Methode for open popup ================================================== */
	Plugin.prototype.openPopup = function (site) {
		popup[site](this.options); // open
		if (this.options.enableTracking === true) {
			// tracking!
			var tracking = {
				googlePlus: { site: "Google", action: "+1" },
				facebook: { site: "facebook", action: "like" },
				twitter: { site: "twitter", action: "tweet" },
				digg: { site: "digg", action: "add" },
				delicious: { site: "delicious", action: "add" },
				stumbleupon: { site: "stumbleupon", action: "add" },
				linkedin: { site: "linkedin", action: "share" },
				pinterest: { site: "pinterest", action: "pin" }
			};
			_gaq.push(["_trackSocial", tracking[site].site, tracking[site].action]);
		}
	};

	/* Methode for add +1 to a counter ================================================== */
	Plugin.prototype.simulateClick = function () {
		var html = $(this.element).html();
		$(this.element).html(html.replace(this.options.total, this.options.total + 1));
	};

	/* Methode for add +1 to a counter ================================================== */
	Plugin.prototype.update = function (url, text) {
		if (url !== "") {
			this.options.url = url;
		}
		if (text !== "") {
			this.options.text = text;
		}
	};

	/* A really lightweight plugin wrapper around the constructor, preventing against multiple instantiations ================================================== */
	$.fn[pluginName] = function (options) {
		var args = arguments;
		if (options === undefined || (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options));
				}
			});
		} else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
			return this.each(function () {
				var instance = $.data(this, "plugin_" + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === "function") {
					instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
			});
		}
	};
})(jQuery, window, document);

/* Implementation of jQuery.sticky-kit Plugin
 Author: Peter Marhewka
 */

function ArticlePinCall(rootNode, opts) {
	this.rootNode = rootNode;
	this.pinCall();
}

ArticlePinCall.prototype.pinCall = function () {
	var offsetStream = 170,
	    offsetArticle = 195;

	if (jQuery(this.rootNode).hasClass("container-sidebar")) {
		this.offset = offsetStream;
	} else {
		this.offset = offsetArticle;
	}

	jQuery(this.rootNode).stick_in_parent({ offset_top: this.offset, manual_spacer: false, spacer: false });
};

jQuery.fn.articlePinCall = function (opts) {
	return this.each(function () {
		new ArticlePinCall(this, opts);
	});
};

/* Implementation of Lightbox Carousell Mediagallerie Functions
	Author: Peter Marhewka
 */

$.fn.lightboxCarousel = function () {
	return this.each(function () {
		function getWindowDimensions() {
			var mobileWidth = 767;
			if ($(window).width() < mobileWidth) {
				$(".lightbox--media .hero-media__media").removeAttr("style");
				orientationOut();
			}
		}
		function orientationOut() {
			var windowHeight = $(window).height(),
			    windowWidth = $(window).width();
			if (windowHeight < windowWidth) {
				$(".lightbox--media .hero-media__media").height(windowHeight);
				$(".lightbox--media .carousel__list").height(windowHeight);
				$(".lightbox--media .hero-media__caption").hide();
			} else if (windowHeight > windowWidth) {
				$(".carousel").carousel();
				$(".lightbox--media .hero-media__media").removeAttr("style");
				$(".lightbox--media .hero-media__caption").show();
			}
		}
		$(window).bind("orientationchange", function (event) {
			getWindowDimensions();
		});
		$(window).on("resize", function () {
			getWindowDimensions();
		});
		$(document).on("click", ".carousel__caption__button", function () {
			$(".lightbox--media .hero-media__caption").slideToggle();
		});
		getWindowDimensions();
	});
};

/**
 * Created by Vincent on 03-May-18.
 */

$(document).ready(function () {
	// Simulate hover on touch menu
	$(".nav-main li.has-submenu a").bind("touchstart touchend", function (e) {
		if (window.innerWidth >= 768) {
			var isSubmenu = $(this).closest(".nav-li--level2").length !== 0 || $(this).closest(".nav-main__list--level2").length !== 0;

			if (!$(this).hasClass("hover-simulate") && !isSubmenu) {
				e.preventDefault();
				$(".hover-simulate").each(function () {
					$(this).removeClass("hover-simulate");
				});
				$(this).closest("li.has-submenu").addClass("hover-simulate");
				$(this).addClass("hover-simulate");
			}
		}
	});

	// close menu on touch somewhere else if menu open
	$("body").bind("touchstart touchend", function (e) {
		if (window.innerWidth >= 768) {
			var clickedOn = $(e.target),
			    isMenu = clickedOn.parents().andSelf().is(".nav-main");
			if (!isMenu) {
				var openMenu = $(".hover-simulate");
				if (openMenu.length) {
					e.preventDefault();

					openMenu.each(function () {
						$(this).removeClass("hover-simulate");
					});
				}
			}
		}
	});
});

function Navigation(rootNode, opts) {
	this.rootNode = rootNode;
	this.view = opts.view;
	this.toggleNavigation();
}

Navigation.prototype.toggleNavigation = function () {

	if (window.device !== "tablet" || window.device !== "mobile") {
		jQuery(".nav-bar:not(.main-menu-mobile) li.has-submenu").on("mouseover", function (evnt) {
			evnt.preventDefault();
			var $subMenu = jQuery(this).find(".nav-main__list--level2");
			$subMenu.css("display", "block");
		}).on("mouseout", function (evnt) {
			evnt.preventDefault();
			var $subMenu = jQuery(this).find(".nav-main__list--level2");
			$subMenu.css("display", "none");
		});
	} else {
		jQuery(".nav-bar:not(.main-menu-mobile) li.has-submenu").on("click touchstart", function (evnt) {
			// evnt.preventDefault();
			var $subMenu = jQuery(this).find(".nav-main__list--level2");
			if ($subMenu.css("display") === "none") {
				$subMenu.css("display", "block");
			} else {
				$subMenu.css("display", "none");
			}
		});
	}

	jQuery(".nav-bar.main-menu-mobile li.has-submenu > a").on("click touchstart", function (evnt) {

		var $subMenu = jQuery(this).parent().find(".nav-main__list--level2__container"),
		    $mobileMenu = $subMenu.closest(".nav-bar"),
		    windowHeight = jQuery(window).height();

		evnt.preventDefault();
		$subMenu.css({
			"bottom": $mobileMenu.outerHeight() + "px"
		});

		$subMenu.toggle();

		if ($subMenu.css("display") === "none") {
			jQuery("body").removeClass("sticky--body__nav");
			jQuery(".nav-main--mobile").find(".nav-main__list--level2__container").removeAttr("style");
		} else {
			jQuery("body").addClass("sticky--body__nav");
		}
	});
	jQuery(".nav-main__list--level2__container__close-button").on("click touchstart", function (evnt) {
		evnt.preventDefault();
		jQuery(this).parent().css("display", "none");
		jQuery("body").removeClass("sticky--body__nav");
	});

	jQuery("input[type=search]").focusin(function () {
		jQuery(".search-bar").addClass("focus");
	}).focusout(function () {
		jQuery(".search-bar").removeClass("focus");
	});

	jQuery(".toggle-search").off("click").on("click", function (e) {
		e.preventDefault();
		jQuery(".search-bar").slideToggle();
		if (jQuery(".search-bar").hasClass("open")) {
			jQuery(".search-bar").removeClass("open");
			jQuery(".icon.toggle-search").removeClass("icon--close").addClass("icon--search");
		} else {
			jQuery(".search-bar").addClass("open");
			jQuery(".icon.toggle-search").addClass("icon--close").removeClass("icon--search");
			jQuery(".search-bar input[type=search]").trigger("focus");
		}
	});

	if (this.view === "mobile") {

		jQuery(".offcanvas-toggle-label, .offcanvas-overlay").on("click", function () {
			var body = jQuery("body");

			function handler(e) {
				e.preventDefault();
			}

			if (!body.hasClass("offcanvas-active")) {
				body.addClass("offcanvas-active");
				body.on("touchmove", handler);
			} else {
				body.removeClass("offcanvas-active");
				body.unbind("touchmove");
			}
		});
	}
};

jQuery.navigationIsInitiated = false;
jQuery.fn.navigation = function (opts) {
	if (!jQuery.navigationIsInitiated) {
		new Navigation(this, opts);
	}
	return this.each(function () {});
};

// jshint ignore: start
// jscs:disable

/**
 * Owl carousel
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;(function ($, window, document, undefined) {

	var drag, state, e;

	/**
  * Template for status information about drag and touch events.
  * @private
  */
	drag = {
		start: 0,
		startX: 0,
		startY: 0,
		current: 0,
		currentX: 0,
		currentY: 0,
		offsetX: 0,
		offsetY: 0,
		distance: null,
		startTime: 0,
		endTime: 0,
		updatedX: 0,
		targetEl: null
	};

	/**
  * Template for some status informations.
  * @private
  */
	state = {
		isTouch: false,
		isScrolling: false,
		isSwiping: false,
		direction: false,
		inMotion: false
	};

	/**
  * Event functions references.
  * @private
  */
	e = {
		_onDragStart: null,
		_onDragMove: null,
		_onDragEnd: null,
		_transitionEnd: null,
		_resizer: null,
		_responsiveCall: null,
		_goToLoop: null,
		_checkVisibile: null
	};

	/**
  * Creates a carousel.
  * @class The Owl Carousel.
  * @public
  * @param {HTMLElement|jQuery} element - The element to create the carousel for.
  * @param {Object} [options] - The options
  */
	function Owl(element, options) {

		/**
   * Current settings for the carousel.
   * @public
   */
		this.settings = null;

		/**
   * Current options set by the caller including defaults.
   * @public
   */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
   * Plugin element.
   * @public
   */
		this.$element = $(element);

		/**
   * Caches informations about drag and touch events.
   */
		this.drag = $.extend({}, drag);

		/**
   * Caches some status informations.
   * @protected
   */
		this.state = $.extend({}, state);

		/**
   * @protected
   * @todo Must be documented
   */
		this.e = $.extend({}, e);

		/**
   * References to the running plugins of this carousel.
   * @protected
   */
		this._plugins = {};

		/**
   * Currently suppressed events to prevent them from beeing retriggered.
   * @protected
   */
		this._supress = {};

		/**
   * Absolute current position.
   * @protected
   */
		this._current = null;

		/**
   * Animation speed in milliseconds.
   * @protected
   */
		this._speed = null;

		/**
   * Coordinates of all items in pixel.
   * @todo The name of this member is missleading.
   * @protected
   */
		this._coordinates = [];

		/**
   * Current breakpoint.
   * @todo Real media queries would be nice.
   * @protected
   */
		this._breakpoint = null;

		/**
   * Current width of the plugin element.
   */
		this._width = null;

		/**
   * All real items.
   * @protected
   */
		this._items = [];

		/**
   * All cloned items.
   * @protected
   */
		this._clones = [];

		/**
   * Merge values of all items.
   * @todo Maybe this could be part of a plugin.
   * @protected
   */
		this._mergers = [];

		/**
   * Invalidated parts within the update process.
   * @protected
   */
		this._invalidated = {};

		/**
   * Ordered list of workers for the update process.
   * @protected
   */
		this._pipe = [];

		$.each(Owl.Plugins, $.proxy(function (key, Plugin) {
			this._plugins[key[0].toLowerCase() + key.slice(1)] = new Plugin(this);
		}, this));

		$.each(Owl.Pipe, $.proxy(function (priority, worker) {
			this._pipe.push({
				"filter": worker.filter,
				"run": $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
  * Default options for the carousel.
  * @public
  */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,
		responsiveClass: false,

		fallbackEasing: "swing",

		info: false,

		nestedItemSelector: false,
		itemElement: "div",
		stageElement: "div",

		// Classes and Names
		themeClass: "owl-theme",
		baseClass: "owl-carousel",
		itemClass: "owl-item",
		centerClass: "center",
		activeClass: "active"
	};

	/**
  * Enumeration for width.
  * @public
  * @readonly
  * @enum {String}
  */
	Owl.Width = {
		Default: "default",
		Inner: "inner",
		Outer: "outer"
	};

	/**
  * Contains all registered plugins.
  * @public
  */
	Owl.Plugins = {};

	/**
  * Update pipe.
  */
	Owl.Pipe = [{
		filter: ["width", "items", "settings"],
		run: function run(cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: ["items", "settings"],
		run: function run() {
			var cached = this._clones,
			    clones = this.$stage.children(".cloned");

			if (clones.length !== cached.length || !this.settings.loop && cached.length > 0) {
				this.$stage.children(".cloned").remove();
				this._clones = [];
			}
		}
	}, {
		filter: ["items", "settings"],
		run: function run() {
			var i,
			    n,
			    clones = this._clones,
			    items = this._items,
			    delta = this.settings.loop ? clones.length - Math.max(this.settings.items * 2, 4) : 0;

			for (i = 0, n = Math.abs(delta / 2); i < n; i++) {
				if (delta > 0) {
					this.$stage.children().eq(items.length + clones.length - 1).remove();
					clones.pop();
					this.$stage.children().eq(0).remove();
					clones.pop();
				} else {
					clones.push(clones.length / 2);
					this.$stage.append(items[clones[clones.length - 1]].clone().addClass("cloned"));
					clones.push(items.length - 1 - (clones.length - 1) / 2);
					this.$stage.prepend(items[clones[clones.length - 1]].clone().addClass("cloned"));
				}
			}
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function run() {
			var rtl = this.settings.rtl ? 1 : -1,
			    width = (this.width() / this.settings.items).toFixed(3),
			    coordinate = 0,
			    merge,
			    i,
			    n;

			this._coordinates = [];
			for (i = 0, n = this._clones.length + this._items.length; i < n; i++) {
				merge = this._mergers[this.relative(i)];
				merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;
				coordinate += (this.settings.autoWidth ? this._items[this.relative(i)].width() + this.settings.margin : width * merge) * rtl;

				this._coordinates.push(coordinate);
			}
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function run() {
			var i,
			    n,
			    width = (this.width() / this.settings.items).toFixed(3),
			    css = {
				"width": Math.abs(this._coordinates[this._coordinates.length - 1]) + this.settings.stagePadding * 2,
				"padding-left": this.settings.stagePadding || "",
				"padding-right": this.settings.stagePadding || ""
			};

			this.$stage.css(css);

			css = { "width": this.settings.autoWidth ? "auto" : width - this.settings.margin };
			css[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin;

			if (!this.settings.autoWidth && $.grep(this._mergers, function (v) {
				return v > 1;
			}).length > 0) {
				for (i = 0, n = this._coordinates.length; i < n; i++) {
					css.width = Math.abs(this._coordinates[i]) - Math.abs(this._coordinates[i - 1] || 0) - this.settings.margin;
					this.$stage.children().eq(i).css(css);
				}
			} else {
				this.$stage.children().css(css);
			}
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function run(cache) {
			cache.current && this.reset(this.$stage.children().index(cache.current));
		}
	}, {
		filter: ["position"],
		run: function run() {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: ["width", "position", "items", "settings"],
		run: function run() {
			var rtl = this.settings.rtl ? 1 : -1,
			    padding = this.settings.stagePadding * 2,
			    begin = this.coordinates(this.current()) + padding,
			    end = begin + this.width() * rtl,
			    inner,
			    outer,
			    matches = [],
			    i,
			    n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if (this.op(inner, "<=", begin) && this.op(inner, ">", end) || this.op(outer, "<", begin) && this.op(outer, ">", end)) {
					matches.push(i);
				}
			}

			this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass);
			this.$stage.children(":eq(" + matches.join("), :eq(") + ")").addClass(this.settings.activeClass);

			if (this.settings.center) {
				this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass);
				this.$stage.children().eq(this.current()).addClass(this.settings.centerClass);
			}
		}
	}];

	/**
  * Initializes the carousel.
  * @protected
  */
	Owl.prototype.initialize = function () {
		this.trigger("initialize");

		this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl);

		// check support
		this.browserSupport();

		if (this.settings.autoWidth && this.state.imagesLoaded !== true) {
			var imgs, nestedSelector, width;
			imgs = this.$element.find("img");
			nestedSelector = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
				return false;
			}
		}

		this.$element.addClass("owl-loading");

		// create stage
		this.$stage = $("<" + this.settings.stageElement + " class='owl-stage'/>").wrap("<div class='owl-stage-outer'>");

		// append stage
		this.$element.append(this.$stage.parent());

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// set view width
		this._width = this.$element.width();

		// update view
		this.refresh();

		this.$element.removeClass("owl-loading").addClass("owl-loaded");

		// attach generic events
		this.eventsCall();

		// attach generic events
		this.internalEvents();

		// attach custom control events
		this.addTriggerableEvents();

		this.trigger("initialized");
	};

	/**
  * Setups the current settings.
  * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
  * @todo Support for media queries by using `matchMedia` would be nice.
  * @public
  */
	Owl.prototype.setup = function () {
		var viewport = this.viewport(),
		    overwrites = this.options.responsive,
		    match = -1,
		    settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function (breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr("class", function (i, c) {
					return c.replace(/\b owl-responsive-\S+/g, "");
				}).addClass("owl-responsive-" + match);
			}
		}

		if (this.settings === null || this._breakpoint !== match) {
			this.trigger("change", { property: { name: "settings", value: settings } });
			this._breakpoint = match;
			this.settings = settings;
			this.invalidate("settings");
			this.trigger("changed", { property: { name: "settings", value: this.settings } });
		}
	};

	/**
  * Updates option logic if necessery.
  * @protected
  */
	Owl.prototype.optionsLogic = function () {
		// Toggle Center class
		this.$element.toggleClass("owl-center", this.settings.center);

		// if items number is less than in body
		if (this.settings.loop && this._items.length < this.settings.items) {
			this.settings.loop = false;
		}

		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
  * Prepares an item before add.
  * @todo Rename event parameter `content` to `item`.
  * @protected
  * @returns {jQuery|HTMLElement} - The item container.
  */
	Owl.prototype.prepare = function (item) {
		var event = this.trigger("prepare", { content: item });

		if (!event.data) {
			event.data = $("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(item);
		}

		this.trigger("prepared", { content: event.data });

		return event.data;
	};

	/**
  * Updates the view.
  * @public
  */
	Owl.prototype.update = function () {
		var i = 0,
		    n = this._pipe.length,
		    filter = $.proxy(function (p) {
			return this[p];
		}, this._invalidated),
		    cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};
	};

	/**
  * Gets the width of the view.
  * @public
  * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
  * @returns {Number} - The width of the view in pixel.
  */
	Owl.prototype.width = function (dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
  * Refreshes the carousel primarily for adaptive purposes.
  * @public
  */
	Owl.prototype.refresh = function () {
		if (this._items.length === 0) {
			return false;
		}

		var start = new Date().getTime();

		this.trigger("refresh");

		this.setup();

		this.optionsLogic();

		// hide and show methods helps here to set a proper widths,
		// this prevents scrollbar to be calculated in stage width
		this.$stage.addClass("owl-refresh");

		this.update();

		this.$stage.removeClass("owl-refresh");

		this.state.orientation = window.orientation;

		this.watchVisibility();

		this.trigger("refreshed");
	};

	/**
  * Save internal event references and add event based functions.
  * @protected
  */
	Owl.prototype.eventsCall = function () {
		// Save events references
		this.e._onDragStart = $.proxy(function (e) {
			this.onDragStart(e);
		}, this);
		this.e._onDragMove = $.proxy(function (e) {
			this.onDragMove(e);
		}, this);
		this.e._onDragEnd = $.proxy(function (e) {
			this.onDragEnd(e);
		}, this);
		this.e._onResize = $.proxy(function (e) {
			this.onResize(e);
		}, this);
		this.e._transitionEnd = $.proxy(function (e) {
			this.transitionEnd(e);
		}, this);
		this.e._preventClick = $.proxy(function (e) {
			this.preventClick(e);
		}, this);
	};

	/**
  * Checks window `resize` event.
  * @protected
  */
	Owl.prototype.onThrottledResize = function () {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate);
	};

	/**
  * Checks window `resize` event.
  * @protected
  */
	Owl.prototype.onResize = function () {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (this.trigger("resize").isDefaultPrevented()) {
			return false;
		}

		this._width = this.$element.width();

		this.invalidate("width");

		this.refresh();

		this.trigger("resized");
	};

	/**
  * Checks for touch/mouse drag event type and add run event handlers.
  * @protected
  */
	Owl.prototype.eventsRouter = function (event) {
		var type = event.type;

		if (type === "mousedown" || type === "touchstart") {
			this.onDragStart(event);
		} else if (type === "mousemove" || type === "touchmove") {
			this.onDragMove(event);
		} else if (type === "mouseup" || type === "touchend") {
			this.onDragEnd(event);
		} else if (type === "touchcancel") {
			this.onDragEnd(event);
		}
	};

	/**
  * Checks for touch/mouse drag options and add necessery event handlers.
  * @protected
  */
	Owl.prototype.internalEvents = function () {
		var isTouch = isTouchSupport(),
		    isTouchIE = isTouchSupportIE();

		if (this.settings.mouseDrag) {
			this.$stage.on("mousedown", $.proxy(function (event) {
				this.eventsRouter(event);
			}, this));
			this.$stage.on("dragstart", function () {
				return false;
			});
			this.$stage.get(0).onselectstart = function () {
				return false;
			};
		} else {
			this.$element.addClass("owl-text-select-on");
		}

		if (this.settings.touchDrag && !isTouchIE) {
			this.$stage.on("touchstart touchcancel", $.proxy(function (event) {
				this.eventsRouter(event);
			}, this));
		}

		// catch transitionEnd event
		if (this.transitionEndVendor) {
			this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, false);
		}

		// responsive
		if (this.settings.responsive !== false) {
			this.on(window, "resize", $.proxy(this.onThrottledResize, this));
		}
	};

	/**
  * Handles touchstart/mousedown event.
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.onDragStart = function (event) {
		var ev, isTouchEvent, pageX, pageY, animatedPos;

		ev = event.originalEvent || event || window.event;

		// prevent right click
		if (ev.which === 3 || this.state.isTouch) {
			return false;
		}

		if (ev.type === "mousedown") {
			this.$stage.addClass("owl-grab");
		}

		this.trigger("drag");
		this.drag.startTime = new Date().getTime();
		this.speed(0);
		this.state.isTouch = true;
		this.state.isScrolling = false;
		this.state.isSwiping = false;
		this.drag.distance = 0;

		pageX = getTouches(ev).x;
		pageY = getTouches(ev).y;

		// get stage position left
		this.drag.offsetX = this.$stage.position().left;
		this.drag.offsetY = this.$stage.position().top;

		if (this.settings.rtl) {
			this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin;
		}

		// catch position // ie to fix
		if (this.state.inMotion && this.support3d) {
			animatedPos = this.getTransformProperty();
			this.drag.offsetX = animatedPos;
			this.animate(animatedPos);
			this.state.inMotion = true;
		} else if (this.state.inMotion && !this.support3d) {
			this.state.inMotion = false;
			return false;
		}

		this.drag.startX = pageX - this.drag.offsetX;
		this.drag.startY = pageY - this.drag.offsetY;

		this.drag.start = pageX - this.drag.startX;
		this.drag.targetEl = ev.target || ev.srcElement;
		this.drag.updatedX = this.drag.start;

		// to do/check
		// prevent links and images dragging;
		if (this.drag.targetEl.tagName === "IMG" || this.drag.targetEl.tagName === "A") {
			this.drag.targetEl.draggable = false;
		}

		$(document).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", $.proxy(function (event) {
			this.eventsRouter(event);
		}, this));
	};

	/**
  * Handles the touchmove/mousemove events.
  * @todo Simplify
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.onDragMove = function (event) {
		var ev, isTouchEvent, pageX, pageY, minValue, maxValue, pull;

		if (!this.state.isTouch) {
			return;
		}

		if (this.state.isScrolling) {
			return;
		}

		ev = event.originalEvent || event || window.event;

		pageX = getTouches(ev).x;
		pageY = getTouches(ev).y;

		// Drag Direction
		this.drag.currentX = pageX - this.drag.startX;
		this.drag.currentY = pageY - this.drag.startY;
		this.drag.distance = this.drag.currentX - this.drag.offsetX;

		// Check move direction
		if (this.drag.distance < 0) {
			this.state.direction = this.settings.rtl ? "right" : "left";
		} else if (this.drag.distance > 0) {
			this.state.direction = this.settings.rtl ? "left" : "right";
		}
		// Loop
		if (this.settings.loop) {
			if (this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && this.state.direction === "right") {
				this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
			} else if (this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && this.state.direction === "left") {
				this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
			}
		} else {
			// pull
			minValue = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maxValue = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? this.drag.distance / 5 : 0;
			this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);
		}

		// Lock browser if swiping horizontal

		if (this.drag.distance > 8 || this.drag.distance < -8) {
			if (ev.preventDefault !== undefined) {
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
			this.state.isSwiping = true;
		}

		this.drag.updatedX = this.drag.currentX;

		// Lock Owl if scrolling
		if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
			this.state.isScrolling = true;
			this.drag.updatedX = this.drag.start;
		}

		this.animate(this.drag.updatedX);
	};

	/**
  * Handles the touchend/mouseup events.
  * @protected
  */
	Owl.prototype.onDragEnd = function (event) {
		var compareTimes, distanceAbs, closest;

		if (!this.state.isTouch) {
			return;
		}

		if (event.type === "mouseup") {
			this.$stage.removeClass("owl-grab");
		}

		this.trigger("dragged");

		// prevent links and images dragging;
		this.drag.targetEl.removeAttribute("draggable");

		// remove drag event listeners

		this.state.isTouch = false;
		this.state.isScrolling = false;
		this.state.isSwiping = false;

		// to check
		if (this.drag.distance === 0 && this.state.inMotion !== true) {
			this.state.inMotion = false;
			return false;
		}

		// prevent clicks while scrolling

		this.drag.endTime = new Date().getTime();
		compareTimes = this.drag.endTime - this.drag.startTime;
		distanceAbs = Math.abs(this.drag.distance);

		// to test
		if (distanceAbs > 3 || compareTimes > 300) {
			this.removeClick(this.drag.targetEl);
		}

		closest = this.closest(this.drag.updatedX);

		this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
		this.current(closest);
		this.invalidate("position");
		this.update();

		// if pullDrag is off then fire transitionEnd event manually when stick
		// to border
		if (!this.settings.pullDrag && this.drag.updatedX === this.coordinates(closest)) {
			this.transitionEnd();
		}

		this.drag.distance = 0;

		$(document).off(".owl.dragEvents");
	};

	/**
  * Attaches `preventClick` to disable link while swipping.
  * @protected
  * @param {HTMLElement} [target] - The target of the `click` event.
  */
	Owl.prototype.removeClick = function (target) {
		this.drag.targetEl = target;
		$(target).on("click.preventClick", this.e._preventClick);
		// to make sure click is removed:
		window.setTimeout(function () {
			$(target).off("click.preventClick");
		}, 300);
	};

	/**
  * Suppresses click event.
  * @protected
  * @param {Event} ev - The event arguments.
  */
	Owl.prototype.preventClick = function (ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		} else {
			ev.returnValue = false;
		}
		if (ev.stopPropagation) {
			ev.stopPropagation();
		}
		$(ev.target).off("click.preventClick");
	};

	/**
  * Catches stage position while animate (only CSS3).
  * @protected
  * @returns
  */
	Owl.prototype.getTransformProperty = function () {
		var transform, matrix3d;

		transform = window.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform");
		// var transform = this.$stage.css(this.vendorName + "transform")
		transform = transform.replace(/matrix(3d)?\(|\)/g, "").split(",");
		matrix3d = transform.length === 16;

		return matrix3d !== true ? transform[4] : transform[12];
	};

	/**
  * Gets absolute position of the closest item for a coordinate.
  * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
  * @protected
  * @param {Number} coordinate - The coordinate in pixel.
  * @return {Number} - The absolute position of the closest item.
  */
	Owl.prototype.closest = function (coordinate) {
		var position = -1,
		    pull = 30,
		    width = this.width(),
		    coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function (index, value) {
				if (coordinate > value - pull && coordinate < value + pull) {
					position = index;
				} else if (this.op(coordinate, "<", value) && this.op(coordinate, ">", coordinates[index + 1] || value - width)) {
					position = this.state.direction === "left" ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, ">", coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, "<", coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
  * Animates the stage.
  * @public
  * @param {Number} coordinate - The coordinate in pixels.
  */
	Owl.prototype.animate = function (coordinate) {
		this.trigger("translate");
		this.state.inMotion = this.speed() > 0;

		if (this.support3d) {
			this.$stage.css({
				transform: "translate3d(" + coordinate + "px" + ",0px, 0px)",
				transition: this.speed() / 1000 + "s"
			});
		} else if (this.state.isTouch) {
			this.$stage.css({
				left: coordinate + "px"
			});
		} else {
			this.$stage.animate({
				left: coordinate
			}, this.speed() / 1000, this.settings.fallbackEasing, $.proxy(function () {
				if (this.state.inMotion) {
					this.transitionEnd();
				}
			}, this));
		}
	};

	/**
  * Sets the absolute position of the current item.
  * @public
  * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
  * @returns {Number} - The absolute position of the current item.
  */
	Owl.prototype.current = function (position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			var event = this.trigger("change", { property: { name: "position", value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate("position");

			this.trigger("changed", { property: { name: "position", value: this._current } });
		}

		return this._current;
	};

	/**
  * Invalidates the given part of the update routine.
  * @param {String} part - The part to invalidate.
  */
	Owl.prototype.invalidate = function (part) {
		this._invalidated[part] = true;
	};

	/**
  * Resets the absolute position of the current item.
  * @public
  * @param {Number} position - The absolute position of the new item.
  */
	Owl.prototype.reset = function (position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress(["translate", "translated"]);

		this.animate(this.coordinates(position));

		this.release(["translate", "translated"]);
	};

	/**
  * Normalizes an absolute or a relative position for an item.
  * @public
  * @param {Number} position - The absolute or relative position to normalize.
  * @param {Boolean} [relative=false] - Whether the given position is relative or not.
  * @returns {Number} - The normalized position.
  */
	Owl.prototype.normalize = function (position, relative) {
		var n = relative ? this._items.length : this._items.length + this._clones.length;

		if (!$.isNumeric(position) || n < 1) {
			return undefined;
		}

		if (this._clones.length) {
			position = (position % n + n) % n;
		} else {
			position = Math.max(this.minimum(relative), Math.min(this.maximum(relative), position));
		}

		return position;
	};

	/**
  * Converts an absolute position for an item into a relative position.
  * @public
  * @param {Number} position - The absolute position to convert.
  * @returns {Number} - The converted position.
  */
	Owl.prototype.relative = function (position) {
		position = this.normalize(position);
		position = position - this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
  * Gets the maximum position for an item.
  * @public
  * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
  * @returns {Number}
  */
	Owl.prototype.maximum = function (relative) {
		var maximum,
		    width,
		    i = 0,
		    coordinate,
		    settings = this.settings;

		if (relative) {
			return this._items.length - 1;
		}

		if (!settings.loop && settings.center) {
			maximum = this._items.length - 1;
		} else if (!settings.loop && !settings.center) {
			maximum = this._items.length - settings.items;
		} else if (settings.loop || settings.center) {
			maximum = this._items.length + settings.items;
		} else if (settings.autoWidth || settings.merge) {
			revert = settings.rtl ? 1 : -1;
			width = this.$stage.width() - this.$element.width();
			while (coordinate = this.coordinates(i)) {
				if (coordinate * revert >= width) {
					break;
				}
				maximum = ++i;
			}
		} else {
			throw "Can not detect maximum absolute position.";
		}

		return maximum;
	};

	/**
  * Gets the minimum position for an item.
  * @public
  * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
  * @returns {Number}
  */
	Owl.prototype.minimum = function (relative) {
		if (relative) {
			return 0;
		}

		return this._clones.length / 2;
	};

	/**
  * Gets an item at the specified relative position.
  * @public
  * @param {Number} [position] - The relative position of the item.
  * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
  */
	Owl.prototype.items = function (position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
  * Gets an item at the specified relative position.
  * @public
  * @param {Number} [position] - The relative position of the item.
  * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
  */
	Owl.prototype.mergers = function (position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
  * Gets the absolute positions of clones for an item.
  * @public
  * @param {Number} [position] - The relative position of the item.
  * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
  */
	Owl.prototype.clones = function (position) {
		var odd = this._clones.length / 2,
		    even = odd + this._items.length,
		    map = function map(index) {
			return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2;
		};

		if (position === undefined) {
			return $.map(this._clones, function (v, i) {
				return map(i);
			});
		}

		return $.map(this._clones, function (v, i) {
			return v === position ? map(i) : null;
		});
	};

	/**
  * Sets the current animation speed.
  * @public
  * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
  * @returns {Number} - The current animation speed in milliseconds.
  */
	Owl.prototype.speed = function (speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
  * Gets the coordinate of an item.
  * @todo The name of this method is missleanding.
  * @public
  * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
  * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
  */
	Owl.prototype.coordinates = function (position) {
		var coordinate = null;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function (coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[position - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1);
		} else {
			coordinate = this._coordinates[position - 1] || 0;
		}

		return coordinate;
	};

	/**
  * Calculates the speed for a translation.
  * @protected
  * @param {Number} from - The absolute position of the start item.
  * @param {Number} to - The absolute position of the target item.
  * @param {Number} [factor=undefined] - The time factor in milliseconds.
  * @returns {Number} - The time in milliseconds for the translation.
  */
	Owl.prototype.duration = function (from, to, factor) {
		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs(factor || this.settings.smartSpeed);
	};

	/**
  * Slides to the specified item.
  * @public
  * @param {Number} position - The position of the item.
  * @param {Number} [speed] - The time in milliseconds for the transition.
  */
	Owl.prototype.to = function (position, speed) {
		if (this.settings.loop) {
			var distance = position - this.relative(this.current()),
			    revert = this.current(),
			    before = this.current(),
			    after = this.current() + distance,
			    direction = before - after < 0 ? true : false,
			    items = this._clones.length + this._items.length;

			if (after < this.settings.items && direction === false) {
				revert = before + this._items.length;
				this.reset(revert);
			} else if (after >= items - this.settings.items && direction === true) {
				revert = before - this._items.length;
				this.reset(revert);
			}
			window.clearTimeout(this.e._goToLoop);
			this.e._goToLoop = window.setTimeout($.proxy(function () {
				this.speed(this.duration(this.current(), revert + distance, speed));
				this.current(revert + distance);
				this.update();
			}, this), 30);
		} else {
			this.speed(this.duration(this.current(), position, speed));
			this.current(position);
			this.update();
		}
	};

	/**
  * Slides to the next item.
  * @public
  * @param {Number} [speed] - The time in milliseconds for the transition.
  */
	Owl.prototype.next = function (speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
  * Slides to the previous item.
  * @public
  * @param {Number} [speed] - The time in milliseconds for the transition.
  */
	Owl.prototype.prev = function (speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
  * Handles the end of an animation.
  * @protected
  * @param {Event} event - The event arguments.
  */
	Owl.prototype.transitionEnd = function (event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.state.inMotion = false;
		this.trigger("translated");
	};

	/**
  * Gets viewport width.
  * @protected
  * @return {Number} - The width in pixel.
  */
	Owl.prototype.viewport = function () {
		var width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			throw "Can not detect viewport width.";
		}
		return width;
	};

	/**
  * Replaces the current content.
  * @public
  * @param {HTMLElement|jQuery|String} content - The new content.
  */
	Owl.prototype.replace = function (content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = content instanceof jQuery ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find("." + this.settings.nestedItemSelector);
		}

		content.filter(function () {
			return this.nodeType === 1;
		}).each($.proxy(function (index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find("[data-merge]").addBack("[data-merge]").attr("data-merge") * 1 || 1);
		}, this));

		this.reset($.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate("items");
	};

	/**
  * Adds an item.
  * @todo Use `item` instead of `content` for the event arguments.
  * @public
  * @param {HTMLElement|jQuery|String} content - The item content to add.
  * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
  */
	Owl.prototype.add = function (content, position) {
		position = position === undefined ? this._items.length : this.normalize(position, true);

		this.trigger("add", { content: content, position: position });

		if (this._items.length === 0 || position === this._items.length) {
			this.$stage.append(content);
			this._items.push(content);
			this._mergers.push(content.find("[data-merge]").addBack("[data-merge]").attr("data-merge") * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find("[data-merge]").addBack("[data-merge]").attr("data-merge") * 1 || 1);
		}

		this.invalidate("items");

		this.trigger("added", { content: content, position: position });
	};

	/**
  * Removes an item by its position.
  * @todo Use `item` instead of `content` for the event arguments.
  * @public
  * @param {Number} position - The relative position of the item to remove.
  */
	Owl.prototype.remove = function (position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger("remove", {
			content: this._items[position], position: position
		});

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate("items");

		this.trigger("removed", {
			content: null, position: position
		});
	};

	/**
  * Adds triggerable events.
  * @protected
  */
	Owl.prototype.addTriggerableEvents = function () {
		var handler = $.proxy(function (callback, event) {
			return $.proxy(function (e) {
				if (e.relatedTarget !== this) {
					this.suppress([event]);
					callback.apply(this, [].slice.call(arguments, 1));
					this.release([event]);
				}
			}, this);
		}, this);

		$.each({
			"next": this.next,
			"prev": this.prev,
			"to": this.to,
			"destroy": this.destroy,
			"refresh": this.refresh,
			"replace": this.replace,
			"add": this.add,
			"remove": this.remove
		}, $.proxy(function (event, callback) {
			this.$element.on(event + ".owl.carousel", handler(callback, event + ".owl.carousel"));
		}, this));
	};

	/**
  * Watches the visibility of the carousel element.
  * @protected
  */
	Owl.prototype.watchVisibility = function () {

		// test on zepto
		if (!isElVisible(this.$element.get(0))) {
			this.$element.addClass("owl-hidden");
			window.clearInterval(this.e._checkVisibile);
			this.e._checkVisibile = window.setInterval($.proxy(checkVisible, this), 500);
		}

		function isElVisible(el) {
			return el.offsetWidth > 0 && el.offsetHeight > 0;
		}

		function checkVisible() {
			if (isElVisible(this.$element.get(0))) {
				this.$element.removeClass("owl-hidden");
				this.refresh();
				window.clearInterval(this.e._checkVisibile);
			}
		}
	};

	/**
  * Preloads images with auto width.
  * @protected
  * @todo Still to test
  */
	Owl.prototype.preloadAutoWidthImages = function (imgs) {
		var loaded, that, $el, img;

		loaded = 0;
		that = this;
		imgs.each(function (i, el) {
			$el = $(el);
			img = new Image();

			img.onload = function () {
				loaded++;
				$el.attr("src", img.src);
				$el.css("opacity", 1);
				if (loaded >= imgs.length) {
					that.state.imagesLoaded = true;
					that.initialize();
				}
			};

			img.src = $el.attr("src") || $el.attr("data-src") || $el.attr("data-src-retina");
		});
	};

	/**
  * Destroys the carousel.
  * @public
  */
	Owl.prototype.destroy = function () {

		if (this.$element.hasClass(this.settings.themeClass)) {
			this.$element.removeClass(this.settings.themeClass);
		}

		if (this.settings.responsive !== false) {
			$(window).off("resize.owl.carousel");
		}

		if (this.transitionEndVendor) {
			this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
		}

		for (var i in this._plugins) {
			this._plugins[i].destroy();
		}

		if (this.settings.mouseDrag || this.settings.touchDrag) {
			this.$stage.off("mousedown touchstart touchcancel");
			$(document).off(".owl.dragEvents");
			this.$stage.get(0).onselectstart = function () {};
			this.$stage.off("dragstart", function () {
				return false;
			});
		}

		// remove event handlers in the ".owl.carousel" namespace
		this.$element.off(".owl");

		this.$stage.children(".cloned").remove();
		this.e = null;
		this.$element.removeData("owlCarousel");

		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();
		this.$stage.unwrap();
	};

	/**
  * Operators to calculate right-to-left and left-to-right.
  * @protected
  * @param {Number} [a] - The left side operand.
  * @param {String} [o] - The operator.
  * @param {Number} [b] - The right side operand.
  */
	Owl.prototype.op = function (a, o, b) {
		var rtl = this.settings.rtl;
		switch (o) {
			case "<":
				return rtl ? a > b : a < b;
			case ">":
				return rtl ? a < b : a > b;
			case ">=":
				return rtl ? a <= b : a >= b;
			case "<=":
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
  * Attaches to an internal event.
  * @protected
  * @param {HTMLElement} element - The event source.
  * @param {String} event - The event name.
  * @param {Function} listener - The event handler to attach.
  * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
  */
	Owl.prototype.on = function (element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent("on" + event, listener);
		}
	};

	/**
  * Detaches from an internal event.
  * @protected
  * @param {HTMLElement} element - The event source.
  * @param {String} event - The event name.
  * @param {Function} listener - The attached event handler to detach.
  * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
  */
	Owl.prototype.off = function (element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent("on" + event, listener);
		}
	};

	/**
  * Triggers an public event.
  * @protected
  * @param {String} name - The event name.
  * @param {*} [data=null] - The event data.
  * @param {String} [namespace=.owl.carousel] - The event namespace.
  * @returns {Event} - The event arguments.
  */
	Owl.prototype.trigger = function (name, data, namespace) {
		var status = {
			item: {
				count: this._items.length, index: this.current()
			}
		},
		    handler = $.camelCase($.grep(["on", name, namespace], function (v) {
			return v;
		}).join("-").toLowerCase()),
		    event = $.Event([name, "owl", namespace || "carousel"].join(".").toLowerCase(), $.extend({
			relatedTarget: this
		}, status, data));

		if (!this._supress[name]) {
			$.each(this._plugins, function (name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === "function") {
				this.settings[handler].apply(this, event);
			}
		}

		return event;
	};

	/**
  * Suppresses events.
  * @protected
  * @param {Array.<String>} events - The events to suppress.
  */
	Owl.prototype.suppress = function (events) {
		$.each(events, $.proxy(function (index, event) {
			this._supress[event] = true;
		}, this));
	};

	/**
  * Releases suppressed events.
  * @protected
  * @param {Array.<String>} events - The events to release.
  */
	Owl.prototype.release = function (events) {
		$.each(events, $.proxy(function (index, event) {
			delete this._supress[event];
		}, this));
	};

	/**
  * Checks the availability of some browser features.
  * @protected
  */
	Owl.prototype.browserSupport = function () {
		this.support3d = isPerspective();

		if (this.support3d) {
			this.transformVendor = isTransform();

			// take transitionend event name by detecting transition
			var endVendors = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"];
			this.transitionEndVendor = endVendors[isTransition()];

			// take vendor name from transform name
			this.vendorName = this.transformVendor.replace(/Transform/i, "");
			this.vendorName = this.vendorName !== "" ? "-" + this.vendorName.toLowerCase() + "-" : "";
		}

		this.state.orientation = window.orientation;
	};

	/**
  * Get touch/drag coordinats.
  * @private
  * @param {event} - mousedown/touchstart event
  * @returns {object} - Contains X and Y of current mouse/touch position
  */

	function getTouches(event) {
		if (event.touches !== undefined) {
			return {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			};
		}

		if (event.touches === undefined) {
			if (event.pageX !== undefined) {
				return {
					x: event.pageX,
					y: event.pageY
				};
			}

			if (event.pageX === undefined) {
				return {
					x: event.clientX,
					y: event.clientY
				};
			}
		}
	}

	/**
  * Checks for CSS support.
  * @private
  * @param {Array} array - The CSS properties to check for.
  * @returns {Array} - Contains the supported CSS property name and its index or `false`.
  */
	function isStyleSupported(array) {
		var p,
		    s,
		    fake = document.createElement("div"),
		    list = array;
		for (p in list) {
			s = list[p];
			if (typeof fake.style[s] !== "undefined") {
				fake = null;
				return [s, p];
			}
		}
		return [false];
	}

	/**
  * Checks for CSS transition support.
  * @private
  * @todo Realy bad design
  * @returns {Number}
  */
	function isTransition() {
		return isStyleSupported(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1];
	}

	/**
  * Checks for CSS transform support.
  * @private
  * @returns {String} The supported property name or false.
  */
	function isTransform() {
		return isStyleSupported(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0];
	}

	/**
  * Checks for CSS perspective support.
  * @private
  * @returns {String} The supported property name or false.
  */
	function isPerspective() {
		return isStyleSupported(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0];
	}

	/**
  * Checks wether touch is supported or not.
  * @private
  * @returns {Boolean}
  */
	function isTouchSupport() {
		return "ontouchstart" in window || !!navigator.msMaxTouchPoints;
	}

	/**
  * Checks wether touch is supported or not for IE.
  * @private
  * @returns {Boolean}
  */
	function isTouchSupportIE() {
		return window.navigator.msPointerEnabled;
	}

	/**
  * The jQuery Plugin for the Owl Carousel
  * @public
  */
	$.fn.owlCarousel = function (options) {
		return this.each(function () {
			if (!$(this).data("owlCarousel")) {
				$(this).data("owlCarousel", new Owl(this, options));
			}
		});
	};

	/**
  * The constructor for the jQuery Plugin
  * @public
  */
	$.fn.owlCarousel.Constructor = Owl;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {
	/**
  * Creates the lazy plugin.
  * @class The Lazy Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var Lazy = function Lazy(carousel) {

		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Already loaded items.
   * @protected
   * @type {Array.<jQuery>}
   */
		this._loaded = [];

		/**
   * Event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			"initialized.owl.carousel change.owl.carousel": $.proxy(function (e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if (e.property && e.property.name == "position" || e.type == "initialized") {
					var settings = this._core.settings,
					    n = settings.center && Math.ceil(settings.items / 2) || settings.items,
					    i = settings.center && n * -1 || 0,
					    position = (e.property && e.property.value || this._core.current()) + i,
					    clones = this._core.clones().length,
					    load = $.proxy(function (i, v) {
						this.load(v);
					}, this);

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position++)), load);
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  */
	Lazy.Defaults = {
		lazyLoad: false
	};

	/**
  * Loads all resources of an item at the specified position.
  * @param {Number} position - The absolute position of the item.
  * @protected
  */
	Lazy.prototype.load = function (position) {
		var $item = this._core.$stage.children().eq(position),
		    $elements = $item && $item.find(".owl-lazy");

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function (index, element) {
			var $element = $(element),
			    image,
			    url = window.devicePixelRatio > 1 && $element.attr("data-src-retina") || $element.attr("data-src");

			this._core.trigger("load", { element: $element, url: url }, "lazy");

			if ($element.is("img")) {
				$element.one("load.owl.lazy", $.proxy(function () {
					$element.css("opacity", 1);
					this._core.trigger("loaded", {
						element: $element, url: url
					}, "lazy");
				}, this)).attr("src", url);
			} else {
				image = new Image();
				image.onload = $.proxy(function () {
					$element.css({
						"background-image": "url(" + url + ")",
						"opacity": "1"
					});
					this._core.trigger("loaded", {
						element: $element, url: url
					}, "lazy");
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	};

	/**
  * Destroys the plugin.
  * @public
  */
	Lazy.prototype.destroy = function () {
		var handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {
	/**
  * Creates the auto height plugin.
  * @class The Auto Height Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var AutoHeight = function AutoHeight(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			"initialized.owl.carousel": $.proxy(function () {
				if (this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			"changed.owl.carousel": $.proxy(function (e) {
				if (this._core.settings.autoHeight && e.property.name == "position") {
					this.update();
				}
			}, this),
			"loaded.owl.lazy": $.proxy(function (e) {
				if (this._core.settings.autoHeight && e.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current())) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: "owl-height"
	};

	/**
  * Updates the view.
  */
	AutoHeight.prototype.update = function () {
		this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function () {
		var handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {
	/**
  * Creates the video plugin.
  * @class The Video Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var Video = function Video(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Cache all video URLs.
   * @protected
   * @type {Object}
   */
		this._videos = {};

		/**
   * Current playing item.
   * @protected
   * @type {jQuery}
   */
		this._playing = null;

		/**
   * Whether this is in fullscreen or not.
   * @protected
   * @type {Boolean}
   */
		this._fullscreen = false;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			"resize.owl.carousel": $.proxy(function (e) {
				if (this._core.settings.video && !this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			"refresh.owl.carousel changed.owl.carousel": $.proxy(function (e) {
				if (this._playing) {
					this.stop();
				}
			}, this),
			"prepared.owl.carousel": $.proxy(function (e) {
				var $element = $(e.content).find(".owl-video");
				if ($element.length) {
					$element.css("display", "none");
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on("click.owl.video", ".owl-video-play-icon", $.proxy(function (e) {
			this.play(e);
		}, this));
	};

	/**
  * Default options.
  * @public
  */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
  * Gets the video ID and the type (YouTube/Vimeo only).
  * @protected
  * @param {jQuery} target - The target containing the video data.
  * @param {jQuery} item - The item containing the video.
  */
	Video.prototype.fetch = function (target, item) {

		var type = target.attr("data-vimeo-id") ? "vimeo" : "youtube",
		    id = target.attr("data-vimeo-id") || target.attr("data-youtube-id"),
		    width = target.attr("data-width") || this._core.settings.videoWidth,
		    height = target.attr("data-height") || this._core.settings.videoHeight,
		    url = target.attr("href");

		if (url) {
			id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf("youtu") > -1) {
				type = "youtube";
			} else if (id[3].indexOf("vimeo") > -1) {
				type = "vimeo";
			} else {
				throw new Error("Video URL not supported.");
			}
			id = id[6];
		} else {
			throw new Error("Missing video URL.");
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr("data-video", url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
  * Creates video thumbnail.
  * @protected
  * @param {jQuery} target - The target containing the video data.
  * @see `fetch`
  */
	Video.prototype.thumbnail = function (target, video) {

		var tnLink,
		    icon,
		    path,
		    dimensions = video.width && video.height ? "style='width:" + video.width + "px;height:" + video.height + "px;'" : "",
		    customTn = target.find("img"),
		    srcType = "src",
		    lazyClass = "",
		    settings = this._core.settings,
		    create = function create(path) {
			icon = "<div class='owl-video-play-icon'></div>";

			if (settings.lazyLoad) {
				tnLink = "<div class='owl-video-tn " + lazyClass + "' " + srcType + "='" + path + "'></div>";
			} else {
				tnLink = "<div class='owl-video-tn' style='opacity:1;background-image:url(" + path + ")'></div>";
			}
			target.after(tnLink);
			target.after(icon);
		};

		// wrap video content into owl-video-wrapper div
		target.wrap("<div class='owl-video-wrapper'" + dimensions + "></div>");

		if (this._core.settings.lazyLoad) {
			srcType = "data-src";
			lazyClass = "owl-lazy";
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === "youtube") {
			path = "http://img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === "vimeo") {
			$.ajax({
				type: "GET",
				url: "http://vimeo.com/api/v2/video/" + video.id + ".json",
				jsonp: "callback",
				dataType: "jsonp",
				success: function success(data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		}
	};

	/**
  * Stops the current video.
  * @public
  */
	Video.prototype.stop = function () {
		this._core.trigger("stop", null, "video");
		this._playing.find(".owl-video-frame").remove();
		this._playing.removeClass("owl-video-playing");
		this._playing = null;
	};

	/**
  * Starts the current video.
  * @public
  * @param {Event} ev - The event arguments.
  */
	Video.prototype.play = function (ev) {
		this._core.trigger("play", null, "video");

		if (this._playing) {
			this.stop();
		}

		var target = $(ev.target || ev.srcElement),
		    item = target.closest("." + this._core.settings.itemClass),
		    video = this._videos[item.attr("data-video")],
		    width = video.width || "100%",
		    height = video.height || this._core.$stage.height(),
		    html,
		    wrap;

		if (video.type === "youtube") {
			html = "<iframe width='" + width + "' height='" + height + "' src='http://www.youtube.com/embed/" + video.id + "?autoplay=1&v=" + video.id + "' frameborder='0' allowfullscreen></iframe>";
		} else if (video.type === "vimeo") {
			html = "<iframe src='http://player.vimeo.com/video/'" + video.id + "?autoplay=1' width='" + width + "' height='" + height + "' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
		}

		item.addClass("owl-video-playing");
		this._playing = item;

		wrap = $("<div style='height:" + height + "px; width:" + width + "px' class='owl-video-frame'>" + html + "</div>");
		target.after(wrap);
	};

	/**
  * Checks whether an video is currently in full screen mode or not.
  * @todo Bad style because looks like a readonly method but changes members.
  * @protected
  * @returns {Boolean}
  */
	Video.prototype.isInFullScreen = function () {

		// if Vimeo Fullscreen mode
		var element = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

		if (element && $(element).parent().hasClass("owl-video-frame")) {
			this._core.speed(0);
			this._fullscreen = true;
		}

		if (element && this._fullscreen && this._playing) {
			return false;
		}

		// comming back from fullscreen
		if (this._fullscreen) {
			this._fullscreen = false;
			return false;
		}

		// check full screen mode and window orientation
		if (this._playing) {
			if (this._core.state.orientation !== window.orientation) {
				this._core.state.orientation = window.orientation;
				return false;
			}
		}

		return true;
	};

	/**
  * Destroys the plugin.
  */
	Video.prototype.destroy = function () {
		var handler, property;

		this._core.$element.off("click.owl.video");

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {
	/**
  * Creates the animate plugin.
  * @class The Navigation Plugin
  * @param {Owl} scope - The Owl Carousel
  */
	var Animate = function Animate(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;

		this.handlers = {
			"change.owl.carousel": $.proxy(function (e) {
				if (e.property.name == "position") {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			"drag.owl.carousel dragged.owl.carousel translated.owl.carousel": $.proxy(function (e) {
				this.swapping = e.type == "translated";
			}, this),
			"translate.owl.carousel": $.proxy(function (e) {
				if (this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
					this.swap();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
  * Default options.
  * @public
  */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	/**
  * Toggles the animation classes whenever an translations starts.
  * @protected
  * @returns {Boolean|undefined}
  */
	Animate.prototype.swap = function () {

		if (this.core.settings.items !== 1 || !this.core.support3d) {
			return;
		}

		this.core.speed(0);

		var left,
		    clear = $.proxy(this.clear, this),
		    previous = this.core.$stage.children().eq(this.previous),
		    next = this.core.$stage.children().eq(this.next),
		    incoming = this.core.settings.animateIn,
		    outgoing = this.core.settings.animateOut;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.css({ "left": left + "px" }).addClass("animated owl-animated-out").addClass(outgoing).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", clear);
		}

		if (incoming) {
			next.addClass("animated owl-animated-in").addClass(incoming).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", clear);
		}
	};

	Animate.prototype.clear = function (e) {
		$(e.target).css({ "left": "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
		this.core.transitionEnd();
	};

	/**
  * Destroys the plugin.
  * @public
  */
	Animate.prototype.destroy = function () {
		var handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {
	/**
  * Creates the autoplay plugin.
  * @class The Autoplay Plugin
  * @param {Owl} scope - The Owl Carousel
  */
	var Autoplay = function Autoplay(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Autoplay.Defaults, this.core.options);

		this.handlers = {
			"translated.owl.carousel refreshed.owl.carousel": $.proxy(function () {
				this.autoplay();
			}, this),
			"play.owl.autoplay": $.proxy(function (e, t, s) {
				this.play(t, s);
			}, this),
			"stop.owl.autoplay": $.proxy(function () {
				this.stop();
			}, this),
			"mouseover.owl.autoplay": $.proxy(function () {
				if (this.core.settings.autoplayHoverPause) {
					this.pause();
				}
			}, this),
			"mouseleave.owl.autoplay": $.proxy(function () {
				if (this.core.settings.autoplayHoverPause) {
					this.autoplay();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
  * Default options.
  * @public
  */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
  * @protected
  * @todo Must be documented.
  */
	Autoplay.prototype.autoplay = function () {
		if (this.core.settings.autoplay && !this.core.state.videoPlay) {
			window.clearInterval(this.interval);

			this.interval = window.setInterval($.proxy(function () {
				this.play();
			}, this), this.core.settings.autoplayTimeout);
		} else {
			window.clearInterval(this.interval);
		}
	};

	/**
  * Starts the autoplay.
  * @public
  * @param {Number} [timeout] - ...
  * @param {Number} [speed] - ...
  * @returns {Boolean|undefined} - ...
  * @todo Must be documented.
  */
	Autoplay.prototype.play = function (timeout, speed) {
		// if tab is inactive - doesnt work in <IE10
		if (document.hidden === true) {
			return;
		}

		if (this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion) {
			return;
		}

		if (this.core.settings.autoplay === false) {
			window.clearInterval(this.interval);
			return;
		}

		this.core.next(this.core.settings.autoplaySpeed);
	};

	/**
  * Stops the autoplay.
  * @public
  */
	Autoplay.prototype.stop = function () {
		window.clearInterval(this.interval);
	};

	/**
  * Pauses the autoplay.
  * @public
  */
	Autoplay.prototype.pause = function () {
		window.clearInterval(this.interval);
	};

	/**
  * Destroys the plugin.
  */
	Autoplay.prototype.destroy = function () {
		var handler, property;

		window.clearInterval(this.interval);

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {

	/**
  * Creates the navigation plugin.
  * @class The Navigation Plugin
  * @param {Owl} carousel - The Owl Carousel.
  */
	var Navigation = function Navigation(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Indicates whether the plugin is initialized or not.
   * @protected
   * @type {Boolean}
   */
		this._initialized = false;

		/**
   * The current paging indexes.
   * @protected
   * @type {Array}
   */
		this._pages = [];

		/**
   * All DOM elements of the user interface.
   * @protected
   * @type {Object}
   */
		this._controls = {};

		/**
   * Markup for an indicator.
   * @protected
   * @type {Array.<String>}
   */
		this._templates = [];

		/**
   * The carousel element.
   * @type {jQuery}
   */
		this.$element = this._core.$element;

		/**
   * Overridden methods of the carousel.
   * @protected
   * @type {Object}
   */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			"prepared.owl.carousel": $.proxy(function (e) {
				if (this._core.settings.dotsData) {
					this._templates.push($(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot"));
				}
			}, this),
			"add.owl.carousel": $.proxy(function (e) {
				if (this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, $(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot"));
				}
			}, this),
			"remove.owl.carousel prepared.owl.carousel": $.proxy(function (e) {
				if (this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			"change.owl.carousel": $.proxy(function (e) {
				if (e.property.name == "position") {
					if (!this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
						var current = this._core.current(),
						    maximum = this._core.maximum(),
						    minimum = this._core.minimum();
						e.data = e.property.value > maximum ? current >= maximum ? minimum : maximum : e.property.value < minimum ? maximum : e.property.value;
					}
				}
			}, this),
			"changed.owl.carousel": $.proxy(function (e) {
				if (e.property.name == "position") {
					this.draw();
				}
			}, this),
			"refreshed.owl.carousel": $.proxy(function () {
				if (!this._initialized) {
					this.initialize();
					this._initialized = true;
				}
				this._core.trigger("refresh", null, "navigation");
				this.update();
				this.draw();
				this._core.trigger("refreshed", null, "navigation");
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	};

	/**
  * Default options.
  * @public
  * @todo Rename `slideBy` to `navBy`
  */
	Navigation.Defaults = {
		nav: false,
		navRewind: true,
		navText: ["prev", "next"],
		navSpeed: false,
		navElement: "div",
		navContainer: false,
		navContainerClass: "owl-nav",
		navClass: ["owl-prev", "owl-next"],
		slideBy: 1,
		dotClass: "owl-dot",
		dotsClass: "owl-dots",
		dots: true,
		dotsEach: false,
		dotData: false,
		dotsSpeed: false,
		dotsContainer: false,
		controlsClass: "owl-controls"
	};

	/**
  * Initializes the layout of the plugin and extends the carousel.
  * @protected
  */
	Navigation.prototype.initialize = function () {
		var $container,
		    override,
		    options = this._core.settings;

		// create the indicator template
		if (!options.dotsData) {
			this._templates = [$("<div>").addClass(options.dotClass).append($("<span>")).prop("outerHTML")];
		}

		// create controls container if needed
		if (!options.navContainer || !options.dotsContainer) {
			this._controls.$container = $("<div>").addClass(options.controlsClass).appendTo(this.$element);
		}

		// create DOM structure for absolute navigation
		this._controls.$indicators = options.dotsContainer ? $(options.dotsContainer) : $("<div>").hide().addClass(options.dotsClass).appendTo(this._controls.$container);

		this._controls.$indicators.on("click", "div", $.proxy(function (e) {
			var index = $(e.target).parent().is(this._controls.$indicators) ? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, options.dotsSpeed);
		}, this));

		// create DOM structure for relative navigation
		$container = options.navContainer ? $(options.navContainer) : $("<div>").addClass(options.navContainerClass).prependTo(this._controls.$container);

		this._controls.$next = $("<" + options.navElement + ">");
		this._controls.$previous = this._controls.$next.clone();

		this._controls.$previous.addClass(options.navClass[0]).html(options.navText[0]).hide().prependTo($container).on("click", $.proxy(function (e) {
			this.prev(options.navSpeed);
		}, this));
		this._controls.$next.addClass(options.navClass[1]).html(options.navText[1]).hide().appendTo($container).on("click", $.proxy(function (e) {
			this.next(options.navSpeed);
		}, this));

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	};

	/**
  * Destroys the plugin.
  * @protected
  */
	Navigation.prototype.destroy = function () {
		var handler, control, property, override;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			this._controls[control].remove();
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	/**
  * Updates the internal state.
  * @protected
  */
	Navigation.prototype.update = function () {
		var i,
		    j,
		    k,
		    options = this._core.settings,
		    lower = this._core.clones().length / 2,
		    upper = lower + this._core.items().length,
		    size = options.center || options.autoWidth || options.dotData ? 1 : options.dotsEach || options.items;

		if (options.slideBy !== "page") {
			options.slideBy = Math.min(options.slideBy, options.items);
		}

		if (options.dots || options.slideBy == "page") {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: i - lower,
						end: i - lower + size - 1
					});
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	};

	/**
  * Draws the user interface.
  * @todo The option `dotData` wont work.
  * @protected
  */
	Navigation.prototype.draw = function () {
		var difference,
		    i,
		    html = "",
		    options = this._core.settings,
		    $items = this._core.$stage.children(),
		    index = this._core.relative(this._core.current());

		if (options.nav && !options.loop && !options.navRewind) {
			this._controls.$previous.toggleClass("disabled", index <= 0);
			this._controls.$next.toggleClass("disabled", index >= this._core.maximum());
		}

		this._controls.$previous.toggle(options.nav);
		this._controls.$next.toggle(options.nav);

		if (options.dots) {
			difference = this._pages.length - this._controls.$indicators.children().length;

			if (options.dotData && difference !== 0) {
				for (i = 0; i < this._controls.$indicators.children().length; i++) {
					html += this._templates[this._core.relative(i)];
				}
				this._controls.$indicators.html(html);
			} else if (difference > 0) {
				html = new Array(difference + 1).join(this._templates[0]);
				this._controls.$indicators.append(html);
			} else if (difference < 0) {
				this._controls.$indicators.children().slice(difference).remove();
			}

			this._controls.$indicators.find(".active").removeClass("active");
			this._controls.$indicators.children().eq($.inArray(this.current(), this._pages)).addClass("active");
		}

		this._controls.$indicators.toggle(options.dots);
	};

	/**
  * Extends event data.
  * @protected
  * @param {Event} event - The event object which gets thrown.
  */
	Navigation.prototype.onTrigger = function (event) {
		var settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotData ? 1 : settings.dotsEach || settings.items)
		};
	};

	/**
  * Gets the current page position of the carousel.
  * @protected
  * @returns {Number}
  */
	Navigation.prototype.current = function () {
		var index = this._core.relative(this._core.current());
		return $.grep(this._pages, function (o) {
			return o.start <= index && o.end >= index;
		}).pop();
	};

	/**
  * Gets the current succesor/predecessor position.
  * @protected
  * @returns {Number}
  */
	Navigation.prototype.getPosition = function (successor) {
		var position,
		    length,
		    options = this._core.settings;

		if (options.slideBy == "page") {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[(position % length + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += options.slideBy : position -= options.slideBy;
		}
		return position;
	};

	/**
  * Slides to the next item or page.
  * @public
  * @param {Number} [speed=false] - The time in milliseconds for the transition.
  */
	Navigation.prototype.next = function (speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	};

	/**
  * Slides to the previous item or page.
  * @public
  * @param {Number} [speed=false] - The time in milliseconds for the transition.
  */
	Navigation.prototype.prev = function (speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	};

	/**
  * Slides to the specified item or page.
  * @public
  * @param {Number} position - The position of the item or page.
  * @param {Number} [speed] - The time in milliseconds for the transition.
  * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
  */
	Navigation.prototype.to = function (position, speed, standard) {
		var length;

		if (!standard) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[(position % length + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;
})(window.Zepto || window.jQuery, window, document);

(function ($, window, document, undefined) {

	/**
  * Creates the hash plugin.
  * @class The Hash Plugin
  * @param {Owl} carousel - The Owl Carousel
  */
	var Hash = function Hash(carousel) {
		/**
   * Reference to the core.
   * @protected
   * @type {Owl}
   */
		this._core = carousel;

		/**
   * Hash table for the hashes.
   * @protected
   * @type {Object}
   */
		this._hashes = {};

		/**
   * The carousel element.
   * @type {jQuery}
   */
		this.$element = this._core.$element;

		/**
   * All event handlers.
   * @protected
   * @type {Object}
   */
		this._handlers = {
			"initialized.owl.carousel": $.proxy(function () {
				if (this._core.settings.startPosition == "URLHash") {
					$(window).trigger("hashchange.owl.navigation");
				}
			}, this),
			"prepared.owl.carousel": $.proxy(function (e) {
				var hash = $(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
				this._hashes[hash] = e.content;
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on("hashchange.owl.navigation", $.proxy(function () {
			var hash = window.location.hash.substring(1),
			    items = this._core.$stage.children(),
			    position = this._hashes[hash] && items.index(this._hashes[hash]) || 0;

			if (!hash) {
				return false;
			}

			this._core.to(position, false, true);
		}, this));
	};

	/**
  * Default options.
  * @public
  */
	Hash.Defaults = {
		URLhashListener: false
	};

	/**
  * Destroys the plugin.
  * @public
  */
	Hash.prototype.destroy = function () {
		var handler, property;

		$(window).off("hashchange.owl.navigation");

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != "function" && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;
})(window.Zepto || window.jQuery, window, document);
/**
 * The plugin initializes an element which persists and handles choices of the user.
 * It contains an wrapper element with the name the resource is known by.
 *
 * Author: Matthias Klebe
 **/

(function () {
	function PersistListSelection(node) {
		this.$rootNode = $(node);
		this.$listItems = $("[data-more-item]", this.$rootNode);
		this.shouldReloadAfterPick = this.$rootNode.data("should-reload") || false;
		this.chosenSelect = $("[data-chosen-entry-label]", node);
		this.$listItemsSet = [];
		this.$listItemsUnset = [];
		this.resourceName = "";
		this.choice = "";
		this.initialize();
	}

	// Is called after the user made a choice
	PersistListSelection.prototype.postChoice = function () {
		if (this.shouldReloadAfterPick) {
			window.location.reload();
		}
	};

	// Sets the persistent key on a new value
	PersistListSelection.prototype.setChoice = function (value) {
		if (typeof value === "undefined") {
			console.error("PersistListSelection cannot set choice");
			return false;
		}

		this.choice = value;
		this.setPersistantValue(value);
		this.postChoice();
	};

	// Resets the persistent value
	PersistListSelection.prototype.unsetChoice = function () {
		this.setPersistantValue("");
		this.postChoice();
	};

	// Checks th validity of the initialized Element and sets required values
	PersistListSelection.prototype.initialize = function () {
		var resourceName = this.$rootNode.data("persist-list-selection-name"),
		    that = this,
		    presetValue = "";

		// Check whether there is an name configured
		if (typeof resourceName === "undefined" || resourceName.length === 0) {
			console.error("PersistListSelection cannot initialize, no resourcename specified");
			return false;
		}

		this.resourceName = resourceName;
		presetValue = this.getPersistantValue();

		// Walk through all elements. When there is an element which is already chosen, mark it and put
		// it in the list of items which un-check the choice
		$.each(this.$listItems, function () {
			var $this = $(this),
			    itemValue = $this.data("more-item") || "";

			if (itemValue.length > 0 && itemValue === presetValue) {

				that.$listItemsUnset.push(this);
				$this.addClass("current");

				that.$rootNode.removeClass("choice-empty");

				//  Display the value of the selected entry in the area.
				that.chosenSelect.text($this.data("more-label"));
			} else {
				that.$listItemsSet.push(this);
			}
		});

		// Attach click handles for setting the choice
		$(this.$listItemsSet).on("click", function () {
			that.setChoice($(this).data("more-item"));
		});

		// Attach click handles for un-setting the choice
		$(this.$listItemsUnset).on("click", function () {
			that.unsetChoice();
		});
	};

	PersistListSelection.prototype.getPersistantValue = function () {
		return getCookieByName(this.resourceName);
	};

	PersistListSelection.prototype.setPersistantValue = function (value) {
		setCookie(this.resourceName, value);
	};

	// http://stackoverflow.com/questions/10730362/get-cookie-by-name
	function getCookieByName(name) {
		var value = "; " + window.document.cookie,
		    parts = value.split("; " + name + "=");

		if (parts.length === 2) {
			return parts.pop().split(";").shift();
		}
	}

	// http://stackoverflow.com/questions/26021281/set-cookie-with-js-for-whole-domain-not-specific-page
	function setCookie(name, value) {
		if (typeof name === "undefined" || name.length <= 0) {
			return false;
		}
		var d = new Date(),
		    expDays = 100;

		d.setTime(d.getTime() + expDays * 24 * 60 * 60 * 1000);

		window.document.cookie = name + "=" + value + "; expires=" + d.toUTCString() + ";path=/";
	}

	// Enable programmatic initialization
	$.fn.persistListSelection = function () {
		return this.each(function () {
			new PersistListSelection(this);
		});
	};

	// Initialize declarative
	$(document).ready(function () {
		$("[data-persist-list-selection-name]").addClass("choice-empty").persistListSelection();
	});
})();

jQuery(document).ready(function () {
	var triggerHref = function triggerHref(eventObject) {
		var that = this;
		if (!jQuery(eventObject.target).attr("href")) {
			var href = jQuery(that).parents(".teaser-leader").find(".teaser-headline-block .headline").find(".headline").find(".teaser__link").attr("href");
			if (!href) {
				href = jQuery(that).parents(".teaser-leader").find(".teaser__link").attr("href");
			}
			if (href) {
				window.location.href = href;
				return false;
			}
		}
	};

	jQuery(".teaser-leader .overlay").on("click", triggerHref);
	jQuery(".teaser-leader .headline").on("click", triggerHref);
});
/**
 * Created by akr on 11.03.16.
 */

/**
 * invode Page-Impression
 * @see FUNE-1682
 * @see FUNE-1700
 */
function invokePi() {
	if (typeof window.countIVW === "function") {
		try {
			window.countIVW();
		} catch (exp) {
			// console.log("Error invoking page impression: ", exp);
		}
	}
}

/**
 * invoke Add-Impressions
 * @see FUNE-1682
 * @see FUNE-1700
 */
function invokeAi() {
	if (typeof window.sas_callAds === "function") {
		try {
			window.sas_callAds();
		} catch (exp) {
			// console.log("Error invoking ad impression: ", exp);
		}
	}
}

function checkvisible($elm) {
	var vpH = jQuery(window).height(),
	    // Viewport Height
	st = jQuery(document).scrollTop(),
	    // Scroll Top
	y = $elm.offset().top,
	    // Element offset from top
	lh = 400; // Look-ahead offset

	return y < vpH + st + lh;
}

function activateVisiblePicturefills() {
	jQuery("span.lazyload").each(function (i, elm) {
		var $elm = jQuery(elm);

		if (checkvisible($elm)) {
			var content = $elm.html(),
			    id = $elm.attr("id") || "picture-" + new Date().getTime(),
			    $pic = jQuery("<picture id=" + id + ">" + content + "</picture>").addClass($elm.attr("class")),
			    pic = $pic[0];

			$elm.after($pic); // insert the picture
			$elm.remove(); // remove the span
			$pic.removeClass("lazyload");

			window.picturefill({ elements: [pic] });
		}
	});
}

jQuery("document").ready(function () {
	activateVisiblePicturefills();
	jQuery(window).on("scroll", activateVisiblePicturefills);
});

/* Implementation of Quiz Functions
	Author: Matthias Klebe
*/

$.fn.poll = function () {};

function PollSelect(rootNode) {
	var that = this,
	    $answerList = $(rootNode).find(".poll__answer");

	jQuery(rootNode).on("click", function () {

		$answerList.each(function (idx, item) {

			var $item = $(item);

			if ($item.find(".poll__answer__input").is(":checked")) {
				$item.addClass("selected");
			} else {
				$item.removeClass("selected");
			}
		});
	});
}

jQuery.fn.pollSelect = function () {
	return this.each(function () {
		new PollSelect(this);
	});
};

function PortalWeather(rootNode, opts) {

	this.rootNode = rootNode;
	this.city = opts.city;
	this.plz = opts.plz;
	this.proxyPath = opts.proxyPath;
	this.dataUrl = this.proxyPath + "?service=jsonp&url=https://api.wetterkontor.de/json/funke/wr_json.asp?s=" + this.plz + "&list=0&int=0&dt=0&name=" + this.city;
	this.setupWeatherData();
}

PortalWeather.prototype.setupWeatherData = function () {
	var that = this,
	    globalWeatherClass = "icon-wetter ";

	jQuery.ajax({
		type: "GET",
		async: true,
		cache: true,
		url: this.dataUrl,
		dataType: "jsonp",
		jsonp: "callback",
		jsonpCallback: "jsonp_callback",
		success: function success(data) {
			that.currentDayNight = data.actual_weather.daynight;
			that.temperature = Math.round(data.actual_weather.temperature) + " °C";
			that.weatherSymbol = data.actual_weather.weather_symbol;

			// window.console.log("Selector", that.currentDayNight, that.temperature, that.weatherSymbol);

			if (that.weatherSymbol === "sonnig") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-sonnig-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-sonnig-nacht";
				}
			}

			if (that.weatherSymbol === "heiter") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-heiter-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-heiter-nacht";
				}
			}

			if (that.weatherSymbol === "wolkig" || that.weatherSymbol === "wolkig_n") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-wolkig-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-wolkig-nacht";
				}
			}

			if (that.weatherSymbol === "starkbewoelkt" || that.weatherSymbol === "starkbewoelkt_n") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-stark-bewoelkt-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-stark-bewoelkt-nacht";
				}
			}

			if (that.weatherSymbol === "bedeckt" || that.weatherSymbol === "bedeckt_n") {
				that.WeatherSymbol = "wetter--icon-bedeckt-tag";
			}

			if (that.weatherSymbol === "spruehregen" || that.weatherSymbol === "spruehregen_n") {
				that.WeatherSymbol = "wetter--icon-sprueh-nieselregen-tag";
			}

			if (that.weatherSymbol === "regen" || that.weatherSymbol === "regen_n") {
				that.WeatherSymbol = "wetter--icon-regen-tag";
			}

			if (that.weatherSymbol === "schneeregen" || that.weatherSymbol === "schneeregen_n") {
				that.WeatherSymbol = "wetter--icon-schneeregen-tag";
			}

			if (that.weatherSymbol === "schneefall" || that.weatherSymbol === "schneefall_n") {
				that.WeatherSymbol = "wetter--icon-schneefall-tag";
			}

			if (that.weatherSymbol === "schneegriesel" || that.weatherSymbol === "schneegriesel_n") {
				that.WeatherSymbol = "wetter--icon-schneegriesel-tag";
			}

			if (that.weatherSymbol === "regenschauer" || that.weatherSymbol === "regenschauer_n") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-regenschauer-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-regenschauer-nacht";
				}
			}

			if (that.weatherSymbol === "schneeschauer") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-schneeschauer-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-schneeschauer-nacht";
				}
			}

			if (that.weatherSymbol === "schneeregenschauer") {
				if (that.currentDayNight === "day") {
					that.WeatherSymbol = "wetter--icon-schneeregenschauer-tag";
				} else {
					that.WeatherSymbol = "wetter--icon-schneeregenschauer-nacht";
				}
			}

			if (that.weatherSymbol === "gewitter") {
				that.WeatherSymbol = "wetter--icon-gewitter-tag";
			}

			if (that.weatherSymbol === "gefrierenderregen") {
				that.WeatherSymbol = "wetter--icon-gewitter-tag";
			}

			if (that.weatherSymbol === "nebel") {
				that.WeatherSymbol = "wetter--icon-nebel-tag";
			}

			jQuery(".temperature").html("<span>" + that.temperature + "</span><span class='" + globalWeatherClass + that.WeatherSymbol + "'></span>");
		}
	});
};

jQuery.fn.portalWeather = function (opts) {
	return this.each(function () {
		new PortalWeather(this, opts);
	});
};

/* Implementation of print view Functions
 Author: Matthias Klebe
 */

function Print(rootNode) {
	var that = this;

	this.$body = jQuery("body");
	this.$document = jQuery(document);

	jQuery(rootNode).on("click", function () {
		that.$body.fadeToggle("slow", function () {
			that.openPrint();
		});
	});

	if (!this.$document.data("print-initialized")) {
		this.initToolbar();
	}
}

Print.prototype.initToolbar = function () {
	var that = this;

	this.$document.data("print-initialized", true);

	this.$document.on("click", ".body__print .print-noimages", function () {
		that.hideImagesPrint();
	});

	this.$document.on("click", ".body__print .print-back", function () {
		that.$body.fadeToggle("slow", function () {
			jQuery(this).removeClass("body__print");
			jQuery(".print-bar").remove();
			jQuery(".print-header-adress").remove();

			that.closePrint();
		});
	});
};

Print.prototype.closePrint = function () {
	this.$body.fadeToggle("slow", function () {
		jQuery(this).removeAttr("style");
	});
};

Print.prototype.openPrint = function () {
	if (!this.$body.hasClass("body__print")) {
		var url = window.location.href,
		    printBar = "<div class='print-bar'>" + "<div class='print-nav'><span class='print-noimages'>Bilder ausblenden</span>" + "<span class='print-page'> <a href='javascript:window.print();'>Seite drucken</a>" + "</span><span class='print-back'>zurück zum Artikel</span></div></div>";

		this.$body.addClass("body__print");

		jQuery(".page-wrapper").prepend(printBar);

		jQuery(".nav-main ").append("<div class='print-header-adress'>Adresse dieses Artikels:" + "<a class='print-header-adress-link' href='" + url + "'>" + url + "</a></div>");

		jQuery(window).scrollTop(0);

		this.$body.fadeToggle("slow", function () {
			jQuery(this).removeAttr("style");
		});
	}
};

Print.prototype.hideImagesPrint = function () {
	if (!this.$body.hasClass("body__print--imagehide")) {
		this.$body.addClass("body__print--imagehide");
		jQuery(".print-noimages").text("Bilder einblenden");
	} else {
		this.$body.removeClass("body__print--imagehide");
		jQuery(".print-noimages").text("Bilder ausblenden");
	}
};

jQuery.fn.print = function (options) {
	return this.each(function () {
		new Print(this, options);
	});
};

/* Implementation of Quiz Functions
	Author: Matthias Klebe
*/

function Quiz(rootNode) {

	this.result = [];
	this.$rootNode = $(rootNode);
	this.currentCount = 0;
	this.totalCount = this.$rootNode.find(".quiz__item").length;

	var that = this;

	this.bindEvents();
	this.updateUI();

	this.$rootNode.on("questionAnswered", function (event, pickNode) {

		that.result.push(that.evaluateAnswer(pickNode));
		that.updateUI(pickNode);
		that.showAnswer(pickNode);
	});

	// Whe the next page is triggert decide wether the next question or the result should be shown
	this.$rootNode.on("nextPage", function () {
		if (that.result.length === that.totalCount) {
			that.showResult(rootNode, that.result);
		} else {
			that.nextQuestion();
			that.currentCount++;
		}
	});
}

// Bind the UI-Events to the Quizlogic
Quiz.prototype.bindEvents = function () {

	var that = this;

	// Trigger the restart of the quiz
	this.$rootNode.on("click", ".quiz__restart", function (e) {
		e.preventDefault();
		that.restartQuiz();
	});

	// Trigger the next Page
	this.$rootNode.on("click", ".quiz-frage__next", function () {
		that.$rootNode.trigger("nextPage");
	});

	// Trigger the click on an answer
	this.$rootNode.on("click", ".quiz-answer", function () {
		if ($(this).closest(".lock").length === 0) {
			that.$rootNode.trigger("questionAnswered", [this]);
		}
	});
};

Quiz.prototype.showAnswer = function (pickNode) {
	var $pickNode = $(pickNode);

	if ($pickNode.find(".quiz-richtig").length > 0) {
		this.$rootNode.find(".quiz-antwort").removeClass("quiz-antwort--falsch").addClass("quiz-antwort--richtig").find("p:first-child").text("Das war richtig!");
		$pickNode.find(".quiz-richtig").addClass("quiz-richtig--selected");
	} else {
		this.$rootNode.find(".quiz-antwort").removeClass("quiz-antwort--richtig").addClass("quiz-antwort--falsch").find("p:first-child").text("Das war leider falsch!");
		$pickNode.find(".quiz-falsch").addClass("quiz-falsch--selected");
	}

	this.$rootNode.find(".quiz-antwort").slideToggle("fast");
};

// Update the result accourding the answer
Quiz.prototype.evaluateAnswer = function (pickNode) {

	return $(pickNode).find(".quiz-richtig").length > 0 ? 1 : 0;
};

// Draw
Quiz.prototype.updateUI = function (pickNode) {
	$(pickNode).closest(".quiz__item").addClass("lock");

	if (this.totalCount === this.currentCount + 1) {
		this.$rootNode.find(".quiz-frage__next").text("zum Ergebnis");
	}
};

Quiz.prototype.restartQuiz = function () {
	window.location.reload();
};

Quiz.prototype.nextQuestion = function () {
	var $idxItem = this.$rootNode.find(".quiz__index").eq(this.currentCount),
	    $questionItem = this.$rootNode.find(".quiz__item").eq(this.currentCount).hide().next().show();

	this.$rootNode.find(".quiz__page").text("Frage " + (this.currentCount + 2) + " von " + this.totalCount);
	$idxItem.addClass("quiz__index--done").next().addClass("quiz__index--active");
	this.$rootNode.find(".quiz-antwort").hide();
	$questionItem.trigger("redraw");
};

Quiz.prototype.showResult = function () {

	var $resultList = this.$rootNode.find(".quiz-result__questions__item"),
	    rightCount = 0,
	    that = this;

	this.$rootNode.find(".quiz__page").hide();
	this.$rootNode.find(".quiz__positions").hide();
	this.$rootNode.find(".quiz__list").hide();
	this.$rootNode.find(".quiz-form").show();

	for (var i = 0; i < this.result.length; i++) {
		rightCount += this.result[i];
	}

	var answerValue = 100 / this.totalCount,
	    rightRelative = Math.round(answerValue * rightCount),
	    wrongRelative = 100 - rightRelative;

	this.$rootNode.find(".quiz-result__bar--right").width(rightRelative + "%");
	this.$rootNode.find(".quiz-result__bar--wrong").width(wrongRelative + "%");
	this.$rootNode.find(".quiz-result__result").text(rightCount + " von " + this.totalCount);

	$resultList.each(function (idx, value) {
		$(value).addClass(that.result[idx] ? "right" : "wrong");
	});
};

$.fn.quiz = function () {
	return this.each(function () {
		new Quiz(this);
	});
};

/**
 * Created by Vincent on 11-Jan-18.
 */

function Redirect(rootNode, opts) {
	this.rootNode = rootNode;

	this.initRedirect(rootNode, opts);
}

Redirect.prototype.initRedirect = function (rootNode, opts) {
	var referral = getUrlParam(opts.urlParam);

	if (referral !== "") {
		var url = decodeURIComponent(referral);
		if (opts.destParam !== "" && opts.destParam !== undefined) {
			if (url.indexOf("?") !== -1) {
				url = url + "&" + opts.destParam;
			} else {
				url = url + "?" + opts.destParam;
			}
		}

		$(rootNode).find(".redirect-link").attr("href", url);
		$(rootNode).show();

		$(rootNode).find(".redirect-close").click(function () {
			$(rootNode).fadeOut();
		});

		if (opts.fadeOutTime > 0) {
			setTimeout(function () {
				$(rootNode).fadeOut();
			}, opts.fadeOutTime);
		}
	}

	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)",
		    regex = new RegExp(regexS),
		    results = regex.exec(window.location.href);

		if (results == null) {
			return "";
		} else {
			return results[1];
		}
	}
};

jQuery.fn.redirect = function (opts) {
	return this.each(function () {
		new Redirect(this, opts);
	});
};

function RedirectionSelectbox(rootNode) {
	var that = this;

	jQuery(rootNode).on("change", function (e) {
		var link = $(this).find("option:selected").data("redirection");
		window.location.href = link || window.location.href;
	});
}

jQuery.fn.redirectionSelectbox = function () {
	return this.each(function () {
		new RedirectionSelectbox(this);
	});
};
/**
 * Created by Vincent on 08-Feb-18.
 */

jQuery(document).ready(function () {
	// Class "next_article" is applied via content-studio
	// it's used on RWP on the bottom of article pages (FDC-2076)
	var nextArticle = $(".next_article"),
	    href = nextArticle.find(".article__header__link").attr("href"),
	    relatedArticleImage = nextArticle.find(".hero-img");

	if (relatedArticleImage.length !== 0) {
		relatedArticleImage.click(function () {
			window.location.href = href;
		});
	}
});
/* Scribble Live Api (c) 2016 Author: Peter Marhewka */

function ScribbleLive(rootNode, opts) {
	this.rootNode = rootNode;
	this.opts = opts;
	this.proxyPath = opts.proxyPath;
	this.setupElements();
	this.appendApiScripts();
}

ScribbleLive.prototype.appendApiScripts = function () {
	var that = this,
	    facebookSdkVersion = "v2.8",
	    facebookSdkAppId = "1650819678556421";

	// Facebook Api
	if (jQuery("script[src='//connect.facebook.net/de_DE/all.js']").length === 0) {
		(function () {
			var e = document.createElement("script");
			e.async = true;
			e.src = "//connect.facebook.net/de_DE/all.js";

			if (jQuery("#fb-root").length) {
				document.getElementById("fb-root").appendChild(e);
			}
		})();
	}

	window.fbAsyncInit = function () {
		window.FB.init({
			appId: facebookSdkAppId,
			autoLogAppEvents: true,
			xfbml: true,
			version: facebookSdkVersion
		});

		window.FB.AppEvents.logPageView();
	};

	// Twitter Api
	if (jQuery("script[src='//platform.twitter.com/widgets.js']").length === 0) {
		window.twttr = function (d, s, id) {
			var js,
			    fjs = d.getElementsByTagName(s)[0],
			    t = window.twttr || {};
			if (d.getElementById(id)) {
				return t;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "//platform.twitter.com/widgets.js";
			fjs.parentNode.insertBefore(js, fjs);

			t._e = [];
			t.ready = function (f) {
				t._e.push(f);
			};

			return t;
		}(document, "script", "twitter-wjs");
	}

	// Instagram Api
	if (jQuery("script[src='//platform.instagram.com/en_US/embeds.js']").length === 0) {
		this.jsCode = document.createElement("script");
		this.jsCode.type = "text/javascript";
		this.jsCode.async = true;
		this.jsCode.defer = true;
		this.jsCode.setAttribute("src", "//platform.instagram.com/en_US/embeds.js");
		document.body.appendChild(this.jsCode);
	}
};

ScribbleLive.prototype.setupElements = function () {
	var that = this,
	    scribbleLiveHTML = "<div class='scribble-live-title'></div>" + "<div class='scribble-live-description'></div>" + "<div class='scribble-live-wrapper scribble-animate'>" + "<ul class='scribble-live-list'><li class='scribble-list-item scribble-loader scribble-list-item-start'></li></ul>" + "<div class='dots-after'></div>" + "<div class='scribble-load-more-outer'>" + "<div class='scribble-load-more'>Mehr laden</div>" + "</div>" + "</div>";

	jQuery(this.rootNode).html(scribbleLiveHTML);

	setTimeout(function () {
		that.getScribbleLiveList("init");
		that.bindEvents();
	}, 200);
};

ScribbleLive.prototype.bindEvents = function () {
	var that = this;
	jQuery(this.rootNode).find(".scribble-load-more").on("click", function () {
		var elementsLength = jQuery(that.rootNode).find(".scribble-live-list").find(".scribble-list-item").length;
		that.setupScribbleLiveList("refresh", elementsLength);
		jQuery(this).addClass("scribble-live-loading").text("wird geladen");

		setTimeout(function () {
			var elementsLength = jQuery(that.rootNode).find(".scribble-live-list").find(".scribble-list-item").length;
			that.setupScribbleLiveList("loadmore", elementsLength);
		}, 200);
	});
};

ScribbleLive.prototype.getScribbleLiveList = function (elementsLength) {
	this.eventUrl = "//apiv1.scribblelive.com/event/" + this.opts.EventId + "/page/?Token=" + this.opts.APIToken + "&pageSize=1000&Order=asc&format=json";
	this.setupScribbleLiveList(elementsLength);
};

ScribbleLive.prototype.setupScribbleLiveList = function (action, elementsLength) {
	var that = this,
	    jsonIdArray = [];

	jQuery.ajax({
		typ: "GET",
		async: true,
		cache: true,
		jsonpCallback: "jsonCallback",
		url: this.eventUrl,
		dataType: "jsonp",
		success: function success(data) {
			jQuery(that.rootNode).find(".scribble-live-title").text(data.Title);

			if (data.IsLive === 1) {
				jQuery(that.rootNode).find(".scribble-live-title").append("<div class='scribble-live-state'>live</div>");
			} else {
				jQuery(that.rootNode).find(".scribble-live-state").remove();
			}

			if (data.Description !== "") {
				jQuery(that.rootNode).find(".scribble-live-description").text(data.Description);
				jQuery(that.rootNode).find(".scribble-live-description").css("display", "block");
			} else {
				jQuery(that.rootNode).find(".scribble-live-description").css("display", "none");
			}
			try {
				jQuery.each(data.Posts, function (index, value) {
					that.postId = data.Posts[index].Id;
					that.type = data.Posts[index].Type;
					that.Created = data.Posts[index].Created;
					that.Content = data.Posts[index].Content;
					that.socialPlattform = data.Posts[index].PostMeta;
					that.socialPlattformTwitter = data.Posts[index].Source;

					// Check Entry for Social-Meida Posts and set some vars
					that.socialPlattformContent = data.Posts[index].Content;
					that.socialPlattform = data.Posts[index].PostMeta;

					// Facebook URL
					if (that.socialPlattform.Type === "facebook:post" || that.socialPlattform.source === "facebook") {

						if (that.socialPlattform.Type === "facebook:post") {
							that.isSocialPlattformUrl = JSON.parse(that.socialPlattform.Facebook).link;
							that.isSocialPlattformType = JSON.parse(that.socialPlattform.Facebook).type;
							that.Source = "von " + JSON.parse(that.socialPlattform.Facebook).from.name + " via Facebook";
						} else {
							that.isSocialPlattformUrl = JSON.parse(that.socialPlattform.data).link;
							that.isSocialPlattformType = JSON.parse(that.socialPlattform.data).type;
							that.Source = "von " + JSON.parse(that.socialPlattform.data).from.name + " via Facebook";

							if (that.isSocialPlattformType === "link") {
								that.isSocialPlattformType = "post";
							}
						}
					}

					// Twitter URL
					else if (that.socialPlattform.Type === "twitter:tweet" || that.socialPlattform.source === "twitter") {
							// that.isSocialPlattformUrl = JSON.parse(that.socialPlattform.Tweet).id_str;
							that.isSocialPlattformUrl = that.socialPlattformTwitter;
							that.isSocialPlattformUrl = that.isSocialPlattformUrl.replace("<a href='", "");
							that.isSocialPlattformUrl = that.isSocialPlattformUrl.replace("'>twitter</a>", "");
							that.Source = "von " + JSON.parse(that.socialPlattform.Tweet).user.name + " via Twitter";
						}

						// Instagram URL
						else if (that.socialPlattform.Type === "instagram:post") {
								that.isSocialPlattformUrl = JSON.parse(that.socialPlattform.Instagram).link;
								that.Source = "von " + JSON.parse(that.socialPlattform.Instagram).user.full_name + " via Instagram";
							} else if (that.socialPlattform.Type === "youtube:post") {
								that.Source = "von " + JSON.parse(that.socialPlattform.Youtube).snippet.channelTitle + " via Youtube";
							}

							// Scribble posts
							else if (that.type === "IMAGE") {
									that.Image = data.Posts[index].Media[0].Url;
								} else if (that.type === "VIDEO") {
									that.Video = "<video class='embed-video' controls poster='" + data.Posts[index].Media[1].Url + "'><source src='" + data.Posts[index].Media[0].Url + "' type='video/mp4'><source src='movie.ogg' type='video/ogg'>Your browser does not support the video tag.</video>";
								} else if (that.type === "AUDIO") {
									that.Audio = "<audio class='embed-audio' controls><source src='" + data.Posts[index].Media[0].Url + "' type='audio/mpeg'><source src='audio.ogg' type='audio/ogg'>Your browser does not support the audio tag.</audio>";
								} else {
									if (data.Posts[index].Creator.Avatar !== "") {
										that.scribbleAvatar = "<span class='scribble-list-content-avatar'><img src='" + data.Posts[index].Creator.Avatar + "'></span>";
										that.Source = that.scribbleAvatar + "<span class='scribble-list-content-author'>von " + data.Posts[index].Creator.Name + "</span>";
									} else {
										that.Source = "von " + data.Posts[index].Creator.Name;
									}
								}

					if (that.type === "VIDEO" || that.type === "AUDIO" || that.type === "IMAGE" && that.socialPlattform.Type !== "instagram:post") {
						if (data.Posts[index].Creator.Avatar !== "") {
							that.scribbleAvatar = "<span class='scribble-list-content-avatar'><img src='" + data.Posts[index].Creator.Avatar + "'></span>";
							that.Source = that.scribbleAvatar + "<span class='scribble-list-content-author'>von " + data.Posts[index].Creator.Name + "</span>";
						} else {
							that.Source = "von " + data.Posts[index].Creator.Name;
						}
					}

					if (data.Posts[index].IsStuck === 1) {
						this.StuckClass = "stucked";
					} else {
						this.StuckClass = "";
					}

					if (action !== "loadmore") {
						if (jQuery("#scribbleLive-" + data.Posts[index].Id).length === 0) {
							if (action === "refresh") {
								if (index < that.opts.preloadLimit) {

									var newPostHTML = "<li data-public='1' id='scribbleLive-" + data.Posts[index].Id + "' class='scribble-list-item new scribble-loader " + this.StuckClass + "'><div class='scribble-list-time'></div><div class='scribble-list-content scribble-animate'></div></li>";

									if (jQuery(that.rootNode).find(".new").length === 0) {
										if (jQuery(that.rootNode).find(".stucked").length === 0) {
											jQuery(that.rootNode).find(".scribble-live-list").prepend(newPostHTML);
											that.placeScribbleLivePost(that.Source);
										} else {
											jQuery(newPostHTML).insertAfter(".stucked:last");
											that.placeScribbleLivePost(that.Source);
										}
									} else {
										jQuery(newPostHTML).insertAfter(".new:last");
										that.placeScribbleLivePost(that.Source);
									}
								}
							} else {
								if (index < that.opts.preloadLimit) {
									jQuery(that.rootNode).find(".scribble-live-list").append("<li data-public='1' id='scribbleLive-" + data.Posts[index].Id + "' class='scribble-list-item scribble-loader " + this.StuckClass + "'><div class='scribble-list-time'></div><div class='scribble-list-content scribble-animate'></div></li>");
									that.placeScribbleLivePost(that.Source);
								}
							}
						} else {
							// Reinit List after set or reset Sticky Post
							if (!jQuery("#scribbleLive-" + data.Posts[index].Id).hasClass("stucked") && data.Posts[index].IsStuck === 1) {
								var stuckedHtml = jQuery("#scribbleLive-" + data.Posts[index].Id).html();

								setTimeout(function () {
									jQuery("#scribbleLive-" + data.Posts[index].Id).remove();
									jQuery(that.rootNode).find(".scribble-live-list").prepend("<li data-public='1' id='scribbleLive-" + data.Posts[index].Id + "' class='scribble-list-item stucked'>" + stuckedHtml + "</li>");
								}, 200);
							} else if (jQuery("#scribbleLive-" + data.Posts[index].Id).hasClass("stucked") && data.Posts[index].IsStuck === 0) {
								jQuery(that.rootNode).find(".scribble-live-list").html("");
								setTimeout(function () {
									that.getScribbleLiveList("init");
								}, 200);
							}

							// Update HTML Content
							if (that.Content !== jQuery("#scribbleLive-" + data.Posts[index].Id).find(".scribble-list-content-inner").html()) {
								jQuery("#scribbleLive-" + data.Posts[index].Id).find(".scribble-list-content-inner").html(that.Content);
							}
						}
					} else {
						if (index >= elementsLength && index < elementsLength + that.opts.preloadLimit) {
							jQuery(that.rootNode).find(".scribble-live-list").append("<li data-public='1' id='scribbleLive-" + data.Posts[index].Id + "' class='scribble-list-item scribble-loader" + this.StuckClass + "'><div class='scribble-list-time'></div><div class='scribble-list-content scribble-animate'></div></li>");
							that.placeScribbleLivePost(that.Source);
						}
					}

					jsonIdArray.push("scribbleLive-" + data.Posts[index].Id);

					if (index === data.Posts.length - 1 && data.Posts.length > that.opts.preloadLimit) {
						var lastPost = jQuery(that.rootNode).find(".scribble-list-item").last().attr("id");
						if (lastPost === "scribbleLive-" + data.Posts[data.Posts.length - 1].Id) {
							jQuery(that.rootNode).find(".scribble-load-more").css("visibility", "hidden");
						}
					}

					setTimeout(function () {
						jQuery(that.rootNode).find(".scribble-list-item").removeClass("new");
					}, 1000);
				});
			} catch (err) {
				window.console.log("SCRIBBLE-LIVE:", err.message);
			}
		}
	}).done(function () {
		if (action !== "loadmore") {
			that.refreshScribbleLiveList();

			setTimeout(function () {
				that.deletePost(jsonIdArray);
			}, 1000);
		}

		jQuery(that.rootNode).find(".scribble-list-item-start").remove();
		jQuery(that.rootNode).find(".scribble-load-more").removeClass("scribble-live-loading").text("Mehr laden");
	});
};

ScribbleLive.prototype.deletePost = function (jsonIdArray) {
	var elementIdArray = [],
	    array1 = jsonIdArray,
	    array2 = elementIdArray,
	    difference = [],
	    i = 0;

	jQuery(".scribble-live-list").find(".scribble-list-item").each(function (index) {
		elementIdArray.push(jQuery(this).attr("id"));
	});

	setTimeout(function () {
		jQuery.grep(array2, function (el) {
			if (jQuery.inArray(el, array1) === -1) {
				difference.push(el);
				i++;
			}
		});

		jQuery.each(difference, function (i, l) {
			jQuery("#" + l).remove();
		});
	}, 200);

	setTimeout(function () {
		elementIdArray = [];
	}, 500);
};

ScribbleLive.prototype.placeScribbleLivePost = function (postCredits) {
	// window.console.log("Credits: " + postCredits);

	// convert Date
	var convertDate = this.Created.replace("\/", "");

	convertDate = convertDate.replace(")/", "");
	convertDate = convertDate.replace("Date(", "");
	convertDate = convertDate.replace("+0000", "");
	convertDate = parseInt(convertDate, 10);

	/* ##### Convert Post Date ##### */
	this.postDate = new Date(convertDate);

	// Month
	if (this.postDate.getMonth() + 1 < 10) {
		this.month = "0" + (this.postDate.getMonth() + 1);
	} else {
		this.month = this.postDate.getMonth() + 1;
	}

	// Day
	if (this.postDate.getDate() < 10) {
		this.day = "0" + this.postDate.getDate();
	} else {
		this.day = this.postDate.getDate();
	}

	// Hours
	if (this.postDate.getHours() < 10) {
		this.hours = "0" + this.postDate.getHours();
	} else {
		this.hours = this.postDate.getHours();
	}

	// Minutes
	if (this.postDate.getMinutes() < 10) {
		this.minutes = "0" + this.postDate.getMinutes();
	} else {
		this.minutes = this.postDate.getMinutes();
	}

	// Set Credits & Post Date
	this.creditsHTML = "<span class='scribble-list-content-credits'>" + postCredits + "</span>";
	this.postDateRender = "<span class='scribble-date'>" + this.day + "." + this.month + "." + this.postDate.getFullYear() + "</span><span class='scribble-time'>" + this.hours + ":" + this.minutes + "</span>";

	// Get HTML by post Type
	this.loadStandardPosts(this.creditsHTML);
};

ScribbleLive.prototype.loadStandardPosts = function (postCredits) {
	if (this.socialPlattform.Type === undefined && this.socialPlattform.source === undefined) {
		if (this.type === "POLL") {
			this.postHtml = "<div class='scrbbl-embed scrbbl-embed-poll' data-src='/post/" + this.postId + "'></div>" + "<script>(function(d, s, id) {" + "var js,ijs=d.getElementsByTagName(s)[0];" + "if(d.getElementById(id))return;" + "js=d.createElement(s);js.id=id;" + "js.src='//embed.scribblelive.com/widgets/embed.js';" + "ijs.parentNode.insertBefore(js, ijs);" + "}(document, 'script', 'scrbbl-js'));</script>";
			this.loadHtml(this.postId, this.postDateRender, this.postHtml);
		} else if (this.type === "TEXT" || this.type === "EMBED") {
			this.postHtml = "<div class='scribble-list-content-html'><div class='scribble-list-content-inner'>" + this.Content + "</div>" + postCredits + "</div>";
			this.loadHtml(this.postId, this.postDateRender, this.postHtml);
		} else if (this.type === "IMAGE") {
			this.postHtml = "<div class='scribble-list-content-image'>" + "<img src='" + this.Image + "'>" + "</div>" + "<div class='scribble-list-content-html'><p>" + this.Content + "</p>" + postCredits + "</div>";
			this.loadHtml(this.postId, this.postDateRender, this.postHtml);
		} else if (this.type === "AUDIO") {
			this.postHtml = "<div class='scribble-list-content-audio'>" + this.Audio + "</div>" + "<div class='scribble-list-content-html'><p>" + this.Content + "</p>" + postCredits + "</div>";
			this.loadHtml(this.postId, this.postDateRender, this.postHtml);
		} else if (this.type === "VIDEO") {
			this.postHtml = "<div class='scribble-list-content-video'>" + this.Video + "</div>" + "<div class='scribble-list-content-html'><p>" + this.Content + "</p>" + postCredits + "</div>";

			this.loadHtml(this.postId, this.postDateRender, this.postHtml);
		} else if (this.type === "HTML") {
			this.postHtml = "<div class='scribble-list-content-html'>" + this.Content + "</div>" + postCredits + "</div>";
			this.videoTest = this.postHtml.indexOf("scrbbl-post-embed") !== -1;
			this.slideShowTest = this.postHtml.indexOf("data-url") !== -1;
			this.loadHtml(this.postId, this.postDateRender, this.postHtml);

			if (this.videoTest === true || this.slideShowTest === true) {
				this.htmlElement = jQuery("#scribbleLive-" + this.postId).find(".scrbbl-post-embed");
			}

			if (this.videoTest === true) {
				this.videoUrl = this.htmlElement.attr("data-url");
				this.videoHTML = "<video class=\"scrbbl-post-embed-video-player\" width=\"320\" height=\"240\" controls controlsList=\"nodownload\">\n" + "  <source src='" + this.videoUrl + "' type=\"video/mp4\">\n" + "Your browser does not support the video tag.\n" + "</video>";
				this.htmlElement.html(this.videoHTML);
			}
			if (this.slideShowTest === true) {
				var SLCountElement = document.createElement("script");
				SLCountElement.src = this.htmlElement.attr("data-url");
				this.htmlElement.append(SLCountElement);

				// Remove unused .sl-slideshow Element from Body Element
				var slideshowIntervall = setInterval(function () {
					slideshowCheck();
				}, 100);
			}
		}
	} else {
		this.loadSocialPosts(this.postId, this.postDateRender, postCredits);
	}

	// Remove unused .sl-slideshow Element from Body Element
	function slideshowCheck() {
		var slideShowRendered = jQuery("body > .sl-slideshow").length;

		if (slideShowRendered === 1) {
			slideshowCheckStop();
			jQuery("body > .sl-slideshow").remove();
		}
	}

	function slideshowCheckStop() {
		clearInterval(slideshowIntervall);
	}
};

ScribbleLive.prototype.loadSocialPosts = function (postId, postDate, postCredits) {
	var that = this;

	if (this.socialPlattform.Type === "twitter:tweet" || this.socialPlattform.source === "twitter") {
		jQuery.ajax({
			typ: "GET",
			async: true,
			cache: true,
			// url: "https://api.twitter.com/1/statuses/oembed.json?id=" + this.isSocialPlattformUrl + "&omit_script=true",
			url: "https://publish.twitter.com/oembed?url=" + this.isSocialPlattformUrl + "&omit_script=true",
			dataType: "jsonp",
			success: function success(data) {
				that.postHtml = data.html + postCredits;
			}
		}).done(function (data) {
			that.loadHtml(postId, postDate, that.postHtml);
		});
	} else if (this.socialPlattform.Type === "instagram:post") {
		jQuery.ajax({
			typ: "GET",
			async: true,
			cache: true,
			url: "https://api.instagram.com/oembed?url=" + this.isSocialPlattformUrl + "&omitscript=true",
			dataType: "jsonp",
			success: function success(data) {
				that.postHtml = data.html + postCredits;
			}
		}).done(function (data) {
			that.loadHtml(postId, postDate, that.postHtml);
		});
	} else if (this.socialPlattform.Type === "youtube:post") {
		this.loadHtml(postId, postDate, that.socialPlattformContent + postCredits);
		jQuery(this.rootNode).find(".youtubePlayer").parent().addClass("scribble-list-content-video");
	}

	// Facebook nutzt Funke Escenic Proxy unter Pfad /nr/proxy/
	// Bsp. Proxy: http://uat2-live.morgenpost.de/nr/proxy/?service=json&url=https%3A//www.facebook.com/plugins/post/oembed.json/%3Furl%3Dhttps%3A//www.facebook.com%2F208033749575455%2Fposts%2F262489974129832

	else if (this.socialPlattform.Type === "facebook:post" || this.socialPlattform.source === "facebook") {
			if (this.isSocialPlattformType === "photo" || this.isSocialPlattformType === "post" || this.isSocialPlattformType === "link") {
				this.isSocialPlattformUrl = this.isSocialPlattformUrl.replace(":", "%3A");
				// this.facebookApiUrl = this.proxyPath + "?service=json&url=https%3A//www.facebook.com/plugins/post/oembed.json/%3Furl%3D" + this.isSocialPlattformUrl + "&maxwidth" + "1000&omitscript=true";
				this.facebookApiUrl = "https://www.facebook.com/plugins/post/oembed.json/?url=" + this.isSocialPlattformUrl + "&maxwidth" + "1000&omitscript=true";
			} else if (this.isSocialPlattformType === "video") {
				// this.facebookApiUrl = "https://www.facebook.com/plugins/video/oembed.json/?url=" + this.isSocialPlattformUrl;
				this.isSocialPlattformUrl = this.isSocialPlattformUrl.replace(":", "%3A");
				// this.facebookApiUrl = this.proxyPath + "?service=json&url=https%3A//www.facebook.com/plugins/video/oembed.json/%3Furl%3D" + this.isSocialPlattformUrl + "&maxwidth" + "1000&omitscript=true";
				this.facebookApiUrl = "https://www.facebook.com/plugins/video/oembed.json/?url=" + this.isSocialPlattformUrl + "&maxwidth" + "1000&omitscript=true";
			}

			// console.log(this.facebookApiUrl);

			jQuery.ajax({
				typ: "GET",
				async: true,
				cache: true,
				url: this.facebookApiUrl,
				dataType: "jsonp",
				success: function success(data) {
					var facebookHTML = data.html + postCredits;
					facebookHTML = facebookHTML.replace("<div id=\"fb-root\"></div>", "");
					facebookHTML = facebookHTML.replace("<div class=\"fb-post\"", "<div class=\"fb-post\" data-width=\"750\"");
					facebookHTML = facebookHTML.replace("<script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = \"//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.3\";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script>", "");
					that.postHtml = facebookHTML;
				},
				error: function error(_error) {
					// alert("something went wrong" +  error);
				}
			}).done(function (data) {
				jQuery(that.rootNode).find("#scribbleLive-" + postId).addClass("social-facebook");
				that.loadHtml(postId, postDate, that.postHtml);
			});

			that.postHtml = that.Facebook;
		}
};

ScribbleLive.prototype.loadHtml = function (postId, postDate, postHtml) {
	var that = this;

	jQuery(this.rootNode).find("#scribbleLive-" + postId).find(".scribble-list-time").html(postDate);
	jQuery(this.rootNode).find("#scribbleLive-" + postId).find(".scribble-list-content").html(postHtml);

	// window.console.log(postHtml);

	var animationTimeShort = 1500,
	    animationTimeLong = 5000;

	// Animate after Loading
	try {
		window.FB.XFBML.parse(document.getElementById("scribbleLive-" + postId), function () {
			jQuery(that.rootNode).find("#scribbleLive-" + postId).find(".scribble-list-content").removeClass("scribble-animate");
			jQuery(that.rootNode).find("#scribbleLive-" + postId).find(".new").removeClass("scribble-animate");
			jQuery(that.rootNode).find("#scribbleLive-" + postId).removeClass("scribble-loader");
			var rootNodeId = jQuery(that.rootNode).attr("id");
		});
	} catch (err) {
		window.console.log(err.message);
		setTimeout(function () {
			that.animatePosts(postId);
		}, animationTimeLong);
	}

	// Twitter
	try {
		setTimeout(function () {
			window.twttr.widgets.load();
			window.twttr.events.bind("rendered", function (event) {
				that.animatePosts(postId);
			});
		}, animationTimeShort);
	} catch (err) {
		window.console.log(err.message);
		that.animatePosts(postId);
	}

	// Instagram
	try {
		setTimeout(function () {
			window.instgrm.Embeds.process();
		}, animationTimeShort);
	} catch (err) {
		window.console.log(err.message);
		that.animatePosts(postId);
	}

	setTimeout(function () {
		jQuery(that.rootNode).find(".scribble-list-item").find(".scribble-list-content").removeClass("scribble-animate");
		jQuery(that.rootNode).find(".scribble-list-item").find(".new").removeClass("scribble-animate");
		jQuery(that.rootNode).find(".scribble-list-item").removeClass("scribble-loader");
	}, animationTimeLong);
};

ScribbleLive.prototype.animatePosts = function (postId) {
	jQuery(this.rootNode).find("#scribbleLive-" + postId).find(".scribble-list-content").removeClass("scribble-animate");
	jQuery(this.rootNode).find("#scribbleLive-" + postId).find(".new").removeClass("scribble-animate");
	jQuery(this.rootNode).find("#scribbleLive-" + postId).removeClass("scribble-loader");
};

ScribbleLive.prototype.refreshScribbleLiveList = function () {
	var that = this;
	setTimeout(function () {
		that.setupScribbleLiveList("refresh");
	}, this.opts.refreshTime);
};

// init
jQuery.fn.scribbleLive = function (opts) {
	return this.each(function () {
		new ScribbleLive(this, opts);
	});
};

function ScrollToTop(element, options) {
	this.settings = $.extend({}, options);
	this.$element = $(element);
	this.callback = options.callback || false;
	this.init();
}

$.extend(ScrollToTop.prototype, {
	init: function init() {
		var that = this;

		this.$element.click(function (e) {
			e.preventDefault();
			$("html, body").animate({
				scrollTop: 0
			}, "fast", function () {
				if (typeof that.callback === "function") {
					that.callback.apply();
				}
			});
		});
	}
});

$.fn.scrollToTop = function (options) {
	return this.each(function () {
		if (!$.data(this, "scrollToTop")) {
			$.data(this, "scrollToTop", new ScrollToTop(this, options));
		}
	});
};

function ScrollingHeader(rootNode, opts) {
	this.rootNode = rootNode;
	this.scrollingHeader();
}

ScrollingHeader.prototype.scrollingHeader = function () {
	var mobileBreakpoint = "767",
	    lastScrollTop = 0;

	jQuery(window).scroll(function () {
		var windowWidth = jQuery(window).width(),
		    headerHeight = jQuery(".header").height(),
		    adHeight = jQuery(".header").find(".ad").outerHeight();

		if (windowWidth > 767) {
			var themeBoundingPosition = jQuery(".theme-default")[0].getBoundingClientRect(),
			    headerBoundingPosition = jQuery(".header")[0].getBoundingClientRect(),
			    headerTopBoundingPosition = jQuery(".header-top")[0].getBoundingClientRect(),
			    sticky = jQuery(".header");

			// window.console.log("themeBoundingPosition.top", themeBoundingPosition.top);
			// window.console.log("Test", headerBoundingPosition.top, "<", themeBoundingPosition.top);
			// window.console.log(headerTopBoundingPosition.top, headerBoundingPosition.top);

			if (!sticky.hasClass("fixed") && headerTopBoundingPosition.top <= 0) {
				if (adHeight > 0) {
					sticky.addClass("fixed").css({
						top: -Math.round(adHeight)
					});
				} else {
					sticky.addClass("fixed").css({
						top: 0
					});
				}

				jQuery(".main").css({
					"padding-top": Math.round(headerHeight)
				});
			} else if (sticky.hasClass("fixed") && headerBoundingPosition.top <= themeBoundingPosition.top + 1) {
				sticky.removeClass("fixed").removeAttr("style");
				jQuery(".main").removeAttr("style");
			}
		}

		var headerPosition = jQuery(window).scrollTop(),
		    st = jQuery(this).scrollTop(),
		    windowHeight = jQuery(window).height();

		try {
			if (windowWidth < mobileBreakpoint) {
				if (jQuery(".search-bar").hasClass("open") && !jQuery(".search-bar").hasClass("focus")) {
					jQuery(".search-bar").fadeToggle("fast", "linear");
					jQuery(".search-bar").removeClass("open");
				}
				if (headerPosition > headerHeight && !jQuery("body").hasClass("sticky--body__nav")) {
					jQuery(".header").addClass("sticky");
				} else {
					jQuery(".header").removeClass("sticky");
				}
				if (st > windowHeight && !jQuery(".search-bar").hasClass("open")) {
					if (st > lastScrollTop && !jQuery("body").hasClass("sticky--body__nav")) {
						// console.log("scroll down");
						if (!jQuery(".header-top").hasClass("hidden")) {
							jQuery(".header-top").addClass("hidden");
						}
						if (!jQuery(".trending-bar").hasClass("hidden")) {
							jQuery(".trending-bar").addClass("hidden");
						}
						if (!jQuery(".nav-bar").hasClass("hidden")) {
							jQuery(".nav-bar").addClass("hidden");
						}
					} else {
						// console.log("scroll up");
						jQuery(".header-top").removeClass("hidden");
						jQuery(".trending-bar").removeClass("hidden");
						jQuery(".nav-bar").removeClass("hidden");
					}
				} else {
					jQuery(".news-alert").addClass("hidden");
				}

				if (st === 0) {
					jQuery(".header-top").removeClass("hidden");
					jQuery(".nav-bar").removeClass("hidden");
				}

				lastScrollTop = st;
			}
		} catch (err) {
			console.log(err.message);
		}
	});
	jQuery("input[type=search]").focusin(function () {
		jQuery(".search-bar").addClass("focus");
	});
	jQuery("input[type=search]").focusout(function () {
		jQuery(".search-bar").removeClass("focus");
	});
};

jQuery.fn.scrollingHeader = function (opts) {
	return this.each(function () {
		new ScrollingHeader(this, opts);
	});
};

/* Implementation of the StickyBar
	This Plugin implements a functionality like the Bootstrap-Affix plugin (http://getbootstrap.com/javascript/#affix).
	It toggles the Class of an given Element, when it leaves the Viewport so it cat be positioned fix via css.

	Author: Matthias Klebe
 */

function SearchBar(rootNode) {
	this.rootNode = rootNode;
	this.searchUrl = $(rootNode).data("url") || window.location.origin + "/suche/";
	console.log("searchUrl: " + this.searchUrl);
	var that = this;
	jQuery(this.rootNode).find(".form-actions").on("click", function () {
		that.loadSearch();
	});

	jQuery(document).keypress(function (e) {

		if (e.which === 13) {
			that.loadSearch();
		}
	});
}

SearchBar.prototype.loadSearch = function () {
	var rootPath = window.location.origin,
	    searchValue = jQuery(".form-fields-search").val();
	if (searchValue !== "" && searchValue !== " ") {
		searchValue = searchValue.replace("#", "");
		window.location.href = rootPath + "/suche/?q=" + searchValue;
	} else {
		if (!jQuery(".errorSearchMessage").hasClass("open")) {
			jQuery(".errorSearchMessage").addClass("open");
			jQuery(".errorSearchMessage").fadeToggle("fast");
		}
	}

	jQuery(".form-fields-search").keyup(function () {
		if (searchValue !== "") {
			if (jQuery(".errorSearchMessage").hasClass("open")) {
				jQuery(".errorSearchMessage").removeClass("open");
				jQuery(".errorSearchMessage").fadeToggle("fast");
			}
		}
	});
};

$.fn.searchBar = function () {
	return this.each(function () {
		new SearchBar(this);
	});
};

// Use of shareplugin
jQuery(document).on("page.ready", function (event) {
	var canonicalUrl = jQuery("link[rel=canonical]").attr("href"),
	    shortendUrl = jQuery(".share-button.facebook").data("shortend-url");
	try {
		jQuery(".share-button.facebook").sharrre({
			share: {
				facebook: true
			},
			enableHover: false,
			enableTracking: false,
			enableCounter: false,
			click: function click(api, options) {
				api.simulateClick();
				api.openPopup("facebook");
			},
			template: "<span class='share-button__icon'></span><span class='share-button__count'>{total}</span>",
			url: canonicalUrl
		});

		jQuery(".share-button.twitter").sharrre({
			share: {
				twitter: true
			},
			enableHover: false,
			enableTracking: false,
			click: function click(api, options) {
				api.simulateClick();
				api.openPopup("twitter");
			},
			template: "<span class='share-button__icon'></span><span class='share-button__count'>{total}</span>",

			url: canonicalUrl,
			buttons: {
				twitter: {
					url: shortendUrl
				}
			}

		});

		jQuery(".share-button.google-plus").sharrre({
			share: {
				googlePlus: false
			},
			enableHover: false,
			enableTracking: false,
			click: function click(api, options) {
				api.simulateClick();
				api.openPopup("googlePlus");
			}
		});
	} catch (err) {
		console.log(err.message);
	}
});

jQuery(document).ready(function () {
	jQuery(document).trigger("page.ready");
});
/*jslint evil: true */
/* globals SmartBanner */

jQuery(document).ready(function () {
	if (typeof SmartBanner !== "undefined") {
		new SmartBanner({
			daysHidden: 30, // days to hide banner after close button is clicked (defaults to 15)
			daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
			appStoreLanguage: "de", // language code for the App Store (defaults to user"s browser language)
			title: "Futurezone",
			author: "Technology News",
			button: "Öffnen",
			store: {
				ios: "Im Apple Store",
				android: "Im Google Play Store",
				windows: "Im Windows Store"
			},
			price: {
				ios: "Gratis",
				android: "Gratis",
				windows: "Gratis"
				// , theme: "" // put platform type ("ios", "android", etc.) here to force single theme on all device
				// , icon: "" // full path to icon image if not using website icon image
				// force: "android" // Uncomment for platform emulation
			} });
	} else {
		console.debug("SmartBanner is not defined");
	}
});

function SocialMediaWidget(rootNode, opts) {
	this.rootNode = rootNode;
	this.portal = opts.portal;
	this.embedId = opts.embedId;
	this.type = opts.type; // facebook only
	this.embedWidgetId = jQuery(this.rootNode).is("FIGURE") ? jQuery(this.rootNode).parent(".social-embed").attr("id") : jQuery(this.rootNode).attr("id"); // @todo investigate for FDSUPPORT-5956 (paywall-container on mobile safari)
	this.loadEmbed();
}

SocialMediaWidget.prototype.loadEmbed = function () {
	var that = this;

	// Facebook Post + Video + Comment
	if (this.portal === "facebook") {
		jQuery(this.rootNode).addClass("social-facebook");

		// Check if SDK is loaded once on Page
		var facebookSdkVersion = "v2.8",
		    facebookSdkAppId = "1650819678556421";
		if (jQuery("script[src='//connect.facebook.net/de_DE/all.js']").length === 0) {
			(function (d, s, id) {
				var js,
				    fjs = d.getElementsByTagName(s)[0];

				if (d.getElementById(id)) {
					return;
				}

				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/de_DE/all.js";
				fjs.parentNode.insertBefore(js, fjs);
			})(document, "script", "facebook-jssdk");
		}

		// append the elements described by facebook's docs
		// https://developers.facebook.com/docs/plugins/embedded-posts
		// https://developers.facebook.com/docs/plugins/embedded-video-player
		// https://developers.facebook.com/docs/plugins/embedded-comments
		var fbElem = void 0,
		    width = Math.floor(jQuery(that.rootNode).width());
		switch (that.type) {
			case "post":
				fbElem = "<div class=\"fb-post\" data-href=\"" + that.embedId + "\" data-width=\"" + width + "\"></div>";
				break;
			case "video":
				fbElem = "<div class=\"fb-video\" data-href=\"" + that.embedId + "\" data-allowfullscreen=\"true\"></div>";
				break;
			case "comment-embed":
				// make the element at least 560px in width because facebook won't render it any smaller, even though
				// the doc says so
				fbElem = "<div class=\"fb-comment-embed\" data-href=\"" + that.embedId + "\" data-width=\"" + Math.max(560, width) + "\"></div>";
				break;
		}

		// append the element to the root node
		jQuery(this.rootNode).append(fbElem);

		// set up the logging function
		window.fbAsyncInit = function () {
			window.FB.init({
				appId: facebookSdkAppId,
				xfbml: true,
				version: facebookSdkVersion
			});
			window.FB.AppEvents.logPageView();
			// window.FB.XFBML.parse(document.getElementById(that.embedWidgetId));
		};
	}

	// Twitter
	if (this.portal === "twitter") {
		if (jQuery("script[src='//platform.twitter.com/widgets.js']").length === 0) {
			window.twttr = function (d, s, id) {
				var js,
				    fjs = d.getElementsByTagName(s)[0],
				    t = window.twttr || {};
				if (d.getElementById(id)) {
					return t;
				}
				js = d.createElement(s);
				js.id = id;
				js.src = "//platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js, fjs);

				t._e = [];
				t.ready = function (f) {
					t._e.push(f);
					window.twttr.widgets.load(document.getElementById(that.embedWidgetId));
				};

				return t;
			}(document, "script", "twitter-wjs");
		}
	}

	// Instagram
	if (this.portal === "instagram") {
		if (jQuery("script[src='//platform.instagram.com/de_DE/embeds.js']").length === 0) {
			this.jsCode = document.createElement("script");
			this.jsCode.type = "text/javascript";
			this.jsCode.async = true;
			this.jsCode.defer = true;
			this.jsCode.setAttribute("src", "//platform.instagram.com/en_US/embeds.js");
			document.body.appendChild(this.jsCode);
		}
	}

	// Pinterest - No Ajax Call required. Handeled by //assets.pinterest.com/js/pinit.js
	if (this.portal === "pinterest") {
		if (jQuery("script[src='//assets.pinterest.com/js/pinit.js']").length === 0) {
			this.jsCode = document.createElement("script");
			this.jsCode.async = true;
			this.jsCode.defer = true;
			this.jsCode.setAttribute("src", "//assets.pinterest.com/js/pinit.js");
			document.body.appendChild(this.jsCode);
		}
	}

	// Vimeo
	if (this.portal === "vimeo") {
		var iframeHeight = jQuery(that.rootNode).find("iframe").height(),
		    iframeWidth = jQuery(that.rootNode).find("iframe").width(),
		    iframeNewHeight = Math.round(iframeHeight * (jQuery(this.rootNode).width() / iframeWidth), 10);

		jQuery(that.rootNode).find("iframe").css({
			width: "100%",
			height: iframeNewHeight + "px"
		});
	}

	that.style();

	// Youtube. ust for Backlog
	// if (this.portal === "youtube") {
	// jQuery(this.rootNode).html("<div id='youtube-" + this.embedId + "'></div>");
	// if (jQuery("script[src='//www.youtube.com/player_api']").length === 0) {
	// var tag = document.createElement("script");
	// tag.src = "https://www.youtube.com/player_api";

	// var firstScriptTag = document.getElementsByTagName("script")[0];
	// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	// }
	// var player;
	// window.onYouTubeIframeAPIReady = function () {
	// player = new window.YT.Player("youtube-" + that.embedId, {
	// width: "640",
	// height: "390",
	// videoId: that.embedId
	// });

	// that.style();
	// };
	// }
};

SocialMediaWidget.prototype.style = function (error) {
	var that = this,
	    isRendered = false,
	    apiLog = false;

	jQuery(document).trigger("elementRendered");

	this.myVar = setInterval(function () {
		// window.console.log("Timer", that.portal, jQuery(that.rootNode).attr("id"), "isRendered", isRendered);
		if (isRendered === false) {
			jQuery(document).trigger("elementRendered");
			// window.console.log("Running", jQuery(that.rootNode).attr("id"), that.portal, isRendered);
		}
		if (isRendered === true) {
			clearInterval(that.myVar);
			// window.console.log("Stop Running", jQuery(that.rootNode).attr("id"), that.portal, isRendered);
		}
	}, 1000);

	jQuery(document).on("elementRendered", function () {
		// window.console.log("Trigger elementRender", that.portal, jQuery(that.rootNode).attr("id"));
		if (that.portal === "instagram") {
			try {
				if (apiLog === false) {
					window.instgrm.Embeds.process();
					apiLog = true;
					window.console.log("Instargam Api Found");
				}
			} catch (err) {
				window.console.log(that.portal, err.message);
			}

			this.elementClass = "instagram-media";
			this.elementRenderClass = "instagram-media-rendered";

			if (jQuery(that.rootNode).find("." + this.elementClass).hasClass(this.elementRenderClass)) {
				if (isRendered === false) {
					isRendered = true;
					clearInterval(that.myVar);
					that.animate();
				}
				// window.console.log("Ready", that.portal, jQuery(that.rootNode).attr("id"), "Rendered", isRendered);
			}
		}

		if (that.portal === "twitter") {
			this.elementClass = "twitter-tweet";
			this.elementRenderClass = "twitter-tweet-rendered";

			if (jQuery(that.rootNode).find("." + this.elementClass).hasClass(this.elementRenderClass)) {
				if (isRendered === false) {
					isRendered = true;
					clearInterval(that.myVar);
					that.animate();
				}
			}
		}

		if (that.portal === "facebook") {
			this.elementRenderData = "fb-xfbml-state";

			if (jQuery(that.rootNode).find(".fb-" + that.type).attr(this.elementRenderData) === "rendered") {
				if (isRendered === false) {
					jQuery("#" + that.embedWidgetId).facebookInlineResizer({ type: "socialEmbed" });
					isRendered = true;
					clearInterval(that.myVar);
					that.animate();

					return false;
				}
			}
		}

		if (that.portal === "pinterest") {
			this.elementRenderData = "data-pin-log";
			this.elementRenderClass = jQuery(that.rootNode).find("span").attr(this.elementRenderData);

			if (this.elementRenderClass === "embed_pin_large" || this.elementRenderClass === "embed_pin_medium" || this.elementRenderClass === "embed_pin_small") {
				// Portal Style Block

				if (isRendered === false) {
					isRendered = true;
					clearInterval(that.myVar);
					jQuery("#" + that.embedWidgetId).pinterestInlineResizer();
					that.animate();
				}
				// window.console.log("Ready", that.portal, jQuery(that.rootNode).attr("id"), "Rendered", isRendered);
			}
		}

		if (that.portal === "vimeo") {
			this.elementClass = "iframe";

			jQuery(that.rootNode).find(this.elementClass).on("load", function () {
				isRendered = true;
				clearInterval(that.myVar);
				that.animate();
				// window.console.log("Ready", that.portal, jQuery(that.rootNode).attr("id"), "Rendered", isRendered);
			});
		}
	});

	// Clear Interval after max 30s
	setTimeout(function () {
		clearInterval(that.myVar);
		that.animate();
	}, 30000);
};

SocialMediaWidget.prototype.animate = function () {
	var that = this;

	// Animate Social container with 1.5s delay
	setTimeout(function () {
		var $widgetNode = jQuery(that.rootNode).is("FIGURE") ? jQuery(that.rootNode).parent(".social-embed") : jQuery(that.rootNode); // @todo investigate for FDSUPPORT-5956 (paywall-container on mobile safari)
		$widgetNode.removeClass("widget-hidden");
	}, 1500);
};

jQuery.fn.socialMediaWidget = function (opts) {
	return this.each(function () {
		new SocialMediaWidget(this, opts);
	});
};

/**
 * Track clicks for social buttons: follow (FDC-1900) and share (FDC-2661)
 *
 * add request parameter ?gtm-debug to URL to display additional debugging information into console
 */

$(document).ready(function () {

	var enableDebuggingMessages = window.location.search.indexOf("gtm-debug") > -1;

	/***********************************************
  * register click listeners for follow buttons *
  ***********************************************/
	var socialFollowElementSelectors = [".follow-us a", // BMO (XHTML Widget)
	".socialmedia-icons-header a", // News38 (Header)
	".header-top .social-channels a", // Fuzo (Header)
	".nav-meta__list a", // Bdf (Header & Footer)
	".header-social-icons a", // Goka (Header & Mobile-Header)
	".header-top__links.socialbar a", // BZV (Header)
	".footer__social a" // NRW-MP
	];

	socialFollowElementSelectors.forEach(function (selector) {
		jQuery(selector).each(function (idx, elem) {
			var $elem = $(elem);

			if ($elem.length && $elem.is(":visible")) {
				var href = $elem.attr("href"),
				    title = $elem.attr("title"),
				    network = "",
				    action = "follow";

				if (href) {

					if (href.indexOf("facebook") !== -1) {
						network = "Facebook";
						action = "like-facebook-page";
					} else if (href.indexOf("twitter") !== -1) {
						network = "Twitter";
					} else if (href.indexOf("pinterest") !== -1) {
						network = "Pinterest";
					} else if (href.indexOf("plus.google") !== -1 || title === "Google+") {
						network = "Google Plus";
						action = "plus-one";
					} else if (href.indexOf("linkedin") !== -1) {
						network = "LinkedIn";
						action = "connect";
					} else if (href.indexOf("youtube") !== -1) {
						network = "YouTube";
					} else if (href.indexOf("instagram") !== -1) {
						network = "Instagram";
					} else if (href.indexOf("xing") !== -1) {
						network = "Xing";
					} else if (href.indexOf("flipboard") !== -1) {
						network = "Flipboard";
					}

					if (network !== "") {
						if (enableDebuggingMessages) {
							window.console.debug("gtm-debug - social-tracking.js: registering click handler for selector %c%s", "font-weight: bold", selector);
						}
						(function ($elem, network, action, selector, enableDebuggingMessages) {
							$elem.on("click", function (e) {
								var data = {
									"event": "socialTrigger",
									"socialNetwork": network,
									"socialAction": action
								};
								if (enableDebuggingMessages) {
									window.console.debug("gtm-debug - social-tracking.js: clicked on ", e.delegateTarget);
									window.console.debug("gtm-debug - social-tracking.js: click handler called because of selector %c%s", "font-weight: bold", selector);
									window.console.debug("gtm-debug - social-tracking.js: calling window.dataLayer.push(%o)", data);
								}
								window.dataLayer.push(data);
							});
						})($elem, network, action, selector, enableDebuggingMessages);
					}
				}
			}
		});
	});

	/**********************************************
  * register click listeners for share buttons *
  **********************************************/
	/**
  * This array contains objects that describe
  * - selector: the selector for the specific share button
  * - network: the value for the 'network' as expected by Google Tag Manager
  * - action: the value for the 'action' as expected by Google Tag Manager
  * @type {{selector: String, network: String, action: String}[]}
  */
	var shareActionDescriptors = [{ selector: "article .share-button.facebook", network: "Facebook", action: "share" }, { selector: "article .share-button.twitter", network: "Twitter", action: "tweet" }, { selector: "article .share-button.pinterest", network: "Pinterest", action: "pin" }, { selector: "article .share-button.pinterest2", network: "Pinterest", action: "pin" }, { selector: "article .share-button.google-plus", network: "Google Plus", action: "share" }, { selector: "article .share-button.whatsapp", network: "WhatsApp", action: "share" }, { selector: "article .share-button.fb-messenger", network: "Facebook Messenger", action: "share" }, { selector: "article .share-button.email", network: "email", action: "share" }, { selector: "article .share-button.instagram", network: "Instagram", action: "share" }, { selector: "article .share-button.xing", network: "Xing", action: "share" }, { selector: "article .share-button.flipboard", network: "Flipboard", action: "share" }, { selector: "article .share-button.linkedin", network: "LinkedIn", action: "share" }];

	// register click handlers for the various share buttons, but only of they are actually being used and are visible
	// basically call window.dataLayer.push() upon a click on a .share-button
	shareActionDescriptors.forEach(function (descriptor) {
		var $elem = jQuery(descriptor.selector);
		if ($elem.length && $elem.is(":visible")) {
			if (enableDebuggingMessages) {
				window.console.debug("gtm-debug - social-tracking.js: registering click handler for selector %c%s%c (%i match/es)", "font-weight: bold", descriptor.selector, "font-weight: normal", $elem.length);
			}
			$elem.on("click", function (e) {
				var data = {
					"event": "socialTrigger",
					"socialNetwork": descriptor.network,
					"socialAction": descriptor.action

				};
				if (enableDebuggingMessages) {
					window.console.debug("gtm-debug - social-tracking.js: clicked on ", e.delegateTarget);
					window.console.debug("gtm-debug - social-tracking.js: click handler called because of selector %c%s", "font-weight: bold", descriptor.selector);
					window.console.debug("gtm-debug - social-tracking.js: calling window.dataLayer.push(%o)", data);
				}
				window.dataLayer.push(data);
			});
		}
	});
});

function SocialbarStreamShare() {
	jQuery(".teaser-stream-sharebutton").unbind("click").on("click", function () {
		if (jQuery(this).parent().hasClass("social-open")) {
			jQuery(this).parent().removeClass("social-open");
		} else {
			jQuery(".teaser-stream-share-container.social-open").removeClass("social-open");
			jQuery(this).parent().addClass("social-open");
		}
	});
}

jQuery(document).ready(function () {
	new SocialbarStreamShare();
});

jQuery(document).ajaxStop(function () {
	new SocialbarStreamShare();
});
/* Verschiedene Sticky (Position fixed elemente erhalten
mit Hilfe dieses Scripts Ihre Position beim horizontalen scrollen des Fensters.

Author: Peter Marhewka
*/

function StickyPositionFixer(rootNode, opts) {

	this.rootNode = rootNode;

	jQuery(this.rootNode).css("left", "");
	jQuery(document.body).trigger("sticky_kit:recalc");

	var that = this,
	    value1 = jQuery(this.rootNode).offset().left;
	// window.console.log("value1", value1);

	jQuery(window).scroll(function () {
		if (jQuery(that.rootNode).hasClass(opts.refClass)) {
			var value2 = jQuery(this).scrollLeft();

			if (value2 <= value1) {
				this.value3 = Math.abs(value2 - value1);
				// window.console.log("value3-A", this.value3);
			}

			if (value2 > value1) {
				this.value3 = Math.round(value1 - value2);
				// window.console.log("value3-B", this.value3);
			}

			// window.console.log(jQuery(that.rootNode).attr("class"), "value1", value1, "value2", value2, "value3", this.value3);
			jQuery(that.rootNode).css({ left: Math.round(this.value3) });
		} else {
			jQuery(that.rootNode).css({ left: "auto" });
		}
	});

	jQuery(window).resize(function () {
		value1 = jQuery(that.rootNode).offset().left;
	});
}

jQuery.fn.stickyPositionFixer = function (opts) {
	return this.each(function () {
		new StickyPositionFixer(this, opts);
	});
};

function stickyPositionFixerInit() {
	jQuery(".header").stickyPositionFixer({ refClass: "fixed" });
	jQuery(".nav-bar").stickyPositionFixer({ refClass: "sticky" });
	jQuery(".container-sidebar").stickyPositionFixer({ refClass: "stucked" });
	jQuery(".sidebar").stickyPositionFixer({ refClass: "stucked" });
}

// Init stickyPositionFixer

jQuery(document).ready(function () {
	stickyPositionFixerInit();
});

jQuery(window).on("load", function () {
	stickyPositionFixerInit();
});

jQuery(window).resize(function () {
	stickyPositionFixerInit();
});

/* Implementation of the StickyBar
	This Plugin implements a functionality like the Bootstrap-Affix plugin (http://getbootstrap.com/javascript/#affix).
	It toggles the Class of an given Element, when it leaves the Viewport so it cat be positioned fix via css.

	Author: Matthias Klebe

	@todo investigate / refactor for FDSUPPORT-5956 (paywall-container on mobile safari)
 */

function StickyContent(node) {
	var that = this,
	    $node = $(node),
	    contentHeight = $node.outerHeight(true),
	    mobileWidth = 767,
	    refElement = $(".article__body")[0];
	$(window).on("resize scroll touchend", function (e) {
		// on mobile devices there is no sticky content(.
		var socialbarHeight = $(".socialbar").height() * 2 + contentHeight,
		    stickyStop = Math.round($node.closest("article").offset().top + $node.closest("article").height() - socialbarHeight);
		if ($(window).width() > mobileWidth && refElement !== undefined && $(".body__print").length === 0) {
			var scrollPosition = $(document).scrollTop();
			if (refElement.getBoundingClientRect().top < 0 && scrollPosition <= stickyStop) {
				$node.addClass("sticky");
				$node.fadeIn("0.5", "linear");
			}
			if (refElement.getBoundingClientRect().top > 0) {
				$node.removeAttr("style");
				$node.removeClass("sticky");
			}
			if ($node.hasClass("sticky") && $(document).scrollTop() > stickyStop + socialbarHeight / 2 - 15) {
				$node.addClass("solid").removeClass("sticky");
				$node.css("left", "0");
			}
			if ($node.hasClass("solid") && $(document).scrollTop() <= stickyStop + socialbarHeight / 2 - 15) {
				$node.removeClass("solid").addClass("sticky");
			}
		} else {
			$node.removeClass("sticky").removeClass("solid");
		}
		var offsetArticle = $(".article").offset();
		$(".sticky").css({
			"left": offsetArticle.left - $(this).scrollLeft()
		});
	});
}

$.fn.stickyContent = function () {
	return this.each(function () {
		new StickyContent(this);
	});
};

/**
 * This is a simple jQuery tab plugin.
 * Required CSS class names can be modified by configuration.
 */
function Tabs(rootNode, opts) {
	var that = this;

	this.rootNode = rootNode;
	this.tabClass = opts.tabClass;
	this.bodyClass = opts.bodyClass;
	this.triggerEvent = opts.triggerEvent;

	this.activeTabClass = this.tabClass + "--active";
	this.activeBodyClass = this.bodyClass + "--active";
	this.$tabs = $("." + this.tabClass, this.rootNode);
	this.$bodyItems = $("." + this.bodyClass, this.rootNode);
	this.$tabs.on(this.triggerEvent, function (evt) {
		evt.preventDefault();
		evt.stopPropagation();

		if (!$(this).hasClass(that.activeTabClass)) {
			that.switchToTab(this);
		}
	});
}

Tabs.prototype.switchToTab = function (tab) {
	var $activeTab, $activeBody, activeIndex;

	$activeTab = $(tab);
	activeIndex = $activeTab.prevAll("." + this.tabClass).length;
	$activeBody = $(this.$bodyItems.get(activeIndex));
	this.$tabs.removeClass(this.activeTabClass);
	this.$bodyItems.removeClass(this.activeBodyClass);
	$activeTab.addClass(this.activeTabClass);
	$activeBody.addClass(this.activeBodyClass);
};

$.fn.tabs = function (options) {
	return this.each(function () {
		new Tabs(this, $.extend({
			"tabClass": "tabs__tab",
			"bodyClass": "tabs__body",
			"triggerEvent": "click"
		}, options));
	});
};

/* Icons auf Teasern können geklicked werden und leiten dann auf die im data-url tag stehende URL weiter */

jQuery(document).ready(function () {
	jQuery(".teaser__icons").find(".share-button__icon").on("click", function () {
		var teaserIconUrl = jQuery(this).attr("data-url");
		window.location.href = teaserIconUrl;
	});
});

jQuery(document).ready(function () {
	var triggerHref = function triggerHref(eventObject) {
		var that = this;
		if (!jQuery(eventObject.target).attr("href")) {
			var href = jQuery(that).parents(".teaser24").find(".teaser-headline-block a").attr("href");
			if (href) {
				window.location.href = href;
				return false;
			}
		}
	};

	jQuery(".teaser24 .overlay").on("click", triggerHref);
});

function TrendingWidget(element, pOptions) {
	var $element = jQuery(element),
	    $rootElement = $element.wrap("<div class=\"trending-widget-wrapper\"></div>").parent(),
	    options = {
		"updateInterval": 1.5 * 60 * 1000 // on and a half minute
	},
	    that = this;

	this.currentArticles = [];
	this.nextArticles = [];

	jQuery.extend(options, options, pOptions);

	function setTrendingSigns() {
		jQuery.each(that.nextArticles, function (nextArticleIdx, articleId) {

			var currentArticleIdx = that.currentArticles.indexOf(articleId);
			console.log(new Date().getTime(), "currentArticleIdx: ", currentArticleIdx, "nextArticleIdx: ", nextArticleIdx);

			// article is known from displaying before:
			if (currentArticleIdx !== -1) {
				if (currentArticleIdx < nextArticleIdx) {
					console.log("adding down for " + nextArticleIdx);
					jQuery($rootElement.find("[data-article-id]").get(nextArticleIdx)).find(".arrow").addClass("down");
				} else if (currentArticleIdx > nextArticleIdx) {
					console.log("adding up for " + nextArticleIdx);
					jQuery($rootElement.find("[data-article-id]").get(nextArticleIdx)).find(".arrow").addClass("up");
				} else {
					console.log("adding unchanged for " + nextArticleIdx);
					jQuery($rootElement.find("[data-article-id]").get(nextArticleIdx)).find(".arrow").addClass("unchanged");
				}
			}
		});
		that.currentArticles = that.nextArticles;
	}

	function updateContent() {
		that.currentArticles = $rootElement.find("[data-article-id]").map(function (idx, elmArticle) {
			return jQuery(elmArticle).data("article-id");
		}).toArray();

		console.log(new Date().getTime(), "pulling new widget-content from ", $rootElement.data("url"));
		jQuery.get($element.data("url")).done(function (data, statusName, $xhr) {
			data = data.replace(/<\/a>/g, "<div class=\"arrow\"></div></a>");
			$rootElement.html(data);
			$element = $rootElement.find(":first-child");
			that.nextArticles = $rootElement.find("[data-article-id]").map(function (idx, elmArticle) {
				return jQuery(elmArticle).data("article-id");
			}).toArray();
			console.log("current", that.currentArticles, "next", that.nextArticles);
		}).fail(function ($xhr, statusname, data) {
			window.console.log(arguments);
		});
	}

	window.setInterval(updateContent, options.updateInterval);
	window.setTimeout(function () {
		window.setInterval(setTrendingSigns, options.updateInterval);
	}, 250);
}

jQuery(function () {
	jQuery(".content--teaser--container.trending").each(function (idx, elm) {
		console.log("initiating TrendingWidget");
		new TrendingWidget(elm, { "$path": ".content--teaser--container.trending" });
	});
});

function TrimText(rootNode, opts) {
	this.rootNode = rootNode;
	this.trimText(rootNode, opts);
}

TrimText.prototype.trimText = function (rootNode, opts) {
	var that = this;
	jQuery(this.rootNode).hide();
	console.log(opts.limit);
	var minimizedElements = this.rootNode,
	    t = jQuery(minimizedElements).text();
	if (t.length < opts.limit) {
		return;
	}
	jQuery(this.rootNode).html(t.slice(0, opts.limit) + "<span>&nbsp;... </span><a href='#' class='trimTextMore'>" + opts.mehr + "</a>" + "<span style='display:none;'>" + t.slice(opts.limit, t.length) + "&nbsp;<a href='#' class='trimTextLess'>" + opts.weniger + "</a></span>");

	that.bindEvents(that.rootNode, opts);
};

TrimText.prototype.bindEvents = function (rootNode, opts) {
	var that = this;
	jQuery(rootNode).find(".trimTextMore").click(function (event) {
		event.preventDefault();
		jQuery(this).hide().prev().hide();
		jQuery(this).next().show();
	});
	jQuery(rootNode).find(".trimTextLess").click(function (event) {
		event.preventDefault();
		jQuery(this).parent().hide().prev().show().prev().show();
	});

	jQuery(rootNode).show();
};

jQuery.fn.trimText = function (opts) {
	return this.each(function () {
		new TrimText(this, opts);
	});
};

/*jslint evil: true */
/* globals Swiper, ga */

function TrippleCarousel(rootNode, opts) {
	this.rootNode = rootNode;
	this.loadTrippleCarousel(opts);
}

TrippleCarousel.prototype.loadTrippleCarousel = function (opts) {
	var that = this,
	    len = jQuery(this.rootNode).find(".swiper-slide").length,
	    portraitLog = 0,
	    smalestHeight = 0,
	    imageCount = 0;

	// Setup Slides (Desktop / Mobile) Slide Heights and Elements

	jQuery(this.rootNode).find(".swiper-slide").each(function (index) {
		var imgHeight = jQuery(this).find("img").attr("height"),
		    imgWidth = jQuery(this).find("img").attr("width");

		if (imgHeight > imgWidth || imgHeight === imgWidth) {
			jQuery(this).find("picture").addClass("mediaportrait");
			portraitLog = portraitLog + 1;
		} else {
			jQuery(this).find("picture").addClass("medialandscape");
		}

		if (imgHeight > smalestHeight && !jQuery(this).find("picture").hasClass("mediaportrait")) {
			smalestHeight = imgHeight;
			console.log(smalestHeight);
		}

		if (opts.view === "desktop") {
			if (portraitLog === len) {
				var gallerieWidth = jQuery(that.rootNode).width() / 1.5;
				console.log("gallerieWidth" + gallerieWidth);
				jQuery(that.rootNode).find("picture").css("max-height", gallerieWidth + "px").css("overflow", "hidden");
				jQuery(that.rootNode).find("picture").find("img").height(gallerieWidth).css("width", "auto");
				jQuery(that.rootNode).find(".swiper-buttons").height(gallerieWidth).css("display", "block");
			} else {
				jQuery(that.rootNode).find("picture").css("max-height", smalestHeight + "px").css("overflow", "hidden");
				jQuery(that.rootNode).find(".swiper-buttons").height(smalestHeight).css("display", "block");

				if (jQuery(that.rootNode).find("picture").hasClass("mediaportrait")) {
					jQuery(that.rootNode).find(".mediaportrait").find("img").height(smalestHeight).css("width", "auto");
				}
			}
		}

		if (index + 1 === len) {
			that.setupTrippleCarousel(opts, imageCount);
		}
	});
};

TrippleCarousel.prototype.setupTrippleCarousel = function (opts, imageCount) {

	var that = this,
	    thisSwiperId = jQuery(this.rootNode).attr("id"),
	    thisSwiper = eval("'" + thisSwiperId + "'"),
	    paginationClass = ".swiper-pagination-" + thisSwiperId,
	    nextClass = ".swiper-button-next-" + thisSwiperId,
	    prevClass = ".swiper-button-prev-" + thisSwiperId;

	if (opts.view === "desktop") {
		thisSwiper = new Swiper("#" + thisSwiperId, {
			pagination: paginationClass,
			grabCursor: true,
			nextButton: nextClass,
			prevButton: prevClass,
			preloadImages: true,
			paginationClickable: true,
			slidesPerView: 3,
			spaceBetween: 30,
			loop: true,
			autoplay: 3000,
			setWrapperSize: true
		});
	}

	if (opts.view === "mobile") {
		thisSwiper = new Swiper("#" + thisSwiperId, {
			"onInit": function onInit() {
				jQuery(that.rootNode).find("article.teaser").css("display", "block");
			},
			pagination: paginationClass,
			effect: "cube",
			grabCursor: true,
			lazyLoading: false,
			preloadImages: false,
			paginationClickable: true,
			updateOnImagesReady: true,
			cube: {
				shadow: false,
				slideShadows: false,
				shadowOffset: 20,
				shadowScale: 0.94
			},
			loop: true,
			autoplay: 3000,
			setWrapperSize: true
		});
	}
};

jQuery.fn.trippleCarousel = function (opts) {
	return this.each(function () {
		new TrippleCarousel(this, opts);
	});
};
/* Implemenation of various Utility-functions.
	Author: Matthias Klebe
 */

var mobileThreshold = 768,
    utils = {
	isMobile: function isMobile() {
		return $(window).width() < mobileThreshold;
	},

	isDesktop: function isDesktop() {
		return $(window).width() >= mobileThreshold;
	}
};

if (jQuery.utils === undefined) {
	window.jQuery.utils = {};
}

window.jQuery.extend(jQuery.utils, utils);
/* Autoplay Brightcove Video
	Author: Peter Marhewka
*/

// Autoplay Checkbox

function VideoAutoplay(rootNode, opts) {
	this.rootNode = rootNode;
	this.cookie();
}

VideoAutoplay.prototype.cookie = function () {
	var that = this;
	jQuery(this.rootNode).change(function () {
		var $input = $(this);

		if ($input.prop("checked") === true) {
			window.createCookie("videoAutoplay", "no", 14);
			// window.console.log("STATE A", $input.prop( "checked" ));
		}

		if ($input.prop("checked") === false) {
			window.eraseCookie("videoAutoplay");
			// window.console.log("STATE B", $input.prop( "checked" ));
		}
	});

	if (window.readCookie("videoAutoplay") === "no") {
		jQuery(that.rootNode).prop("checked", true);
		// window.console.log("STATE C");
	}
};

jQuery.fn.videoAutoplay = function (opts) {
	return this.each(function () {
		new VideoAutoplay(this, opts);
	});
};

/* Video Sticky Mode
	Author: Peter Marhewka
	https://localhost:3000/wirtschaft/article214319613/Technik-Panne-legt-Sparda-Banken-deutschlandweit-lahm.html
	Make Player sticky if scrolling hit top of the player.
*/

var videoIsPlay = "",
    videoIsPause = "";

function VideoStickyMode(rootNode, opts) {
	this.rootNode = rootNode;
	this.scroll();
}

VideoStickyMode.prototype.scroll = function () {
	var that = this,
	    debug = false,


	// create and dispatch the event. This defines Variables wich are usesed in the script. the will be updated at some points.
	makeFixed = new CustomEvent("videosticky", {
		detail: {
			brightcovePlayerPlay: false,
			brightcovePlayer: window.bc("video-" + jQuery(this.rootNode).find(".video-js").attr("data-video-id")),
			element: document.getElementById(jQuery(this.rootNode).attr("id")),
			elementHeight: jQuery(this.rootNode)[0].getBoundingClientRect().height,
			elementTop: jQuery(this.rootNode)[0].getBoundingClientRect().top,
			elementLeft: jQuery(this.rootNode)[0].getBoundingClientRect().left,
			pageWrapperLeft: jQuery(".main")[0].getBoundingClientRect().left,
			placeholderTop: 0,
			placeholderId: "placeholder-" + jQuery(this.rootNode).attr("id"),
			closeButtonId: "player-fixed--close-" + jQuery(this.rootNode).attr("id"),
			stickyState: false,
			videoIsPlay: "",
			videoIsPause: "",
			headerHeight: 16,
			minimumSpaceLeft: 300,
			fixedElementSpace: 16,
			playerFixedMaxWidth: 500
		}
	}),
	    mf = makeFixed.detail;

	// Event Listener
	mf.element.addEventListener("videosticky", function (e) {
		// DEBUG Output Set Global var debug to true
		if (debug === true) {
			console.table([["brightcovePlayerPlay", e.detail.brightcovePlayerPlay], ["brightcovePlayer", e.detail.brightcovePlayer], ["element", e.detail.element], ["elementHeight", e.detail.elementHeight], ["elementTop", e.detail.elementTop], ["elementLeft", e.detail.elementLeft], ["pageWrapperLeft", e.detail.pageWrapperLeft], ["placeholderTop", e.detail.placeholderTop], ["placeholderId", e.detail.placeholderId], ["closeButtonId", e.detail.closeButtonId], ["stickyState", e.detail.stickyState], ["videoIsPlay", e.detail.videoIsPlay], ["videoIsPause", e.detail.videoIsPause]]);
		}

		// END Debug

		function removeSticky() {
			jQuery(that.rootNode).removeClass("player-fixed player-fixed--mobile player-fixed--desktop player-fixed-hover").removeAttr("style");

			if (e.detail.pageWrapperLeft > e.detail.minimumSpaceLeft) {
				if (e.detail.brightcovePlayerPlay === true) {
					jQuery("#" + e.detail.placeholderId).remove();
				} else {
					jQuery(that.rootNode).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
						jQuery("#" + e.detail.placeholderId).remove();
					});
				}
			} else {
				jQuery("#" + e.detail.placeholderId).remove();
			}
		}

		if (e.detail.brightcovePlayer.id_ !== e.detail.videoIsPlay && e.detail.videoIsPause !== "" && e.detail.videoIsPlay !== e.detail.videoIsPause) {
			jQuery(that.rootNode).removeClass("player-fixed--locked");
		}

		if (e.detail.brightcovePlayerPlay === true) {
			if (e.detail.pageWrapperLeft > e.detail.minimumSpaceLeft) {
				if (!jQuery(that.rootNode).hasClass("video-transition")) {
					jQuery(that.rootNode).addClass("video-transition");
					e.detail.elementHeight = jQuery(that.rootNode)[0].getBoundingClientRect().height;
				}
			}

			if (e.detail.videoIsPause.id_ !== "" && e.detail.videoIsPause.id_ !== e.detail.videoIsPlay.id_) {
				if (jQuery(that.rootNode).find("#" + e.detail.videoIsPause.id_).length > 0) {
					jQuery(that.rootNode).removeClass("player-fixed player-fixed--mobile player-fixed--desktop player-fixed-hover").removeAttr("style");
				}
			}

			if (e.detail.stickyState === true) {
				if (jQuery("#" + e.detail.placeholderId).length === 0) {
					jQuery("<div id='" + e.detail.placeholderId + "' class='video-placeholder'></div>").insertBefore(that.rootNode).css({
						height: e.detail.elementHeight
					});

					if (e.detail.pageWrapperLeft > e.detail.minimumSpaceLeft) {
						jQuery(that.rootNode).addClass("player-fixed player-fixed--desktop");

						jQuery("#" + e.detail.placeholderId).css({
							height: e.detail.elementHeight
						}).addClass("video-placeholder--styled");

						if (e.detail.pageWrapperLeft < e.detail.playerFixedMaxWidth) {
							that.elementStickyWidth = e.detail.pageWrapperLeft - e.detail.fixedElementSpace * 2;
						} else {
							that.elementStickyWidth = e.detail.playerFixedMaxWidth;
						}

						jQuery(that.rootNode).css({
							width: that.elementStickyWidth,
							"transform": "translate3d(" + -(that.elementStickyWidth - (e.detail.pageWrapperLeft - e.detail.elementLeft - e.detail.fixedElementSpace)) + "px, " + e.detail.fixedElementSpace + "px , 0px)"
						}).addClass("player-fixed-hover");
					} else {
						jQuery(that.rootNode).addClass("player-fixed player-fixed--mobile");
						jQuery(that.rootNode).css({
							"transform": "translate3d(" + -(e.detail.elementLeft - e.detail.pageWrapperLeft) + "px, 0px, 0px)"
						});
					}
				} else {
					mf.placeholderTop = jQuery("#" + e.detail.placeholderId)[0].getBoundingClientRect().top;
				}
			} else {
				removeSticky();
			}
		} else {
			if (e.detail.videoIsPause.id_ !== "" && e.detail.videoIsPlay !== e.detail.videoIsPause) {
				e.detail.stickyState = false;
				removeSticky();
			}
		}

		if (jQuery("#" + e.detail.placeholderId).length > 0) {
			if (e.detail.brightcovePlayerPlay === false && jQuery("#" + e.detail.placeholderId)[0].getBoundingClientRect().top > 0) {
				mf.placeholderTop = 0;
				removeSticky();
			}
		}
	});

	// #### Window Events ####

	// Window Scroll
	jQuery(window).on("resize scroll", function () {
		mf.videoIsPause = videoIsPause;
		mf.videoIsPlay = videoIsPlay;
		mf.pageWrapperLeft = jQuery(".main")[0].getBoundingClientRect().left;
		mf.elementTop = jQuery(that.rootNode)[0].getBoundingClientRect().top;
		mf.element.dispatchEvent(makeFixed);

		if (jQuery(window).width() < 768) {
			mf.headerHeight = jQuery(".header-top")[0].getBoundingClientRect().height + 10;
			mf.element.dispatchEvent(makeFixed);
		}

		if (jQuery("#" + mf.closeButtonId).length === 0) {
			if (mf.pageWrapperLeft < mf.minimumSpaceLeft) {
				jQuery(that.rootNode).prepend("<div id='" + mf.closeButtonId + "' class='player-fixed--close'></div>");
			}

			jQuery("#" + mf.closeButtonId).on("click", function () {
				jQuery(that.rootNode).addClass("player-fixed--locked");
				jQuery(".player-fixed--close").remove();
				mf.stickyState = false;
				mf.element.dispatchEvent(makeFixed);
			});
		}

		if (mf.elementTop < mf.headerHeight && mf.placeholderTop <= mf.headerHeight) {
			if (!jQuery(that.rootNode).hasClass("player-fixed--locked")) {
				mf.stickyState = true;
				mf.element.dispatchEvent(makeFixed);
			} else {
				jQuery(".player-fixed--close").remove();
				mf.stickyState = false;
				mf.element.dispatchEvent(makeFixed);
			}
		} else {
			mf.placeholderTop = 0;
			mf.stickyState = false;
			mf.element.dispatchEvent(makeFixed);
		}
	});

	function playerIsPlaying() {
		videoIsPlay = mf.brightcovePlayer.id_;
		mf.videoIsPlay = videoIsPlay;
		mf.brightcovePlayerPlay = true;
		mf.placeholderTop = jQuery(that.rootNode)[0].getBoundingClientRect().top;
		mf.element.dispatchEvent(makeFixed);
	}

	function playerIsPaused() {
		videoIsPause = mf.brightcovePlayer.id_;
		mf.videoIsPause = videoIsPause;
		mf.brightcovePlayerPlay = false;
		mf.placeholderTop = jQuery(that.rootNode)[0].getBoundingClientRect().top;
		mf.element.dispatchEvent(makeFixed);
	}

	// Brightcove Player Events
	mf.brightcovePlayer.ready(function () {
		mf.brightcovePlayer.on("play", function () {
			playerIsPlaying();
		});

		mf.brightcovePlayer.on("pause", function () {
			playerIsPaused();
		});

		mf.brightcovePlayer.on("ended", function () {
			mf.brightcovePlayerPlay = false;
			mf.element.dispatchEvent(makeFixed);
		});
	});

	mf.brightcovePlayer.ima3.ready(function () {
		mf.brightcovePlayer.on("ads-play", function () {
			playerIsPlaying();
		});

		mf.brightcovePlayer.on("ads-pause", function () {
			playerIsPaused();
		});

		mf.brightcovePlayer.on("ads-ad-started", function () {
			playerIsPlaying();
		});
	});
};

jQuery.fn.videoStickyMode = function (opts) {
	return this.each(function () {
		new VideoStickyMode(this, opts);
	});
};

/* Youtube Player
	Author: Peter Marhewka
*/

// Setup Player
function YoutubePlayer(rootNode, opts) {
	this.rootNode = rootNode;
	this.contentId = opts.contentId;
	this.autoplayYoutube = opts.autoplayYoutube || "0";
	this.init();
}

YoutubePlayer.prototype.init = function (opts) {
	var that = this;

	/* jshint ignore:start */
	this.player = new YT.Player("youtube-" + this.contentId, {
		playerVars: {
			"autoplay": this.autoplayYoutube
		},
		events: {
			"onReady": onPlayerReady,
			"onStateChange": onPlayerStateChange
		}
	});
	/* jshint ignore:end */

	function onPlayerReady(event) {
		console.log("Youtube Player - is Ready");

		jQuery("body").on("videoPlay", function (videoIdEvent) {
			// console.log("Youtube", videoIdEvent.id, "!==", that.contentId);
			if (videoIdEvent.id !== that.contentId) {
				that.player.stopVideo();
			}
		});

		if (that.autoplayYoutube === "1") {
			that.player.playVideo();
		}
	}

	this.videoIdEvent = jQuery.Event("videoPlay", {
		id: this.contentId
	});

	function onPlayerStateChange(event) {
		console.log("Youtube Player - State", event.data);
		/* jshint ignore:start */
		if (event.data === YT.PlayerState.PLAYING) {
			console.log("Youtube Player - is Playing");

			// Eskalationslayout only grosse-nachrichtenlage.jsp */
			jQuery(".video-youtube").next(".grosse-nachrichtenlage-headline").addClass("hidden");

			// Stop Player when other Player starts to Play video-autostop_player.js
			jQuery("body").trigger(that.videoIdEvent);
		}

		if (event.data === YT.PlayerState.ENDED) {
			stopVideo();
		}

		if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
			jQuery(that.rootNode).next(".grosse-nachrichtenlage-headline").removeClass("hidden");
			console.log("Youtube Player - has Ended");
		}
		/* jshint ignore:end */
	}
};

jQuery.fn.youtubePlayer = function (opts) {
	return this.each(function () {
		new YoutubePlayer(this, opts);
	});
};
})( jQuery, window, document );