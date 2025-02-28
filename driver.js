// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, set, ref,onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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
const database = getDatabase(app);
const auth = getAuth(app);

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 26,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Function to write user data to Firebase
function writeUserData(lat, long, uid) {
    set(ref(database, `BusData/${uid}`), {
        lat: lat,
        lon: long
    })
    .then(() => {
        console.log("Location updated!");
    })
    .catch((error) => {
        console.error("Error updating location: ", error);
    });
}

// Initialize variables for marker and circle
let marker, circle;
let watchId = null;

function userLocation(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const acc = position.coords.accuracy;

    // Check if user is logged in before updating location
    const user = auth.currentUser;
    if (user) {
        writeUserData(lat, long, user.uid);

        if (!marker) {
            marker = L.marker([lat, long]).addTo(map);
        } else {
            marker.setLatLng([lat, long]);
        }

        if (!circle) {
            circle = L.circle([lat, long], { radius: acc }).addTo(map);
        } else {
            circle.setLatLng([lat, long]).setRadius(acc);
        }

        marker.bindPopup(`Bus No. 43`).openPopup();
        map.fitBounds(circle.getBounds());
    }
}

// Handle geolocation errors
function handleError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Please allow geolocation to continue.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Start tracking location only if the user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.email);
        watchId = navigator.geolocation.watchPosition(userLocation, handleError);
    } else {
        console.log("User logged out. Stopping location tracking.");
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
    }
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Logged out successfully!");
        window.location.href = "drivers%20dashboard.html"; // Redirect to login page
    }).catch((error) => {
        console.error("Logout error:", error);
    });
});


// UI Elements
const loginContainer = document.getElementById("login-container");
const dashboardContainer = document.getElementById("dashboard-container");
const loginButton = document.getElementById("driver-login-btn");
const emailInput = document.getElementById("driver-email");
const passwordInput = document.getElementById("driver-password");
const loginError = document.getElementById("login-error");
const logoutButton = document.getElementById("logout-btn");

// Handle Login
loginButton.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginError.textContent = "";
        })
        .catch((error) => {
            loginError.textContent = "Invalid email or password!";
            console.error(error.message);
        });
});

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";
    } else {
        loginContainer.style.display = "block";
        dashboardContainer.style.display = "none";
    }
});

// Handle Logout
logoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
        })
        .catch((error) => {
            console.error("Logout Error:", error);
        });
});


//Notifications 

const notificationRef = ref(database, "status"); 

const notificationPane = document.getElementById("notification-pane");
let student = "RAJESH"
// Listen for changes in the "notifications" node
onValue(ref(database, "status/leave"), (snapshot) => {
    if (snapshot.exists()){
        const notificationData = snapshot.val();
        let a;
        console.log("Firebase Data:", notificationData);
        if(notificationData == true){
            a="Student <b>"+student+"<b> notified to be Leave";
            console.log(a)
            notificationPane.innerHTML = `<p style="color: green; font-weight: bold;">${a}</p>`;
        }
        else if(notificationData == false){
            a="Student <b>"+student+"<b> notified to be Wait";
            console.log(a)
            notificationPane.innerHTML = `<p style="color: green; font-weight: bold;">${a}</p>`;
            
        }
        
    } else {
        notificationPane.innerHTML = "<p>No new notifications</p>";
    }
});
