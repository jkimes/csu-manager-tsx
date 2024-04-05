/**************************************************************************************************************/
/* Author: Jalon Kimes                                                                                        */
/* This file contains Helper functions that I use in multiple parts of the project                            */
/**************************************************************************************************************/
import { Linking, Platform } from "react-native";

export function DisplayJobStatus(bool: boolean) {
  return bool ? "Active" : "Inactive";
}

export const handleAddress = (street: string, city: string) => {
  if (street?.trim() === '""') {
    return "No address found";
  } else {
    return `${street}, ${city}`;
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

// renders the email if it is not null **slight issue when i delete email from contact Info it does not return No email found**
export const handleEmail = (email: string) => {
  console.log(`EMAIL: ${email}`);
  if (email === null || email.trim() === '""') {
    return "No email found";
  } else return email;
};

export function formatPhoneNumber(phone) {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ")-" + match[2] + "-" + match[3];
  }
  return "No number found";
}

export const handlePhone = (phone: number) => {
  if (phone === null || phone === 0) {
    return "No number found";
  } else return formatPhoneNumber(phone);
};

// Will open the Phone app and paste the phone number in it if the number is not 0
export function makePhoneCall(number: number) {
  if (number === 0) {
    return "No number to call";
  }
  if (Platform.OS === "android") {
    Linking.openURL(`tel:${number}`);
  } else {
    Linking.openURL(`telprompt:${number}`);
  }
}

// opens email app and passes the email to it
export function sendEmail(email: string) {
  console.log(`send email to ${email}`);
  Linking.openURL(`mailto:${email}`);
}

/////////////////////////// Add Client //////////////////////////////////
