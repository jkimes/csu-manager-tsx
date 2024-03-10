// this is not being used becaue i map the data in card list

import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./Card.style";
import { checkImageURL } from "../../utils";

export default function Card({ client, handleNavigate }) {
  //"handleNavigate" add this pack as a property whey you are ready to implement funciton in client list component
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          resizeMode="contain"
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <View>
          <Text style={styles.jobName} numberOfLines={1}>
            {" "}
            {client.id}{" "}
          </Text>
          <Text style={styles.jobType}>Client #: {client.ClientNumber}</Text>
        </View>
        <Text>: {client.PhoneNumer}</Text>
        <Text>Email: {client.Email}</Text>
        <Text>Address: {client.Address}</Text>
      </View>
    </TouchableOpacity>
  );
}
