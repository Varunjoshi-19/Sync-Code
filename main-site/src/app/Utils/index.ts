const handleGenerateCred = (name: string) => {
     // create and save in local storage

     const username = name.trim();
     let sanitizedName = "";
     for (const char of username) {
          if (char == " ") {
               sanitizedName += "-";
               continue;
          }
          sanitizedName += char;
     }

     const user = {
          id: generateRandomId(),
          name: name,
          email: `${sanitizedName}@codesync.com`

     }

     localStorage.setItem("user-detail", JSON.stringify(user));
     return user;

}

function generateRandomId(length = 30) {
     var chars =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");

     if (!length) {
          length = Math.floor(Math.random() * chars.length);
     }

     var str = "";
     for (var i = 0; i < length; i++) {
          str += chars[Math.floor(Math.random() * chars.length)];
     }
     return str;
}

export { handleGenerateCred }