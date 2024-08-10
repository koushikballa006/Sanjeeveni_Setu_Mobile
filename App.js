import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import PhoneAuthScreen from "./screens/PhoneAuthScreen";
import OtpVerificationScreen from "./screens/OtpVerificationScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import EmailOtpVerification from "./screens/EmailOtpVerificationScreen";
import HealthFormScreen from "./screens/HealthFormScreen";
import HomeTabs from "./screens/HomeTabs"; 
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const handleFinishLoading = () => {
    setAppIsReady(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" options={{ headerShown: false }}>
          {(props) => (
            <SplashScreen {...props} onFinish={handleFinishLoading} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="PhoneAuth"
          component={PhoneAuthScreen}
          options={{ title: "Phone Authentication" }}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
          options={{ title: "OTP Verification" }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: "Registration" }}
        />
        <Stack.Screen
          name="EmailOtpVerification"
          component={EmailOtpVerification}
          options={{ title: "Email OTP Verification" }}
        />
        <Stack.Screen
          name="HealthForm"
          component={HealthFormScreen} 
          options={{ title: "Health Form" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeTabs} // Use HomeTabs here
          options={{ headerShown: false }} // Hide header for Home screen
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen} // Add LoginScreen here
          options={{ title: "Login" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
