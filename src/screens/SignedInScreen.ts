import { FlatList, StyleSheet, View, Text } from "react-native";
import { useInvites } from "../utils/hooks/useInvites";
import { Background } from "../components/Background";
import { Button } from "react-native-elements";
import { Invite } from "../components/Invite";
import { getValueFromPath } from "../utils/data/selectors";
import { INVITE_ID } from "../utils/data/paths";
import { CREATE_GROUP_SCREEN_NAME } from "./screenConstants";
import { userSignOut } from "../utils/data/actions";

export default function SignedInScreen({
  navigation
}: any) {
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  const { receivedInvites } = useInvites();
  console.log("received invites");
  console.log(receivedInvites);
  return (
    // @ts-expect-error TS(2749): 'Background' refers to a value, but is being used ... Remove this comment to see the full error message
    <Background>
      // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
      <View style={styles.container}>
        // @ts-expect-error TS(2304): Cannot find name 'style'.
        <Text style={{ ...styles.text, fontSize: 18 }}>Invites received</Text>
        <FlatList
          // @ts-expect-error TS(2304): Cannot find name 'flexGrow'.
          flexGrow={1}
          // @ts-expect-error TS(2304): Cannot find name 'showsVerticalScrollIndicator'.
          showsVerticalScrollIndicator={true}
          // @ts-expect-error TS(2304): Cannot find name 'showsHorizontalScrollIndicator'.
          showsHorizontalScrollIndicator={false}
          // @ts-expect-error TS(2304): Cannot find name 'keyExtractor'.
          keyExtractor={(invite) => getValueFromPath(invite, INVITE_ID)}
          // @ts-expect-error TS(2304): Cannot find name 'data'.
          data={receivedInvites}
          // @ts-expect-error TS(2304): Cannot find name 'renderItem'.
          renderItem={({ item }) => <Invite invite={item} />}
        ></FlatList>
        // @ts-expect-error TS(2552): Cannot find name 'style'. Did you mean 'styles'?
        <View style={styles.horizontalItems}>
          // @ts-expect-error TS(2749): 'Button' refers to a value, but is being used as a... Remove this comment to see the full error message
          <Button
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            title="Create Group"
            // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
            buttonStyle={styles.button}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
            onPress={() => navigation.navigate(CREATE_GROUP_SCREEN_NAME)}
          // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
          />
          <Button
            // @ts-expect-error TS(2304): Cannot find name 'title'.
            title="Sign Out"
            // @ts-expect-error TS(2304): Cannot find name 'type'.
            type="outline"
            // @ts-expect-error TS(2304): Cannot find name 'buttonStyle'.
            buttonStyle={styles.button}
            // @ts-expect-error TS(2304): Cannot find name 'onPress'.
            onPress={userSignOut}
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    borderRadius: 5,
  },
  text: {
    color: "white",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  horizontalItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
