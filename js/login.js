function updateNavbar() {
  const loginBtn = document.getElementById('login-btn');
  if (!loginBtn) {
    return;
  }
  const access_token = localStorage.getItem('access_token');
  if (access_token) {
    // show logout button
    loginBtn.innerHTML = '<a onclick="logOut()""><i class="fa-solid fa-right-from-bracket fa-xl"></i></a>';
  } else {
    // show login button
    loginBtn.innerHTML = '<a href="login.html">Login</a>';
  }
}

// Define login function
async function login(email, password) {
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.access_token);
    // store access_token in local storage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_id', data.userId);
    // update navbar based on login status
    updateNavbar();
    window.location = 'shop.html'
    activeToaster("Success", "You successfully Logged In")
  })
  .catch(error => activeToaster("Error", error));
}

async function registr(fname, lname, email, phone, password) {
  fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: fname,
      secondName: lname,
      email: email,
      password: password,
      phone: phone,
      role: "user"
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.access_token);
      // store access_token in local storage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_id', data.userId);
      // update navbar based on login status
      updateNavbar();
      window.location = 'shop.html'
    })
    .catch(error => activeToaster("Error", error));
}

function logOut(){
  const access_token = localStorage.getItem('access_token');
  fetch('http://localhost:5000/logout', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    },
  })
    .then(response => {
      if (response.ok) {
        localStorage.setItem('access_token', '');
        localStorage.setItem('user_email', '');
        activeToaster("Success", "You successfully Logged Out")
        updateNavbar();
      } else {
        // response status code is outside the 200-299 range
        throw new Error('HTTP status ' + response.status);
      }
    })
    .then(data => {
      console.log();
    })
    .catch(error => activeToaster("Error", error));
}

const loginForm = document.getElementById('login-form');
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission
  const email = document.querySelector('#c_email').value;
  const password = document.querySelector('#c_Password').value;
  await login(email, password);
});

const registrForm = document.getElementById('register-form');
registrForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission
  const fname = document.querySelector('#c_fname').value;
  const lname = document.querySelector('#c_lname').value;
  const email = document.querySelector('#c_email_address').value;
  const phone = document.querySelector('#c_phone').value;
  const password = document.querySelector('#c_password').value;
  await registr(fname, lname, email, phone, password);
});
