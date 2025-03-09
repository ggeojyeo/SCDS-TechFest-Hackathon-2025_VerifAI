import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define available screens
export type RootStackParamList = {
    Home: undefined;
    Upload: undefined;
};

// Define screen props
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
