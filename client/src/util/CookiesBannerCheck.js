/**
 * File contains all functions related to determining whether the footer banner regarding cookie usage should
 * be displayed to the user. By default, it is always displayed on every page until the user acknowledges
 * it by pressing the button, then it will no longer appear on any of the pages for that session.
 *
 * @summary   Functionality related to cookies informational banner.
 * @author    Amrit Kaur Singh
 */

const COOKIES_INFO_BANNER_ATTRIBUTE = "uweast-ck:cookies-banner";

// signify the user acknoledgement by setting a key in sessionStorage
function removeBanner() {
  try {
    sessionStorage.setItem(COOKIES_INFO_BANNER_ATTRIBUTE, "true");
  } catch (err) {}
}

// check sessionStorage if key has been set (button has been pressed), and do not display banner if it has otherwise display it
function shouldDisplayBanner() {
  // try-catch takes care of case where cookies are disabled on website
  try {
    // key exists --> button pressed --> don't show user banner
    if (sessionStorage.hasOwnProperty(COOKIES_INFO_BANNER_ATTRIBUTE)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export { removeBanner, shouldDisplayBanner };
