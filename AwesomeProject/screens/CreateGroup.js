import { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';

const CreateGroupScreen = function({ navigation }) {
    const [list, setList] = useState([]);
    const inputRef = useRef()
    const keyExtractor = (item, index) => index.toString();
    const renderItem = ({ item }) => (
        <ListItem
          title={item}
          bottomDivider
        />
      );
    return (
        <View style={styles.container}>
          <Text>Invite participants</Text>
          <Input placeholder='Email of participant' ref={inputRef}></Input>
            <Button title="Add" buttonStyle={styles.button} 
            onPress={() => { if(inputRef.current) setList([...list, inputRef.current.value]); }}>
            </Button>
            <FlatList 
            keyExtractor={keyExtractor}
            data={list}
            renderItem={renderItem}>
            </FlatList>
        </View>
        );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    buttons: {
      flex: 1,
    },
  
    button: {
      marginTop: 10
    }
  });

export default CreateGroupScreen;