const isAuthenticated = () => {
    // Check if a token exists in localStorage
    return !!localStorage.getItem('token');
};



const loadUserDetails = () => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
      console.error('No user_id found in localStorage.');
      return;
  }
  fetch(`https://final-food-project.onrender.com/user/user_details/${user_id}/`)
    .then((res) => {  return res.json(); })
    .then((data) => {
        userDetailsFull(data);
        console.log(data);
    })
    .catch((error) => console.error('Error fetching user details:', error));
};

const userDetailsFull = (info) => {
  const parent = document.getElementById("user_profile");
  
  if (!parent) {
      console.error('Element with id "user_profile" not found.');
      return;
  }

  const div = document.createElement("div");
  div.classList.add("profile_div_class");
  
  // <img src="${info.profile_image || 'https://via.placeholder.com/100'}" alt="User Photo">
  div.innerHTML = `
      <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
              <div class="profile-card">
                  <hr/>
                  <h2>Hello, </strong> ${info.user.first_name || 'No First Name'}  ${info.user.last_name || 'No last Name'}</h2>
                  <p><strong>Your Username:- </strong> ${info.user.username || 'No Username Available'}</p>
                  <p><strong>Your Email Account:- </strong> ${info.user.email || 'No Email'}</p>
                   <hr/>
              </div>
          </div>
      </div>
  `;

  parent.appendChild(div);

};

loadUserDetails();

