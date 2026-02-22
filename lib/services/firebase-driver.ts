// Firebase Auth Driver Service (T016)
// Per research.md R4: Firebase Auth for phone OTP via reCAPTCHA
// Firebase SDK is dynamically imported — no static dependency needed

let auth: any = null;
let recaptchaVerifier: any = null;
let confirmationResult: any = null;

class FirebaseDriver {
  private static instance: FirebaseDriver;
  private initialized = false;

  static getInstance(): FirebaseDriver {
    if (!this.instance) this.instance = new FirebaseDriver();
    return this.instance;
  }

  /** Initialize Firebase Auth (lazy - only when needed) */
  async init(config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
  }): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return;

    const { initializeApp } = await import('firebase/app');
    const { getAuth, RecaptchaVerifier } = await import('firebase/auth');

    const app = initializeApp(config);
    auth = getAuth(app);

    // Create invisible reCAPTCHA verifier
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });

    this.initialized = true;
  }

  /** Send OTP to phone number */
  async sendOTP(phoneNumber: string): Promise<boolean> {
    if (!auth || !recaptchaVerifier) {
      throw new Error('Firebase not initialized. Call init() first.');
    }

    const { signInWithPhoneNumber } = await import('firebase/auth');
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return true;
  }

  /** Verify OTP code and return user */
  async verifyOTP(code: string) {
    if (!confirmationResult) {
      throw new Error('No OTP request pending. Call sendOTP() first.');
    }

    const result = await confirmationResult.confirm(code);
    return result.user;
  }

  /** Check if Firebase is initialized */
  get isInitialized(): boolean {
    return this.initialized;
  }

  /** Reset state */
  reset(): void {
    confirmationResult = null;
  }
}

export const firebaseDriver = FirebaseDriver.getInstance();
