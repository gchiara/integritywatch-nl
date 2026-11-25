<!-- Banner -->
<div id="cookie-banner" class="hidden">
  <strong>Privacy Notice</strong><br><br>
  We use optional analytics cookies to understand website traffic and improve the platform. You can accept or reject analytics tracking. Essential technical functions do not use cookies.
  View our <a id="privacyPolicyLink" href="./privacy_policy.php">Privacy Policy</a>.

  <div class="cookie-actions">
    <button class="cookie-btn accept" id="cookie-accept">Accept</button>
    <button class="cookie-btn reject" id="cookie-reject">Reject</button>
  </div>
</div>

<!-- Reopen settings -->
<div id="cookie-settings-link">
  <button onclick="resetCookieConsent()">Cookie Settings</button>
</div>

<script src="./analytics-config.js"></script>
<script>
(function () {
  const STORAGE_KEY = "cookieConsent";
  function getConsent() {
    return localStorage.getItem(STORAGE_KEY);
  }
  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }
  function showBanner() {
    document.getElementById("cookie-banner").classList.remove("hidden");
  }
  function hideBanner() {
    document.getElementById("cookie-banner").classList.add("hidden");
  }

  //Load Google Analytics ONLY after consent
  function loadAnalytics() {
    console.log("Loading analytics");
    var analyticsId = '00-0000000';
    if(ANALYTICS_ID) {
      analyticsId = ANALYTICS_ID;
    }
    if (window.analyticsLoaded) return;
    window.analyticsLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + analyticsId; // <-- Replace
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', analyticsId, { 'anonymize_ip': true });
  }

  //On page load
  const consent = getConsent();
  if (consent === "accepted") {
    loadAnalytics();
  } else if (consent === "rejected") {
    //Don't load and don't show banner anymore
  } else {
    showBanner();
  }

  //Accept
  document.getElementById("cookie-accept").addEventListener("click", function () {
    setConsent("accepted");
    hideBanner();
    loadAnalytics();
  });
  //Reject
  document.getElementById("cookie-reject").addEventListener("click", function () {
    setConsent("rejected");
    hideBanner();
  });

})();

//Public function for footer link
function resetCookieConsent() {
  localStorage.removeItem("cookieConsent");
  location.reload();
}
</script>