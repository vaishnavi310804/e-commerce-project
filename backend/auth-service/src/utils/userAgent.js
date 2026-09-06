export const parseUserAgent = (uaString = "") => {
  if (!uaString || typeof uaString !== "string") {
    return { device: "Unknown", browser: "Unknown" };
  }

  const ua = uaString.toLowerCase();

  // Device detection: Desktop, Mobile, Tablet, Unknown
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(uaString)) {
    device = "Tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      uaString
    )
  ) {
    device = "Mobile";
  }

  // Browser detection: Chrome, Firefox, Safari, Edge, Unknown
  let browser = "Unknown";
  if (ua.includes("edg/") || ua.includes("edge/")) {
    browser = "Edge";
  } else if (ua.includes("chrome") || ua.includes("crios")) {
    browser = "Chrome";
  } else if (
    ua.includes("safari") &&
    !ua.includes("chrome") &&
    !ua.includes("crios")
  ) {
    browser = "Safari";
  } else if (ua.includes("firefox") || ua.includes("fxios")) {
    browser = "Firefox";
  }

  return { device, browser };
};
