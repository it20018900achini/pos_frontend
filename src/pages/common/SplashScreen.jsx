import { settings } from "../../constant";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center 
                    bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      
      {/* Logo */}
      {/* <img
        src="/logo.svg" // Replace with your logo
        alt="App Logo"
        className="w-20 h-20 animate-pulse"
      /> */}

      {/* Brand Name */}
      <h1 className="mt-4 text-2xl font-semibold animate-fadeIn">
        ✨ {settings?.businessName}
      </h1>

      {/* Progress Indicator */}
      <div className="mt-6 w-48 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-blue-600 dark:bg-blue-400 animate-progress"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
