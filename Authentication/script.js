  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, validatePassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
    

//Encryption function
function encryptWord(word, secretKey) {
    return CryptoJS.AES.encrypt(word, secretKey).toString();
}

// Decryption function
function decryptWord(encryptedWord, secretKey) {
    var bytes = CryptoJS.AES.decrypt(encryptedWord, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Secret key
function secretKey() {
    return Math.floor(Math.random() * 90000) + 10000;
}

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMSRpih9qRbR01O-PrbTqn2DpRN7robWs",
    authDomain: "route-bus-59.firebaseapp.com",
    databaseURL: "https://route-bus-59-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "route-bus-59",
    storageBucket: "route-bus-59.firebasestorage.app",
    messagingSenderId: "89950346845",
    appId: "1:89950346845:web:38b52f46eb2ddf58fef7b4"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

let user = document.getElementById("user")
let password = document.getElementById("password")

let users,pass = 0;
 document.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // get data 
    let users = user.value;
    let pass = password.value;
    console.log("Form submitted successfully! ");
    console.log(users,encryptWord(pass,"aed"))
    
});

/* app.auth().signInWithEmailAndPassword(email, pssword)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  }); */