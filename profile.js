// ==================================== Dark Mode =============================================================
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === "dark") icon.classList.replace("fa-sun", "fa-moon");
    else icon.classList.replace("fa-moon", "fa-sun");
} else {
    body.classList.add("light");
}

themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light")) {
        body.classList.replace("light", "dark");
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.replace("dark", "light");
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "light");
    }
});


//========================= Profile Page  =============================================//


const signInForm = document.getElementById("profileForm"); 
const signUpForm = document.getElementById("signUpForm");   
const switchToSignUp = document.getElementById("switchToSignUp"); 
const switchToSignIn = document.getElementById("switchToSignIn"); 


function switchToForm(formToShow, formToHide) {
    formToHide.style.display = "none";
    formToShow.style.display = "block"; 
}


if (switchToSignUp) {
    switchToSignUp.addEventListener("click", () => {
        switchToForm(signUpForm, signInForm);
    });
}

if (switchToSignIn) {
    switchToSignIn.addEventListener("click", () => {
        switchToForm(signInForm, signUpForm);
    });
}


//=================================== Sign Up / Sign In  =========================================//

const User = "users";
const loggedInUserKey = "loggedInUser";


function displayAlert(title, text, icon) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'حسناً'
    });
}

// 1. Sign Up  
if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();



        //  signupUserName, signupEmail, signupPassword
        const username = document.getElementById("signupUserName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim(); 

        if (username.length < 3 || password.length < 6 || !email.includes("@")) {
            displayAlert("خطأ في الإدخال", "الرجاء إدخال بيانات صحيحة (كلمة المرور 6 أحرف على الأقل).", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem(User)) || [];
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            displayAlert("المستخدم موجود", "هذا البريد الإلكتروني مُسجل بالفعل. يرجى تسجيل الدخول.", "warning");
            return;
        }

        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem(User, JSON.stringify(users));
        
 
        localStorage.setItem(loggedInUserKey, JSON.stringify(newUser));

  
        displayAlert("تم إنشاء الحساب بنجاح", `أهلاً بك يا ${username}!`, "success")
        .then(() => {
            window.location.href = "index.html"; // التوجيه للصفحة الرئيسية
        });
        
        signUpForm.reset();
    });
}


// 2. Sign In 
if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
        e.preventDefault();

  // email, password
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        let users = JSON.parse(localStorage.getItem(User)) || [];

        const existingUser = users.find(user => user.email === email && user.password === password);
        if (existingUser) {
            localStorage.setItem(loggedInUserKey, JSON.stringify(existingUser));
            
        
            displayAlert("تم تسجيل الدخول بنجاح", `مرحباً بك مجدداً يا ${existingUser.username}!`, "success")
            .then(() => {
                window.location.href = "index.html"; // التوجيه للصفحة الرئيسية
            });

        } else {
            displayAlert("فشل تسجيل الدخول", "بيانات تسجيل الدخول غير صحيحة. يرجى المحاولة مرة أخرى.", "error");
        }
    });
}