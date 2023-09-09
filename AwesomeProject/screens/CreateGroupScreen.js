import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { createGroup } from '../utils/hooks/useGroup';

const CreateGroupScreen = function({ navigation }) {
  const [list, setList] = useState([]);//list of emails state
  const [entry, setEntry] = useState(null);//input box state
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
            createGroup(list);
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