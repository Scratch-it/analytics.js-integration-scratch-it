
/**
 * Module dependencies.
 */

var integration = require('@segment/analytics.js-integration');
var is = require('is');
var del = require('obj-case').del;

/**
 * Expose `ScratchIt` integration.
 */

var ScratchIt = module.exports = integration('Scratch-it Analytics')
  .global('_ScratchIt')
  .global('ScratchItAnalytics')
  .option('trkId', '')
  .option('url', 'http://trk.scratch-it.com/trk')
  .tag('<script src="//static.scratch-it.com/public/scratch-it-analytics.min.js">');

/**
 * Initialize.
 */
ScratchIt.prototype.initialize = function() {
  var self = this;

  this.load(function() {
    if (!window.ScratchItAnalytics) {
      return null;
    }

    window._ScratchIt = new window.ScratchItAnalytics(self.options.trkId, { url: self.options.url, mstrId: self.options.mstrId });
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {boolean}
 */
ScratchIt.prototype.loaded = function() {
  return is.object(window._ScratchIt);
};

/**
 * Track an event.
 *
 * @api public
 * @param {Track} track
 */

ScratchIt.prototype.track = function(track) {
  var parameters = track.properties();
  var event_type = parameters.event_type || 'track';
  del(parameters, 'event_type');
  window._ScratchIt.track(event_type, track.event(), parameters);
};

/**
 * Page.
 *
 * @api public
 * @param {Page} page
 */

ScratchIt.prototype.page = function(page) {
  var customProperties = page.properties();
  del(customProperties, 'event_type');
  window._ScratchIt.track('track', 'page_visit', customProperties);
};


/**
 * Identify.
 *
 * @api public
 * @param {Identify} identify
 */

ScratchIt.prototype.identify = function(identify) {
  var userProps = {}
  var foundProps = false
  if (identify.email()) {
    foundProps = true
    userProps['email'] = identify.email()
  }
  if (identify.firstName()) {
    foundProps = true
    userProps['first_name'] = identify.firstName()
  }
  if (identify.lastName()) {
    foundProps = true
    userProps['last_name'] = identify.lastName()
  }
  if (foundProps) {
    window._ScratchIt.identify(userProps);
  }
};
