import { logDebug } from './utils'
import pluginConfig from './config'
/**
 * Plugin main class
 */
export default class AnalyticsPlugin {
  trackView (screenName) {
    logDebug('Dispatching TrackView', { screenName })

    ga('set', 'page', screenName)
    ga('send', 'pageview')
  }

  /**
   * Dispatch an analytics event
   *
   * @param category
   * @param action
   * @param label
   * @param value
   */
  trackEvent (category, action = null, label = null, value = null) {
    // TODO : FieldObject is full syntax, refactor this at one moment
    logDebug('Dispatching event', { category, action, label, value})

    ga('send', 'event', category, action, label, value)
  }

  /**
   * Track an exception that occurred in the application.
   *
   * @param {string} description - Something describing the error (max. 150 Bytes)
   * @param {boolean} isFatal - Specifies whether the exception was fatal
   */
  trackException (description, isFatal = false) {
    ga('send', 'exception', { 'exDescription': description, 'exFatal': isFatal });
  }

  /**
   * Inject a new GlobalDimension that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} dimensionNumber
   * @param {string|int} value
   *
   * @throws Error - If already defined
   */
  injectGlobalDimension (dimensionNumber, value) {
    logDebug('Trying dimension Injection...', { dimensionNumber, value })

    // Test if dimension already registered
    if (pluginConfig.globalDimensions.find(el => el.dimension === dimensionNumber)) {
      throw new Error('VueAnalytics : Dimension already registered')
    }

    // Otherwise add dimension
    const newDimension = { dimension: dimensionNumber, value }

    pluginConfig.globalDimensions.push(newDimension)
    ga('set', `dimension${newDimension.dimension}`, newDimension.value)
    logDebug('Dimension injected')
  }

  /**
   * Inject a new GlobalMetric that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} metricNumber
   * @param {string|int} value
   *
   * @throws Error - If already defined
   */
  injectGlobalMetric (metricNumber, value) {
    logDebug('Trying metric Injection...', { metricNumber, value })

    // Test if dimension already registered
    if (pluginConfig.globalMetrics.find(el => el.metric === metricNumber)) {
      throw new Error('VueAnalytics : Metric already registered')
    }

    // Otherwise add dimension
    const newMetric = { metric: metricNumber, value }

    pluginConfig.globalMetrics.push(newMetric)
    ga('set', `metric${newMetric.metric}`, newMetric.value)
    logDebug('Metric injected')
  }

  /**
   * Set the current session language, use this if you change lang in the application after initialization.
   *
   * @param {string} code - Must be like in that : http://www.lingoes.net/en/translator/langcode.htm
   */
  changeSessionLanguage (code) {
    logDebug(`Changing application localisation & language to ${code}`);
    ga('set', 'language', code);
  }
}
