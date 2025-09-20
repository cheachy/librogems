import { signUp } from "./utils/auth.js";

// Store form data for later use
let formData = {};

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("new-email").value.trim();
  const password = document.getElementById("new-password").value;
  const first_name = document.getElementById("new-first_name").value.trim();
  const last_name = document.getElementById("new-last_name").value.trim();
  const nick_name = document.getElementById("new-nick_name").value.trim();
  const role = "user"; // default role

  // Store form data
  formData = { email, password, role, first_name, last_name, nick_name };

  // Show custom confirmation popup
  showConfirmationPopup(email);
});

function showConfirmationPopup(email) {
  const confirmationOverlay = document.getElementById("confirmation-overlay");
  const confirmationText = document.getElementById("confirmation");
  
  // Update confirmation message with email
  confirmationText.textContent = `Are you sure you want to create an account with email: "${email}"?`;
  
  // Show the modal overlay
  confirmationOverlay.classList.remove("hidden");
  
  // Add event listeners for Yes/No buttons
  const yesButton = confirmationOverlay.querySelector('button[type="yes"]');
  const noButton = confirmationOverlay.querySelector('button[type="no"]');
  
  // Remove any existing event listeners
  yesButton.replaceWith(yesButton.cloneNode(true));
  noButton.replaceWith(noButton.cloneNode(true));
  
  // Get fresh references after cloning
  const newYesButton = confirmationOverlay.querySelector('button[type="yes"]');
  const newNoButton = confirmationOverlay.querySelector('button[type="no"]');
  
  newYesButton.addEventListener("click", handleConfirmationYes);
  newNoButton.addEventListener("click", handleConfirmationNo);
}

function handleConfirmationYes() {
  // Hide confirmation modal
  document.getElementById("confirmation-overlay").classList.add("hidden");
  
  // Proceed with signup
  proceedWithSignup();
}

function handleConfirmationNo() {
  // Hide confirmation modal
  document.getElementById("confirmation-overlay").classList.add("hidden");
  
  // Do nothing - user cancelled
}

async function proceedWithSignup() {
  const { email, password, role, first_name, last_name, nick_name } = formData;
  
  // Inline notification elements
  const errorNotification = document.getElementById("signup-error-notification");
  const errorMessage = document.getElementById("signup-error-message");
  
  // Reset previous state
  if (errorNotification) {
    errorNotification.classList.add("hidden");
    errorNotification.classList.remove("success");
    if (errorMessage) {
      errorMessage.textContent = "";
    }
  }
  
  const { data, error } = await signUp(email, password, role, first_name, last_name, nick_name);

  if (error || !data) {
    if (errorNotification && errorMessage) {
      errorMessage.textContent = "You are already registered. Please sign in to your account.";
      errorNotification.classList.remove("hidden");
    }
  } else {
    if (errorNotification && errorMessage) {
      errorNotification.classList.add("success");
      errorMessage.textContent = "Signup successful! Please check your email to confirm your account.";
      errorNotification.classList.remove("hidden");
    }
    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}
