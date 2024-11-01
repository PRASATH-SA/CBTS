

    // Function to encrypt a word
    function encryptWord(word, secretKey) {
        return CryptoJS.AES.encrypt(word, secretKey).toString();
    }

    // Function to decrypt an encrypted word
    function decryptWord(encryptedWord, secretKey) {
        var bytes = CryptoJS.AES.decrypt(encryptedWord, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // Example usage
    
    // Encrypt
    var encryptedWord = encryptWord(word, secretKey);
    console.log("Encrypted:", encryptedWord);

    // Decrypt
    var decryptedWord = decryptWord(encryptedWord, secretKey);
    console.log("Decrypted:", decryptedWord);

    //onsubmit
    function submit(){
        var text = document.getElementById("encrypting");
        var key = document.getElementById("encKey");
        var value = document.getElementById("encrypted");
        var encrypted = encryptWord(text.value,key.value)
        value.innerHTML=encrypted;
        navigator.clipboard.writeText(encrypted);
    }
    
