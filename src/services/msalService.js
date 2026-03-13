import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

/*const msalConfig = {
  auth: {
    clientId: "2cce9efa-0b90-4413-931d-279166fada18", // Ton Client ID
    authority: "https://login.microsoftonline.com/906ab908-04f9-4a80-ba9c-875a36e77bc1", // Ton Tenant ID
    redirectUri: window.location.origin, 
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Error) console.error(message);
      }
    }
  }
};*/
const msalConfig = {
  auth: {
    clientId: "2cce9efa-0b90-4413-931d-279166fada18",
    authority: "https://login.microsoftonline.com/906ab908-04f9-4a80-ba9c-875a36e77bc1",
    // Remplace window.location.origin par l'URL exacte citée dans l'erreur :
    redirectUri: "https://yellow-sea-037043503.2.azurestaticapps.net", 
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
};

// Création de l'instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialisation (Indispensable en MSAL 3.0)
let isInitialized = false;
async function initializeMsal() {
  if (!isInitialized) {
    await msalInstance.initialize();
    isInitialized = true;
  }
}

export const loginWithMicrosoft = async () => {
  await initializeMsal();
  try {
    const loginRequest = {
      scopes: ["User.Read"],
    };
    const response = await msalInstance.loginPopup(loginRequest);
    return response.account; // Retourne les infos de l'utilisateur
  } catch (error) {
    console.error("Erreur MSAL:", error);
    throw error;
  }
};