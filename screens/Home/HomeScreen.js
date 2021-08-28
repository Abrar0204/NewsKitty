import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Icon, Layout, List, Text } from '@ui-kitten/components';
import Config from 'react-native-config';
import axios from 'axios';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useIsFocused } from '@react-navigation/core';
import NewsCard from './components/NewsCard';

const api = axios.create({
  baseURL: 'https://newsapi.org/v2/',
  params: {
    apiKey: Config.NEWS_API_KEY,
  },
});
const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const curPageNumber = useRef(1);
  const flatListRef = useRef();

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, y: 0 });
      }
      getFeed(-1);
    }
  }, [getFeed, isFocused]);

  const renderItem = ({ item }) => {
    return <NewsCard item={item} />;
  };

  const getFeed = useCallback(
    async pageNumber => {
      try {
        console.log(pageNumber);
        setLoading(true);
        const selectTagsString = await AsyncStorage.getItem('tags');

        if (selectTagsString === '[]' || selectTagsString === null) {
          navigation.navigate('Interests');
          return;
        }
        const selectedTags = JSON.parse(selectTagsString) || [];
        const q = selectedTags.join(' OR ');

        const res = await api.get('everything', {
          params: {
            q,
            pageSize: 50,
            page: pageNumber > 0 ? pageNumber : 1,
            sortBy: 'publishedAt',
            language: 'en',
          },
        });
        setError(false);
        if (pageNumber === -1) {
          setData(res.data.articles);
        } else {
          setData(prev => [...prev, ...res.data.articles]);
        }

        setLoading(false);
      } catch (err) {
        if (err.message.includes('429')) {
          setError(true);
        }

        setLoading(false);
        console.log(err);
      }
    },
    [navigation],
  );

  return (
    <>
      <Layout style={styles.layout}>
        <List
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          onRefresh={() => getFeed(-1)}
          refreshing={loading}
          onEndReached={() => getFeed(++curPageNumber.current)}
          onEndReachedThreshold={0.7}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.textCenter}>
                {error
                  ? 'Oops! Something went wrong...'
                  : data.length
                  ? loading
                    ? 'Loading more...'
                    : 'End'
                  : ''}
              </Text>
            </View>
          }
        />

        <Button
          style={styles.fab}
          accessoryLeft={<Icon name="arrow-up-outline" />}
          onPress={() =>
            flatListRef.current.scrollToOffset({ animated: true, y: 0 })
          }
        />
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#1A2138',
  },

  fab: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 20,
    right: 20,
    borderRadius: 25,
  },

  footer: {
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: 50,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default HomeScreen;
