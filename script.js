// script.js (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

/* ====== IMPORTANT: paste your Firebase config here ======
   You get this from Firebase Console -> Project Settings -> SDK setup
*/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // add other fields you find in the config (storageBucket, messagingSenderId, appId)
};
// =========================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* UI elements */
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const feedback = document.getElementById('feedback');
const showSignupLink = document.getElementById('show-signup-link');

/* Tabs switching */
tabLogin.addEventListener('click', () => { showForm('login'); });
tabSignup.addEventListener('click', () => { showForm('signup'); });
showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showForm('signup'); });

function showForm(name) {
  if (name === 'login') {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    loginForm.classList.add('active'); signupForm.classList.remove('active');
    feedback.textContent = '';
  } else {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    signupForm.classList.add('active'); loginForm.classList.remove('active');
    feedback.textContent = '';
  }
}

/* Signup */
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.textContent = 'Creating account...';
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    // set displayName
    await updateProfile(userCred.user, { displayName: name });
    feedback.style.color = 'green';
    feedback.textContent = 'Account created. Redirecting to dashboard...';
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
  } catch (err) {
    feedback.style.color = '#b00020';
    feedback.textContent = err.message;
  }
});

/* Login */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.textContent = 'Checking credentials...';
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    feedback.style.color = 'green';
    feedback.textContent = 'Logged in! Redirecting to dashboard...';
    setTimeout(() => window.location.href = 'dashboard.html', 700);
  } catch (err) {
    feedback.style.color = '#b00020';
    feedback.textContent = err.message;
  }
});

/* If user is already logged in, send to dashboard immediately */
onAuthStateChanged(auth, user => {
  if (user) {
    // already logged in -> go to dashboard
    if (!window.location.href.includes('dashboard.html')) {
      window.location.href = 'dashboard.html';
    }
  }
});
