<script>
  import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { auth } from "$lib/firebase";

  // State management using Svelte 5 Runes
  let displayName = $state(''); // Changed from name to displayName
  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');

  // Email/Password Registration
  async function handleSignUp(e) {
    e.preventDefault();
    loading = true;
    errorMessage = '';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        // Saves their chosen handle/username str   aight to their account profile
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }

      console.log('Registered with display name:', userCredential.user.displayName);
      window.location.href = '/app'; 
    } catch (error) {
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }

  // Google Sign-In Action
  async function handleGoogleSignIn() {
    loading = true;
    errorMessage = '';
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      window.location.href = '/app';
    } catch (error) {
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>GoplayHK Sign Up</title>
</svelte:head>

<div class="page-container">
  <div class="auth-card">
    <div class="card-header">
      <h1>Create your account</h1>
      <p>Join ABC Sports today to find games and start playing.</p>
    </div>

    {#if errorMessage}
      <div class="error-alert">
        <span class="error-icon">⚠️</span>
        <p class="error-message">Error: {errorMessage}</p>
      </div>
    {/if}

    <button type="button" class="nsg-button" onclick={handleGoogleSignIn} disabled={loading}>
      <div class="nsg-icon-wrapper">
        <svg class="nsg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.55 2.85-2.17 5.27-4.59 6.89l7.14 5.53C43.51 36.12 46.5 30.68 46.5 24z"/>
          <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.14-5.53c-1.97 1.32-4.5 2.11-8.75 2.11-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </div>
      <span class="nsg-text">Sign up with Google</span>
    </button>

    <div class="divider">
      <span>or register with email</span>
    </div>

    <form onsubmit={handleSignUp}>
      <div class="input-group">
        <label for="displayName">Display Name</label>
        <input 
          type="text" 
          id="displayName" 
          bind:value={displayName} 
          placeholder="enter display name" 
          required 
          autocomplete="username"
        />
      </div>

      <div class="input-group">
        <label for="email">Email address</label>
        <input type="email" id="email" bind:value={email} placeholder="you@email.com" required autocomplete="email" />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} placeholder="Create a strong password" required autocomplete="new-password" minlength="6" />
        <p class="input-help">Must be at least 6 characters long.</p>
      </div>

      <button type="submit" class="submit-btn" disabled={loading}>
        {#if loading}Creating account...{:else}Sign Up{/if}
      </button>
    </form>

    <div class="card-footer">
      <p>Already have an account? <a href="/login" class="link">Sign In</a>.</p>
    </div>
  </div>
</div>

<style>
  /* Base Styles */
  .page-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 24px; }
  .auth-card { width: 100%; max-width: 440px; background-color: var(--card-bg); padding: 40px; border-radius: var(--radius-lg); box-shadow: var(--shadow); border: 1px solid var(--border-color); }
  .card-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; color: var(--text-dark); }
  .card-header p { color: var(--text-muted); font-size: 16px; margin-bottom: 32px; }
  form { display: flex; flex-direction: column; gap: 20px; }
  .input-group { display: flex; flex-direction: column; gap: 8px; }
  .input-group label { font-size: 14px; font-weight: 600; color: var(--text-dark); }
  .input-group input { padding: 12px 16px; font-size: 16px; color: var(--text-dark); background-color: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-md); transition: var(--transition); }
  .input-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(255, 59, 43, 0.15); }
  .input-help { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
  .submit-btn { padding: 14px; background-color: var(--primary); color: white; border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 700; cursor: pointer; transition: var(--transition); margin-top: 16px; }
  .submit-btn:hover { background-color: var(--primary-hover); }
  .submit-btn:disabled { background-color: #fca5a5; color: rgba(255, 255, 255, 0.7); cursor: not-allowed; }
  .error-alert { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: var(--radius-md); margin-bottom: 24px; }
  .error-message { font-size: 14px; color: #991b1b; }
  .card-footer { margin-top: 32px; text-align: center; border-top: 1px solid var(--border-color); padding-top: 24px; }
  .link { color: var(--primary); text-decoration: none; font-weight: 600; }
  .divider { text-align: center; position: relative; margin: 24px 0; }
  .divider::before { content: ""; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background-color: var(--border-color); z-index: 1; }
  .divider span { background-color: var(--card-bg); padding: 0 12px; font-size: 14px; color: var(--text-muted); position: relative; z-index: 2; }

  /* * OFFICIAL GOOGLE SIGN-IN BUTTON SPECIFICATIONS (Native Style Guide)
   */
  .nsg-button {
    -webkit-user-select: none;
    transition: background-color .218s, border-color .218s, box-shadow .218s;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dadce0;
    border-radius: var(--radius-md);
    box-shadow: none;
    box-sizing: border-box;
    color: #3c4043;
    cursor: pointer;
    font-family: 'Google Sans', arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    letter-spacing: 0.25px;
    padding: 0 12px;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .nsg-button:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #dee2e6;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
  }

  .nsg-button:active:not(:disabled) {
    background-color: #f1f3f4;
  }

  .nsg-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  .nsg-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
  }

  .nsg-icon {
    width: 100%;
    height: 100%;
  }

  .nsg-text {
    font-weight: 600;
    font-size: 15px;
    color: #1f1f1f;
  }
</style>