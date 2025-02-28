// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMSRpih9qRbR01O-PrbTqn2DpRN7robWs",
    authDomain: "route-bus-59.firebaseapp.com",
    databaseURL: "https://route-bus-59-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "route-bus-59",
    storageBucket: "route-bus-59.appspot.com",
    messagingSenderId: "89950346845",
    appId: "1:89950346845:web:38b52f46eb2ddf58fef7b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app-container");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const userEmailDisplay = document.getElementById("user-email");

// Login Function
loginButton.addEventListener("click", function() {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});

// Check if User is Logged In
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginContainer.style.display = "none";
        appContainer.style.display = "block";
        
        // ✅ Display user email above logout button
        userEmailDisplay.innerText = `Logged in as: ${user.email}`;
    } else {
        loginContainer.style.display = "block";
        appContainer.style.display = "none";

        // ✅ Hide email when user logs out
        userEmailDisplay.innerText = "";
    }
});

// Logout Function
logoutButton.addEventListener("click", function() {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
        })
        .catch((error) => {
            alert("Logout failed: " + error.message);
        });
});

// Sign-up Event Listener (Optional)
document.getElementById("signup-link").addEventListener("click", function() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter a password:");

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
            alert("Account created! Please log in.");
        })
        .catch((error) => {
            alert("Signup failed: " + error.message);
        });
});

// Map Initialization
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 26,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Track User Location
let marker, circle;
function userLocation(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const acc = position.coords.accuracy;

    set(ref(database, 'bus/'), { lat, long });

    if (!marker) marker = L.marker([lat, long]).addTo(map);
    else marker.setLatLng([lat, long]);

    if (!circle) circle = L.circle([lat, long], { radius: acc }).addTo(map);
    else circle.setLatLng([lat, long]).setRadius(acc);

    map.fitBounds(circle.getBounds());
}
navigator.geolocation.watchPosition(userLocation, console.error);

// Wait and Leave Buttons
document.getElementById('wait').addEventListener('click', () => set(ref(database, 'status/'), { wait: true, leave: false }));
document.getElementById('leave').addEventListener('click', () => set(ref(database, 'status/'), { leave: true, wait: false }));
