// import { Stack } from 'expo-router';
// import { useEffect } from 'react';
// import { useRouter, useSegments } from 'expo-router';

// export default function RootLayout() {
//   const router = useRouter();
//   const segments = useSegments();

//   useEffect(() => {
//     // Redirect from index to login after splash
//     if (segments[0] === 'splash') {
//       setTimeout(() => {
//         router.replace('/login');
//       }, 2000);
//     }
//   }, [segments]);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="splash" />     {/* Home Screen */}
//       <Stack.Screen name="login" />     {/* Login Screen */}
//       <Stack.Screen name="signup" />    {/* Sign Up Screen */}
//       <Stack.Screen name="(tabs)" />    {/* Tab Screens */}
//     </Stack>
//   );
// }