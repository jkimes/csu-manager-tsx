/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file contains Helper functions that I use in multiple parts of the project                            */
/**************************************************************************************************************/
import { Alert, Linking, Platform } from "react-native";

export function DisplayJobStatus(bool: boolean) {
  return bool ? "Active" : "Inactive";
}

export const handleAddress = (address: string) => {
  if (address?.trim() === "" || address === null) {
    return "No address found";
  } else {
    return `${address}`;
  }
};

export const handleFullAddress = (
  street: string,
  city: string,
  zip: string
) => {
  if (street?.trim() === '""' || street === null) {
    return "No address found";
  } else {
    return `${street}, ${city} FL ${zip} `;
  }
};

export function handleName(name: string) {
  if (name?.trim() === "" || name === null) {
    return "No Name found";
  } else {
    return name;
  }
}

// renders the email if it is not null **slight issue when i delete email from contact Info it does not return No email found**
export const handleEmail = (email: string) => {
  if (email === null || email.trim() === "") {
    console.log(`No email found (helpeprFunctions.tsx)`);
    return "No email found";
  } else {
    console.log(`EMAIL: ${email} (helperFunctions.tsx)`);
    return email;
  }
};

export function formatPhoneNumber(phone) {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ")-" + match[2] + "-" + match[3];
  }
  return "Number must have 10 digits only ";
}

export const handlePhone = (phone: number) => {
  if (phone === null || phone === 0) {
    return "No number found";
  } else return formatPhoneNumber(phone);
};

// Will open the Phone app and paste the phone number in it if the number is not 0
export const handlePhoneInteraction = (phoneNumber: number) => {
  if (phoneNumber === 0) {
        return "No number to call";
      }else{
        var phoneNum = String(phoneNumber);
      }
  // Display an action sheet with options
  Alert.alert(
    "Choose Action",
    `What would you like to do with ${phoneNumber}?`,
    [
      {
        text: "Send Text",
        onPress: () => sendSMS(phoneNumber),
      },
      // {
      //   text: "Send WhatsApp Text",
      //   onPress: () => sendWhatsAppText(phoneNumber),
      // },
      {
        text: "Call",
        onPress: () => makePhoneCall(phoneNumber),
      },
      // {
      //   text: "Call via WhatsApp",
      //   onPress: () => callViaWhatsApp(phoneNumber),
      // },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true }
  );
};

// Function to make a normal phone call
const makePhoneCall = (phoneNumber: number) => {
  // var phoneNum = String(phoneNumber);
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url).catch((err) =>
    console.error("Error making phone call:", err)
  );
};

// Function to send a normal SMS
const sendSMS = (phoneNumber: number) => {
  // On Android, `sms:` should work directly, but iOS sometimes needs `&body=` to prefill the SMS text.
  const url = Platform.OS === "ios" ? `sms:${phoneNumber}&body=` : `sms:${phoneNumber}`;
  Linking.openURL(url).catch((err) =>
    console.error("Error sending SMS:", err)
  );
};

// Function to send a WhatsApp text
const sendWhatsAppText = (phoneNumber: number) => {
  const internationalPhone = formatPhoneForWhatsApp(phoneNumber);
  const url = `whatsapp://send?phone=${internationalPhone}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Error", "WhatsApp is not installed on your device.");
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) =>
      console.error("Error opening WhatsApp:", err)
    );
};

// Function to call via WhatsApp
const callViaWhatsApp = (phoneNumber: number) => {
  const internationalPhone = formatPhoneForWhatsApp(phoneNumber);
  const url = `whatsapp://call?phone=${internationalPhone}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Error", "WhatsApp is not installed on your device.");
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) =>
      console.error("Error making WhatsApp call:", err)
    );
};

// Helper function to format phone number for WhatsApp (must be in international format)
const formatPhoneForWhatsApp = (phoneNumber: number): string => {
  // Ensure the phone number starts with "+" and contains the country code
  if (!String(phoneNumber).startsWith("+")) {
    console.warn("Phone number is not in international format. Prepending '+' sign.");
    return `+${phoneNumber}`;
  }
  return String(phoneNumber);
};
// export function makePhoneCall(number: number) {
//   if (number === 0) {
//     return "No number to call";
//   }
//   if (Platform.OS === "android") {
//     Linking.openURL(`tel:${number}`);
//   } else {
//     Linking.openURL(`telprompt:${number}`);
//   }
// }

// opens email app and passes the email to it
export function sendEmail(email: string) {
  console.log(`send email to ${email}`);
  Linking.openURL(`mailto:${email}`);
}

/////////////////////////// Add Client //////////////////////////////////
