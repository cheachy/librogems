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
  const buttons = confirmationOverlay.querySelectorAll('button[type="button"]');
  const yesButton = buttons[0]; 
  const noButton = buttons[1];  
  
  // Remove any existing event listeners
  yesButton.replaceWith(yesButton.cloneNode(true));
  noButton.replaceWith(noButton.cloneNode(true));
  
  // Get fresh references after cloning
  const newButtons = confirmationOverlay.querySelectorAll('button[type="button"]');
  const newYesButton = newButtons[0]; 
  const newNoButton = newButtons[1];  
  
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

  if (error) {
    if (errorNotification && errorMessage) {
      // Handle specific error types
      if (error.message.includes("duplicate key")) {
        errorMessage.textContent = "An account with this email already exists. Please sign in instead.";
      } else if (error.message.includes("already registered")) {
        errorMessage.textContent = "You are already registered. Please sign in to your account.";
      } else {
        errorMessage.textContent = `Registration failed: ${error.message}`;
      }
      errorNotification.classList.remove("hidden");
    }
  } else if (!data || data.length === 0) {
    if (errorNotification && errorMessage) {
      errorMessage.textContent = "Registration failed. Please try again.";
      errorNotification.classList.remove("hidden");
    }
  } else {
    // Success case - data exists and has content
    if (errorNotification && errorMessage) {
      errorNotification.classList.add("success");
      errorMessage.textContent = "Account created! Please check your email and click the confirmation link to activate your account.";
      errorNotification.classList.remove("hidden");
    }
    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }
}
