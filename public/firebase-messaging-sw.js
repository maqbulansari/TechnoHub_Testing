importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAV9L9sLIAx7ccm7OHIXd0znIIqzafML_g",
  authDomain: "technohub-5676e.firebaseapp.com",
  projectId: "technohub-5676e",
  storageBucket: "technohub-5676e.appspot.com",
  messagingSenderId: "1035119080828",
  appId: "1:1035119080828:web:4fe31261f8ee34e88760f9",
}); 

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
    }
  );
});
