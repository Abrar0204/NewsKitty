import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout, List, Text, Button, Tooltip } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import categories from '../data/categories';

const SelectInterestsScreen = ({ navigation }) => {
  const [selectedTag, setSelectedTags] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  useEffect(() => {
    getInterests();
  }, []);

  const getInterests = async () => {
    const selectTagsString = await AsyncStorage.getItem('tags');
    const parsed = JSON.parse(selectTagsString);
    if (parsed) {
      setSelectedTags(parsed);
    }
  };

  const toggleTag = item => {
    if (selectedTag.includes(item)) {
      setSelectedTags(prev => prev.filter(t => t !== item));
    } else {
      setSelectedTags(prev => [...prev, item]);
    }
  };

  const saveInterests = async () => {
    try {
      if (selectedTag.length === 0) {
        setTooltipVisible(true);
        return;
      }
      await AsyncStorage.setItem('tags', JSON.stringify(selectedTag));
      navigation.navigate('Home');
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item, idx }) => {
    return (
      <View style={styles.category} key={item.title + idx}>
        <Text style={styles.categoryTitle} category="h6">
          {item.title}
        </Text>
        <View style={styles.tags}>
          {item.tags.map(tag => (
            <TouchableOpacity key={tag + idx} onPress={() => toggleTag(tag)}>
              <Text
                style={
                  selectedTag.includes(tag)
                    ? styles.selectedTag
                    : styles.unSelectedTag
                }>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  return (
    <Layout style={styles.layout}>
      <List style={styles.list} data={categories} renderItem={renderItem} />
      <Tooltip
        anchor={() => <Button onPress={saveInterests}>Save Interests</Button>}
        visible={tooltipVisible}
        onBackdropPress={() => setTooltipVisible(false)}>
        Please choose atleast one interest
      </Tooltip>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  list: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 15 },
  category: {
    marginVertical: 8,
  },
  categoryTitle: {
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  unSelectedTag: {
    fontSize: 16,

    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 5,
    backgroundColor: '#2E3A59',
  },
  selectedTag: {
    backgroundColor: '#8F9BB3',
    fontSize: 16,

    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 5,
  },
});

export default SelectInterestsScreen;
