// userr logout korar function
const handleLogout = () => {
   const token = localStorage.getItem('token');
   fetch("https://food-project-9vo4.onrender.com/user/logout/", {
       method: "POST",
       headers: {
           Authorization: `Token ${token}`,
           "Content-Type": "application/json"
       }
   })
   .then(res => res.json())
   .then(() => {
       localStorage.removeItem("token");
       localStorage.removeItem("user_id");
       window.location.href = "home.html";
       updateNavBar();
   });
};

// authentication status manually thik kori
const updateNavBar = () => {
   const token = localStorage.getItem('token');
   const signupLink = document.getElementById('signup-link');
   const loginLink = document.getElementById('login-link');
   const logoutLink = document.getElementById('logout-link');
   
   if (token) {
       signupLink.style.display = 'none';
       loginLink.style.display = 'none';
       logoutLink.style.display = 'block';
   } else {
       signupLink.style.display = 'block';
       loginLink.style.display = 'block';
       logoutLink.style.display = 'none';
   }
};
window.onload = updateNavBar;

//Registaration korar function
const handleRegistration = (event) => {
   event.preventDefault();
   const username = getValue("username");
   const first_name = getValue("first_name");
   const last_name = getValue("last_name");
   const email = getValue("email");
   const password = getValue("password");
   const confirm_password = getValue("confirm_password");

   const info = { username, first_name, last_name, email, password, confirm_password };

   if (password === confirm_password) {
       document.getElementById("error").innerText = "";
       if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
           fetch("https://food-project-9vo4.onrender.com/user/register/", {
               method: "POST",
               headers: { "content-type": "application/json" },
               body: JSON.stringify(info)
           })
           .then(res => res.json())
           .then(data => console.log(data));
       } else {
           document.getElementById("error").innerText = "Password must include minimum eight characters, at least one uppercase letter, one lowercase letter, and one number";
       }
   } else {
       document.getElementById("error").innerText = "Password and confirm password do not match";
       alert("Password and confirm password do not match");
   }
};

// Get value from input by ID
const getValue = (id) => {
   return document.getElementById(id).value;
};

// Handle user login
const handleLogin = (event) => {
   event.preventDefault();
   const username = getValue("login-username");
   const password = getValue("login-password");

   if (username && password) {
       fetch("https://food-project-9vo4.onrender.com/user/login/", {
           method: "POST",
           headers: { "content-type": "application/json" },
           body: JSON.stringify({ username, password }),
       })
       .then(res => res.json())
       .then(data => {
        console.log(data);
           if (data.token && data.user_id) {
               localStorage.setItem("token", data.token);
               localStorage.setItem("user_id", data.user_id);
               window.location.href = "home.html";
               updateNavBar();
           }
       });
   }
};

