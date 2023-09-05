import { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';

const CreateGroupScreen = function({ navigation }) {
    const [list, setList] = useState([]);
    const [entry, setEntry] = useState(null);
    const keyExtractor = (item, index) => index.toString();
    return (
        <View style={styles.container}>
          <Text>Invite participants</Text>
          <Input placeholder='Email of participant' value={entry} onChangeText={setEntry}></Input>
            <Button title="Add" buttonStyle={styles.button} 
            onPress={() => { 
              if(entry) {
                setList([...list, entry]);
                setEntry(null);
              }
            }}>
            </Button>
            <FlatList 
            keyExtractor={keyExtractor}
            data={list}
            renderItem={({item}) => <Text>{item}</Text>}>
            </FlatList>
            <Button title="Done" buttonStyle={styles.button} 
            onPress={() => { 
              //4. when Done pressed, create a group in server, add the creator as a user there, populate user's lat/long in user data
              //5. show the map and current live location of himself to the user now
            }}>
            </Button>
        </View>
        );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
    },
    button: {
      marginTop: 10
    }
  });

export default CreateGroupScreen;