console.log("✅ env.js loaded");


window.quando = window.quando || {};
quando.env = quando.env || {};

// Namespace
let self = quando.environment = {};

// Platform selection handler
self.setPlatform = function(platform) {
  window.quandoPlatform = platform;
  localStorage.setItem('quandoPlatform', platform);
  console.log("Platform set to:", platform);
};

// Application context handler
self.setApp = function(application) {
  window.quandoApp = application;
  localStorage.setItem('quandoApp', application);
  console.log("Application set to:", application);
};

// Load saved values or fallback
window.quandoPlatform = localStorage.getItem('quandoPlatform') || 'windows';
window.quandoApp = localStorage.getItem('quandoApp') || 'google_docs';
